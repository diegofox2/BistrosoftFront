<script setup lang="ts">
import LoginForm from "../components/LoginForm.vue";
</script>

<template>
  <div class="min-h-screen">
    <main
      class="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-10"
    >
      <div class="grid w-full gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div class="space-y-4">
          <p class="ui-label">Bistrosoft Ops</p>
          <h1 class="text-4xl font-display font-semibold text-slate-900">
            Sign in to access the command center.
          </h1>
          <p class="text-base text-slate-600">
            Use your API credentials to request a token and unlock customer and
            order workflows.
          </p>
          <div
            class="rounded-3xl border border-slate-200/70 bg-white/70 p-6 text-sm text-slate-600 shadow-lg shadow-slate-200/60"
          >
            <p class="font-semibold text-slate-700">Tip</p>
            <p class="mt-2">
              If you do not have credentials yet, ask your backend administrator
              for a demo user.
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  </div>
</template>
