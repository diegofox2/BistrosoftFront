<script setup lang="ts">
import { reactive, ref } from "vue";
import SectionCard from "@core/components/SectionCard.vue";
import StatusPill from "@core/components/StatusPill.vue";
import { updateOrderStatus } from "../services/orderService";
import { useAuthStore } from "@modules/auth/stores/authStore";
import { useActivityStore } from "@modules/dashboard/stores/activityStore";
import { ORDER_STATUS_OPTIONS } from "../constants/orderStatus";
import type { OrderStatusResponse } from "../types";

const authStore = useAuthStore();
const activityStore = useActivityStore();

const formState = reactive({
  orderId: "",
  newStatus: ORDER_STATUS_OPTIONS[0]?.value ?? 0,
});

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const lastUpdate = ref<OrderStatusResponse | null>(null);

const submit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!authStore.token) {
    errorMessage.value = "Authenticate first to update status.";
    return;
  }

  if (!formState.orderId.trim()) {
    errorMessage.value = "Order id is required.";
    return;
  }

  try {
    isLoading.value = true;
    const response = await updateOrderStatus(
      authStore.token,
      formState.orderId.trim(),
      formState.newStatus,
    );

    lastUpdate.value = response;
    activityStore.setLastStatusUpdate(response.orderId, response.status);
    successMessage.value = `Status updated for ${response.orderId}`;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Status update failed.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <SectionCard
    title="Update order status"
    subtitle="PUT /api/Orders/{id}/status"
    badge="Status"
  >
    <div class="space-y-4">
      <div>
        <label class="ui-label" for="status-order">Order id</label>
        <input
          id="status-order"
          v-model="formState.orderId"
          class="ui-input mt-2"
          placeholder="Guid"
        />
      </div>
      <div>
        <label class="ui-label" for="status-value">New status</label>
        <select
          id="status-value"
          v-model="formState.newStatus"
          class="ui-input mt-2"
        >
          <option
            v-for="status in ORDER_STATUS_OPTIONS"
            :key="status.value"
            :value="status.value"
          >
            {{ status.label }}
          </option>
        </select>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          class="ui-button"
          type="button"
          @click="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? "Updating..." : "Update status" }}
        </button>
      </div>
      <p v-if="successMessage" class="text-sm font-semibold text-emerald-600">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="text-sm font-semibold text-rose-600">
        {{ errorMessage }}
      </p>
      <div
        v-if="lastUpdate"
        class="rounded-2xl border border-slate-200 bg-white/70 p-4"
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          Last update
        </p>
        <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm font-semibold text-slate-700">
            {{ lastUpdate.orderId }}
          </p>
          <StatusPill :value="lastUpdate.status" />
        </div>
      </div>
    </div>
  </SectionCard>
</template>
