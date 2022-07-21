<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar> -->
          {{ $t('productTitle') }}
        </q-toolbar-title>

        <!-- <q-space /> -->

        <!-- search bar -->
        <div class="row col-5">
          <q-btn dense flat round icon="search" />
          <q-input
            v-model="search"
            debounce="500"
            :placeholder="$t('ui.header.searchTip')"
            prepend-icon="search"
            class="bg-primary text-white col-grow"
          />
        </div>

        <q-space />

        <q-toggle
          size="lg"
          v-model="darkMode"
          icon="light_mode"
          checked-icon="dark_mode"
          color="grey-6"
        />
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header>{{ $t('ui.navigation.labelGeneral') }}</q-item-label>
          <q-item to="/dashboard">
            <q-item-section>
              <q-item-label>
                <q-icon name="dashboard" size="sm" />
                {{ $t('ui.navigation.pageDashboard') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/moderation">
            <q-item-section>
              <q-item-label>
                <q-icon name="supervisor_account" size="sm" />
                {{ $t('ui.navigation.pageModerationAnalytics') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/network">
            <q-item-section>
              <q-item-label>
                <q-icon name="analytics" size="sm" />
                {{ $t('ui.navigation.pageNetworkAnalytics') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-lg" />
          <q-item-label header>{{ $t('ui.navigation.labelAccount') }}</q-item-label>
          <q-item to="/me">
            <q-item-section>
              <q-item-label>
                <q-icon name="settings" size="sm" />
                {{ $t('ui.navigation.pageUserSettings') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>
                <q-icon name="logout" size="sm" />
                {{ $t('ui.navigation.pageLogout') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-lg" />
          <q-item-label header>{{ $t('productTitle') }}</q-item-label>
          <q-item to="/admin">
            <q-item-section>
              <q-item-label>
                <q-icon name="admin_panel_settings" size="sm" />
                {{ $t('ui.navigation.pageAdministrativeSettings') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/logs">
            <q-item-section>
              <q-item-label>
                <q-icon name="article" size="sm" />
                {{ $t('ui.navigation.pageLogs') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-lg" />
          <q-item to="/info">
            <q-item-section>
              <q-item-label>
                <q-icon name="info" size="sm" />
                {{ $t('ui.navigation.pageAbout') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="a" target="_blank" :href="bugReportUrl">
            <q-item-section>
              <q-item-label>
                <q-icon name="bug_report" size="sm" />
                {{ $t('ui.navigation.pageBugReport') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="a" target="_blank" :href="helpUrl">
            <q-item-section>
              <q-item-label>
                <q-icon name="help_outline" size="sm" />
                {{ $t('ui.navigation.pageSupport') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-space />
        <div>{{ $t('ui.footer.labelCopyright') }}</div>
        <q-space />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from 'src/stores/global-store'
import { ref } from 'vue'

const search = ref('')
const bugReportUrl = process.env.URL_BUG_REPORT
const helpUrl = process.env.URL_HELP_PAGE

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

const { darkMode } = storeToRefs(useGlobalStore())
</script>
