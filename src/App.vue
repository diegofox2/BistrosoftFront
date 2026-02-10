<script setup lang="ts">
import DashboardHeader from "./components/DashboardHeader.vue";
import AuthPanel from "./components/AuthPanel.vue";
import CreateCustomerForm from "./components/CreateCustomerForm.vue";
import CustomerLookup from "./components/CustomerLookup.vue";
import CreateOrderForm from "./components/CreateOrderForm.vue";
import OrderStatusForm from "./components/OrderStatusForm.vue";
import ActivityOverview from "./components/ActivityOverview.vue";
</script>

<template>
  <div class="min-h-screen">
    <DashboardHeader />
    <main class="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-10">
      <div class="grid gap-6 lg:grid-cols-2">
        <AuthPanel />
        <div class="lg:col-span-2">
          <ActivityOverview />
        </div>
        <CreateCustomerForm />
        <CustomerLookup />
        <CreateOrderForm />
        <OrderStatusForm />
      </div>
    </main>
  </div>
</template>
