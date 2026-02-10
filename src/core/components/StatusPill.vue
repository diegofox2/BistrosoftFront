<script setup lang="ts">
import { computed } from "vue";
import { getOrderStatusLabel } from "@modules/orders/constants/orderStatus";

const props = defineProps<{ value: number | string }>();

const label = computed(() => getOrderStatusLabel(props.value));

const toneClass = computed(() => {
  const numericValue =
    typeof props.value === "string" ? Number(props.value) : props.value;

  switch (numericValue) {
    case 1:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case 2:
      return "bg-sky-50 text-sky-700 border-sky-200";
    case 3:
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case 4:
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
});
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
    :class="toneClass"
  >
    {{ label }}
  </span>
</template>
