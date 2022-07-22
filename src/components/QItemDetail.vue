<template>
  <q-item>
    <q-item-section avatar>
      <q-icon :name="icon" size="sm" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
})

const { icon, label, caption } = toRefs(props)
</script>
