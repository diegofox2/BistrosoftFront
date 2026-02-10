<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import SectionCard from "./SectionCard.vue";
import StatusPill from "./StatusPill.vue";
import { getCustomer, getCustomerOrders } from "../services/customerService";
import { useAuthStore } from "../stores/authStore";
import type { CustomerDetails, CustomerOrder } from "../types/api";

const authStore = useAuthStore();

const state = reactive({
  customerId: "",
});

const customer = ref<CustomerDetails | null>(null);
const orders = ref<CustomerOrder[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");

const summaryOrders = computed(() => customer.value?.orders ?? []);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

const formatDate = (value: string) => new Date(value).toLocaleString();

const loadCustomer = async () => {
  errorMessage.value = "";
  customer.value = null;
  orders.value = [];

  if (!authStore.token) {
    errorMessage.value = "Authenticate first to load customer data.";
    return;
  }

  if (!state.customerId.trim()) {
    errorMessage.value = "Customer id is required.";
    return;
  }

  try {
    isLoading.value = true;
    const response = await getCustomer(
      authStore.token,
      state.customerId.trim(),
    );
    customer.value = response;
    orders.value = await getCustomerOrders(
      authStore.token,
      state.customerId.trim(),
    );
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Customer lookup failed.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <SectionCard
    title="Find customer"
    subtitle="GET /api/Customers/{id} + /orders"
    badge="Lookup"
  >
    <div class="space-y-4">
      <div>
        <label class="ui-label" for="lookup-customer">Customer id</label>
        <div class="mt-2 flex flex-wrap gap-3">
          <input
            id="lookup-customer"
            v-model="state.customerId"
            class="ui-input flex-1"
            placeholder="Guid"
          />
          <button
            class="ui-button"
            type="button"
            @click="loadCustomer"
            :disabled="isLoading"
          >
            {{ isLoading ? "Loading..." : "Load" }}
          </button>
        </div>
      </div>

      <p v-if="errorMessage" class="text-sm font-semibold text-rose-600">
        {{ errorMessage }}
      </p>

      <div
        v-if="customer"
        class="rounded-2xl border border-slate-200 bg-white/70 p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
            >
              Customer
            </p>
            <p class="mt-2 text-lg font-display font-semibold text-slate-900">
              {{ customer.name }}
            </p>
            <p class="text-sm text-slate-600">{{ customer.email }}</p>
            <p v-if="customer.phoneNumber" class="text-sm text-slate-600">
              {{ customer.phoneNumber }}
            </p>
          </div>
          <span class="ui-badge">Orders: {{ summaryOrders.length }}</span>
        </div>
      </div>

      <div v-if="summaryOrders.length" class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-700">Summary orders</p>
          <span
            class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
          >
            {{ summaryOrders.length }} total
          </span>
        </div>
        <div class="space-y-2">
          <div
            v-for="order in summaryOrders"
            :key="order.id"
            class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3"
          >
            <div>
              <p class="text-sm font-semibold text-slate-700">{{ order.id }}</p>
              <p class="text-xs text-slate-500">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <StatusPill :value="order.status" />
              <span class="text-sm font-semibold text-slate-700">
                {{ formatCurrency(order.totalAmount) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="orders.length" class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-700">Order items</p>
          <span
            class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
          >
            Detailed view
          </span>
        </div>
        <div class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.orderId"
            class="rounded-2xl border border-slate-200 bg-white/70 p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-700">
                  {{ order.orderId }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <StatusPill :value="order.status" />
                <span class="text-sm font-semibold text-slate-700">
                  {{ formatCurrency(order.totalAmount) }}
                </span>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div
                v-for="item in order.items"
                :key="item.productId"
                class="flex flex-wrap items-center justify-between rounded-xl border border-slate-100 bg-white/80 px-3 py-2 text-xs text-slate-600"
              >
                <span>Product: {{ item.productId }}</span>
                <span>Qty: {{ item.quantity }}</span>
                <span>Unit: {{ formatCurrency(item.unitPrice) }}</span>
                <span
                  >Total:
                  {{ formatCurrency(item.unitPrice * item.quantity) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <p
        v-if="customer && !summaryOrders.length"
        class="text-sm text-slate-500"
      >
        No orders found for this customer yet.
      </p>
    </div>
  </SectionCard>
</template>
