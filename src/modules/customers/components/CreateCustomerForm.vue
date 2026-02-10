<script setup lang="ts">
import { reactive, ref } from "vue";
import SectionCard from "@core/components/SectionCard.vue";
import { createCustomer } from "../services/customerService";
import { useAuthStore } from "@modules/auth/stores/authStore";
import { useActivityStore } from "@modules/dashboard/stores/activityStore";

const authStore = useAuthStore();
const activityStore = useActivityStore();

const formState = reactive({
  name: "",
  email: "",
  phoneNumber: "",
});

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const clearPhone = () => {
  formState.phoneNumber = "";
};

const submit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!authStore.token) {
    errorMessage.value = "Authenticate first to create a customer.";
    return;
  }

  if (!formState.name.trim() || !formState.email.trim()) {
    errorMessage.value = "Name and email are required.";
    return;
  }

  try {
    isLoading.value = true;
    const response = await createCustomer(authStore.token, {
      name: formState.name.trim(),
      email: formState.email.trim(),
      phoneNumber: formState.phoneNumber.trim() || null,
    });

    activityStore.setLastCustomer(response.id, response.name, response.email);
    successMessage.value = `Customer created: ${response.id}`;
    formState.name = "";
    formState.email = "";
    formState.phoneNumber = "";
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Customer creation failed.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <SectionCard
    title="Create customer"
    subtitle="POST /api/Customers"
    badge="Customers"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="ui-label" for="customer-name">Name</label>
          <input
            id="customer-name"
            v-model="formState.name"
            class="ui-input mt-2"
            placeholder="Jamie Lee"
          />
        </div>
        <div>
          <label class="ui-label" for="customer-email">Email</label>
          <input
            id="customer-email"
            v-model="formState.email"
            class="ui-input mt-2"
            placeholder="jamie@example.com"
            type="email"
          />
        </div>
      </div>
      <div>
        <label class="ui-label" for="customer-phone">Phone (optional)</label>
        <input
          id="customer-phone"
          v-model="formState.phoneNumber"
          class="ui-input mt-2"
          placeholder="+1 555 0101"
        />
      </div>
      <div class="flex flex-wrap gap-3">
        <button class="ui-button" type="submit" :disabled="isLoading">
          {{ isLoading ? "Creating..." : "Create customer" }}
        </button>
        <button class="ui-button-ghost" type="button" @click="clearPhone">
          Clear phone
        </button>
      </div>
      <p v-if="successMessage" class="text-sm font-semibold text-emerald-600">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="text-sm font-semibold text-rose-600">
        {{ errorMessage }}
      </p>
    </form>
  </SectionCard>
</template>
