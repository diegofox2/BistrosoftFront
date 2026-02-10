<script setup lang="ts">
import { computed, reactive } from "vue";
import SectionCard from "./SectionCard.vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const formState = reactive({
  username: authStore.username,
  password: "",
});

const tokenPreview = computed(() => {
  if (!authStore.token) {
    return "No token loaded yet.";
  }

  return `${authStore.token.slice(0, 18)}...${authStore.token.slice(-10)}`;
});

const submit = async () => {
  await authStore.login(formState.username, formState.password);
  formState.password = "";
};
</script>

<template>
  <SectionCard
    title="Authentication"
    subtitle="Get a JWT token from /api/Auth/token to unlock the dashboard."
    badge="Access"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="ui-label" for="auth-username">Username</label>
          <input
            id="auth-username"
            v-model="formState.username"
            class="ui-input mt-2"
            placeholder="demo-user"
            autocomplete="username"
          />
        </div>
        <div>
          <label class="ui-label" for="auth-password">Password</label>
          <input
            id="auth-password"
            v-model="formState.password"
            class="ui-input mt-2"
            type="password"
            placeholder="Any value works"
            autocomplete="current-password"
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          class="ui-button"
          type="submit"
          :disabled="authStore.status === 'loading'"
        >
          {{
            authStore.status === "loading"
              ? "Requesting token..."
              : "Request token"
          }}
        </button>
        <button
          class="ui-button-secondary"
          type="button"
          @click="authStore.logout"
        >
          Clear token
        </button>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white/70 p-4">
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          Token preview
        </p>
        <p class="mt-2 text-sm text-slate-700">{{ tokenPreview }}</p>
      </div>
      <p
        v-if="authStore.errorMessage"
        class="text-sm font-semibold text-rose-600"
      >
        {{ authStore.errorMessage }}
      </p>
    </form>
  </SectionCard>
</template>
