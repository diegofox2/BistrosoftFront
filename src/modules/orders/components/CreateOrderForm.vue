<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import SectionCard from "@core/components/SectionCard.vue";
import StatusPill from "@core/components/StatusPill.vue";
import { createOrder } from "../services/orderService";
import { useAuthStore } from "@modules/auth/stores/authStore";
import { useActivityStore } from "@modules/dashboard/stores/activityStore";
import { getOrderStatusLabel } from "../constants/orderStatus";
import type { CreateOrderRequestItem, CreateOrderResponse } from "../types";

const authStore = useAuthStore();
const activityStore = useActivityStore();

const formState = reactive({
  customerId: "",
  items: [{ productId: "", quantity: 1 } as CreateOrderRequestItem],
});

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const lastOrder = ref<CreateOrderResponse | null>(null);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const formatDate = (value: string) => new Date(value).toLocaleString();

const canSubmit = computed(() =>
  Boolean(
    authStore.token &&
    formState.customerId.trim() &&
    formState.items.length &&
    formState.items.every((item) => item.productId.trim() && item.quantity > 0),
  ),
);

const addItem = () => {
  formState.items.push({ productId: "", quantity: 1 });
};

const resetItems = () => {
  formState.items = [{ productId: "", quantity: 1 }];
};

const removeItem = (index: number) => {
  if (formState.items.length === 1) {
    return;
  }

  formState.items.splice(index, 1);
};

const submit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!authStore.token) {
    errorMessage.value = "Authenticate first to create an order.";
    return;
  }

  if (!canSubmit.value) {
    errorMessage.value = "Fill in customer id and at least one item.";
    return;
  }

  try {
    isLoading.value = true;
    const response = await createOrder(authStore.token, {
      customerId: formState.customerId.trim(),
      items: formState.items.map((item) => ({
        productId: item.productId.trim(),
        quantity: item.quantity,
      })),
    });

    lastOrder.value = response;
    activityStore.setLastOrder(
      response.orderId,
      response.status,
      response.totalAmount,
    );
    successMessage.value = `Order created: ${response.orderId}`;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Order creation failed.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <SectionCard title="Create order" subtitle="POST /api/Orders" badge="Orders">
    <div class="space-y-5">
      <div>
        <label class="ui-label" for="order-customer">Customer id</label>
        <input
          id="order-customer"
          v-model="formState.customerId"
          class="ui-input mt-2"
          placeholder="Guid"
        />
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-700">Items</p>
          <button class="ui-button-ghost" type="button" @click="addItem">
            Add item
          </button>
        </div>
        <div
          v-for="(item, index) in formState.items"
          :key="index"
          class="grid gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 sm:grid-cols-[1fr_140px_auto]"
        >
          <div>
            <label class="ui-label">Product id</label>
            <input
              v-model="item.productId"
              class="ui-input mt-2"
              placeholder="Guid"
            />
          </div>
          <div>
            <label class="ui-label">Quantity</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="ui-input mt-2"
              placeholder="1"
            />
          </div>
          <div class="flex items-end">
            <button
              class="ui-button-secondary"
              type="button"
              @click="removeItem(index)"
            >
              Remove
            </button>
          </div>
        </div>
        <p class="text-xs text-slate-500">
          Product ids are not exposed in the API yet. Use ids already stored in
          the database.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          class="ui-button"
          type="button"
          @click="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? "Creating..." : "Create order" }}
        </button>
        <button class="ui-button-secondary" type="button" @click="resetItems">
          Reset items
        </button>
      </div>
      <p v-if="successMessage" class="text-sm font-semibold text-emerald-600">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="text-sm font-semibold text-rose-600">
        {{ errorMessage }}
      </p>
      <div
        v-if="lastOrder"
        class="rounded-2xl border border-slate-200 bg-white/70 p-4"
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          Last order
        </p>
        <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-700">
              {{ lastOrder.orderId }}
            </p>
            <p class="text-xs text-slate-500">
              {{ formatDate(lastOrder.createdAt) }}
            </p>
          </div>
          <StatusPill :value="lastOrder.status" />
        </div>
        <p class="mt-3 text-sm text-slate-700">
          Total: {{ formatCurrency(lastOrder.totalAmount) }} -
          {{ getOrderStatusLabel(lastOrder.status) }}
        </p>
      </div>
    </div>
  </SectionCard>
</template>
