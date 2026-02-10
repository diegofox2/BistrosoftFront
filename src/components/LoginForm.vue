<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import SectionCard from "./SectionCard.vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const formState = reactive({
  username: authStore.username,
  password: "",
});

const submit = async () => {
  await authStore.login(formState.username, formState.password);
  formState.password = "";

  if (authStore.isAuthenticated) {
    const redirect =
      typeof route.query.redirect === "string" ? route.query.redirect : "/";
    await router.replace(redirect);
  }
};
</script>

<template>
  <SectionCard
    title="Login"
    subtitle="Request a JWT token to access customers and orders."
    badge="Access"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="ui-label" for="login-username">Username</label>
          <input
            id="login-username"
            v-model="formState.username"
            class="ui-input mt-2"
            placeholder="demo-user"
            autocomplete="username"
          />
        </div>
        <div>
          <label class="ui-label" for="login-password">Password</label>
          <input
            id="login-password"
            v-model="formState.password"
            class="ui-input mt-2"
            type="password"
            placeholder="Your password"
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
          {{ authStore.status === "loading" ? "Signing in..." : "Sign in" }}
        </button>
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
