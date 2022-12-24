<template>
  <router-view />
</template>

<script setup lang="ts">
import { Dark } from 'quasar'
import { toRef, watch } from 'vue'
import { useGlobalStore } from './stores/global-store'
import { useSessionStore } from './stores/session-store'

useSessionStore().reloadEngine()

Dark.set(useGlobalStore().darkMode)

watch(toRef(useGlobalStore(), 'darkMode'), (value) => {
  Dark.set(value)
})
</script>
