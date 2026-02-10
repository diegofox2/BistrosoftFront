<script setup lang="ts">
import { computed } from "vue";
import { API_BASE_URL } from "../config";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const statusLabel = computed(() =>
  authStore.isAuthenticated
    ? `Connected as ${authStore.username || "user"}`
    : "Not authenticated",
);
</script>

<template>
  <header class="px-4 pt-10 sm:px-6 lg:px-10">
    <div class="mx-auto max-w-7xl">
      <div
        class="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 px-8 py-10 shadow-xl shadow-slate-200/60 backdrop-blur"
      >
        <div
          class="absolute right-6 top-6 hidden h-28 w-28 rounded-full bg-sky-200/40 blur-3xl lg:block"
        />
        <div
          class="absolute bottom-6 left-10 hidden h-16 w-16 rounded-full bg-blue-200/40 blur-2xl lg:block"
        />
        <div class="relative">
          <p class="ui-label">Bistrosoft Ops</p>
          <h1
            class="mt-3 text-3xl font-display font-semibold text-slate-900 sm:text-4xl"
          >
            Customer and Order Command Center
          </h1>
          <p class="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Manage customers, create orders, and track status changes using the
            backend API.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <span class="ui-badge">API: {{ API_BASE_URL }}</span>
            <span class="ui-badge">{{ statusLabel }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
