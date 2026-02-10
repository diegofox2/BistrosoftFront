<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import { useActivityStore } from "../stores/activityStore";

const activityStore = useActivityStore();

const formatTimestamp = (value: string) => new Date(value).toLocaleString();
</script>

<template>
  <SectionCard
    title="Recent activity"
    subtitle="Latest writes triggered from this dashboard"
    badge="Activity"
  >
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white/70 p-4">
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          Customer
        </p>
        <p class="mt-3 text-sm font-semibold text-slate-700">
          {{ activityStore.lastCustomer?.id || "No customer yet" }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          {{
            activityStore.lastCustomer?.details ||
            "Create a customer to log activity."
          }}
        </p>
        <p
          v-if="activityStore.lastCustomer"
          class="mt-3 text-xs text-slate-400"
        >
          {{ formatTimestamp(activityStore.lastCustomer.timestamp) }}
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white/70 p-4">
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          Order
        </p>
        <p class="mt-3 text-sm font-semibold text-slate-700">
          {{ activityStore.lastOrder?.id || "No order yet" }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          {{
            activityStore.lastOrder?.details ||
            "Create an order to log activity."
          }}
        </p>
        <p v-if="activityStore.lastOrder" class="mt-3 text-xs text-slate-400">
          {{ formatTimestamp(activityStore.lastOrder.timestamp) }}
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white/70 p-4">
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          Status update
        </p>
        <p class="mt-3 text-sm font-semibold text-slate-700">
          {{ activityStore.lastStatusUpdate?.id || "No status change yet" }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          {{
            activityStore.lastStatusUpdate?.details ||
            "Update an order status to log activity."
          }}
        </p>
        <p
          v-if="activityStore.lastStatusUpdate"
          class="mt-3 text-xs text-slate-400"
        >
          {{ formatTimestamp(activityStore.lastStatusUpdate.timestamp) }}
        </p>
      </div>
    </div>
  </SectionCard>
</template>
