<template>
  <q-page class="column items-start content-center justify-center">
    <p class="text-h2">EasyAdmin Web</p>
    <span class="text-h6">
      A remote server moderation platform developed by BossWasHere/BackwardsNode
    </span>
    <p class="text-bold">Version 1.0</p>
    <span>Components:</span>
    <ul>
      <li>Vue 3 - MIT License <a href="https://vuejs.org/">[Website]</a></li>
      <li>Vue i18n - MIT License<a href="https://kazupon.github.io/vue-i18n/">[Website]</a></li>
      <li>Vue Router - MIT License <a href="https://router.vuejs.org/">[Website]</a></li>
      <li>Quasar - MIT License <a href="https://quasar.dev/">[Website]</a></li>
      <li>ApexCharts - MIT License <a href="https://apexcharts.com/">[Website]</a></li>
      <li>Pinia - MIT License <a href="https://pinia.vuejs.org/">[Website]</a></li>
      <li>
        pinia-plugin-persistedstate - MIT License
        <a href="https://github.com/prazdevs/pinia-plugin-persistedstate">[Website]</a>
      </li>
      <li>scrypt-js - MIT License <a href="https://github.com/ricmoo/scrypt-js">[Website]</a></li>
      <li>
        dotenv - BSD-2-Clause License <a href="https://github.com/motdotla/dotenv">[Website]</a>
      </li>
    </ul>
    <div class="row">
      <q-btn flat round :href="repoUrl">
        <q-avatar size="md">
          <img class="display-light-only" src="src/assets/github-mark.svg" />
          <img class="display-light-dark" src="src/assets/github-mark-white.svg" />
        </q-avatar>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const repoUrl = process.env.URL_REPO
</script>
