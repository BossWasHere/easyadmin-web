<template>
  <q-item to="/info">
    <q-item-section avatar>
      <q-icon name="info" size="sm" />
    </q-item-section>
    <q-item-section>{{ $t('ui.navigation.pageAbout') }}</q-item-section>
  </q-item>
  <q-item tag="a" target="_blank" :href="bugReportUrl">
    <q-item-section avatar>
      <q-icon name="bug_report" size="sm" />
    </q-item-section>
    <q-item-section>{{ $t('ui.navigation.pageBugReport') }}</q-item-section>
  </q-item>
  <q-item tag="a" target="_blank" :href="helpUrl">
    <q-item-section avatar>
      <q-icon name="help_outline" size="sm" />
    </q-item-section>
    <q-item-section>{{ $t('ui.navigation.pageSupport') }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
const bugReportUrl = process.env.URL_BUG_REPORT
const helpUrl = process.env.URL_HELP_PAGE
</script>
