<template>
  <q-page class="row items-center justify-evenly">
    <PlayerProfileBanner :uuid="$route.params.id.toString()" name="Steve"></PlayerProfileBanner>
  </q-page>
</template>

<script setup lang="ts">
import PlayerProfileBanner from 'src/components/PlayerProfileBanner.vue'
</script>
