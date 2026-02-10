<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; badge?: string }>();
</script>

<template>
  <section
    class="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5"
    >
      <div>
        <p v-if="badge" class="ui-badge">{{ badge }}</p>
        <h2 class="mt-2 text-lg font-display font-semibold text-slate-900">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-1 text-sm text-slate-500">
          {{ subtitle }}
        </p>
      </div>
      <slot name="actions" />
    </div>
    <div class="p-6">
      <slot />
    </div>
  </section>
</template>
