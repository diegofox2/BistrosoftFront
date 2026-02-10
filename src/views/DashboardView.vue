<script setup lang="ts">
import { computed, ref } from "vue";
import DashboardHeader from "../components/DashboardHeader.vue";
import CreateCustomerForm from "../components/CreateCustomerForm.vue";
import CustomerLookup from "../components/CustomerLookup.vue";
import CreateOrderForm from "../components/CreateOrderForm.vue";
import OrderStatusForm from "../components/OrderStatusForm.vue";
import ActivityOverview from "../components/ActivityOverview.vue";

const activePanel = ref<"customers" | "orders" | null>(null);

const panelTitle = computed(() => {
  if (activePanel.value === "customers") return "Customer actions";
  if (activePanel.value === "orders") return "Order actions";
  return "Select a section";
});
</script>

<template>
  <div class="min-h-screen">
    <DashboardHeader />
    <main class="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10">
      <div class="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside
          class="h-fit rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60"
        >
          <p class="ui-label">Panel</p>
          <div class="mt-4 space-y-2">
            <button
              class="w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition"
              :class="
                activePanel === 'customers'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300'
              "
              type="button"
              @click="activePanel = 'customers'"
            >
              Customers
              <span class="mt-2 block text-xs font-normal text-white/80"
                >Create + lookup</span
              >
            </button>
            <button
              class="w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition"
              :class="
                activePanel === 'orders'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300'
              "
              type="button"
              @click="activePanel = 'orders'"
            >
              Orders
              <span class="mt-2 block text-xs font-normal text-white/80"
                >Create + status</span
              >
            </button>
          </div>
        </aside>

        <section class="space-y-6">
          <template v-if="activePanel">
            <div>
              <p class="ui-label">Workspace</p>
              <h2
                class="mt-2 text-2xl font-display font-semibold text-slate-900"
              >
                {{ panelTitle }}
              </h2>
              <p class="mt-2 text-sm text-slate-600">
                Select a section on the left to focus the main panel.
              </p>
            </div>

            <div
              v-if="activePanel === 'customers'"
              class="grid gap-6 lg:grid-cols-2"
            >
              <CreateCustomerForm />
              <CustomerLookup />
            </div>
            <div v-else class="grid gap-6 lg:grid-cols-2">
              <CreateOrderForm />
              <OrderStatusForm />
            </div>
          </template>

          <template v-else>
            <div />
          </template>
        </section>
      </div>

      <div class="mt-8">
        <ActivityOverview />
      </div>
    </main>
  </div>
</template>
