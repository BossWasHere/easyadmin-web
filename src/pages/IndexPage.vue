<template>
  <q-page padding class="column items-start content-center justify-center">
    <p class="text-h2">EasyAdmin Web</p>
    <p class="text-h4">Remote server moderation - anywhere - any time</p>

    <div class="q-gutter-sm">
      <q-btn
        v-if="isLoggedIn"
        class="bg-primary"
        :label="$t('ui.navgoto.dashboard')"
        to="/dashboard"
      />

      <q-btn v-else class="bg-primary" :label="$t('ui.navigation.pageLogin')" to="/login" />

      <q-btn class="bg-secondary" :label="$t('ui.navgoto.installationHelp')" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAccountStore } from 'src/stores/account-store'

const { isLoggedIn } = storeToRefs(useAccountStore())
</script>
