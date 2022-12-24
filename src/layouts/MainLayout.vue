<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ $t('productTitle') }}
        </q-toolbar-title>

        <div class="row col-5" v-if="isLoggedIn">
          <q-select
            use-input
            filled
            dense
            standout
            hide-selected
            fill-input
            :model-value="search"
            :spellcheck="false"
            :stack-label="false"
            :label="$t('ui.header.searchTip')"
            :options="filteredOptions"
            @filter="filter"
            @input-value="searchValueChange"
            class="text-white col-grow"
            color="black"
            input-debounce="500"
            ref="searchRef"
          >
            <template v-slot:append>
              <q-btn dense flat round icon="search" />
            </template>

            <template v-slot:after-options>
              <QItemSpinner v-if="displaySpinner"></QItemSpinner>
            </template>
            <!-- Workaround: https://github.com/quasarframework/quasar/issues/8755 -->
            <template v-slot:no-option>
              <QItemSpinner v-if="displaySpinner"></QItemSpinner>
            </template>

            <template v-slot:option="scope">
              <q-item-label v-if="scope.opt.header" header class="q-pt-sm q-pb-xs">{{
                $t(`ui.search.${scope.opt.header}`)
              }}</q-item-label>
              <q-item v-else v-bind="scope.itemProps" :to="'/player/' + scope.opt.uuid">
                <q-item-section avatar>
                  <PlayerFace v-if="scope.opt.type === 'player'" :uuid="scope.opt.uuid ?? ''" />
                  <q-icon v-else name="public" size="md" class="q-mx-auto" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption lines="1">{{ scope.opt.uuid }}</q-item-label>
                </q-item-section>
                <q-item-section side :class="{ 'default-type': !scope.opt.type }">
                  <q-btn outline dense no-caps text-color="blue-grey" size="0.8em" class="q-px-sm">
                    {{ $t(`common.${scope.opt.type}`) }}
                    <q-icon name="subdirectory_arrow_left" size="1.4em" />
                  </q-btn>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
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

    <q-drawer show-if-above v-model="leftDrawerOpen" :mini="leftDrawerMini" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list v-if="isLoggedIn" padding>
          <q-item to="/dashboard">
            <q-item-section avatar>
              <q-icon name="dashboard" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageDashboard') }}</q-item-section>
          </q-item>
          <q-item to="/moderation">
            <q-item-section avatar>
              <q-icon name="supervisor_account" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageModerationAnalytics') }}</q-item-section>
          </q-item>
          <q-item to="/network">
            <q-item-section avatar>
              <q-icon name="analytics" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageNetworkAnalytics') }}</q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-lg" />
          <q-item to="/me">
            <q-item-section avatar>
              <q-icon name="settings" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageUserSettings') }}</q-item-section>
          </q-item>
          <q-item to="/login">
            <q-item-section avatar>
              <q-icon name="switch_account" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageSwitchAccount') }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="logout" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageLogout') }}</q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-lg" />
          <q-item to="/admin">
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageAdministrativeSettings') }}</q-item-section>
          </q-item>
          <q-item to="/sessions">
            <q-item-section avatar>
              <q-icon name="swap_horiz" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageActiveSessions') }}</q-item-section>
          </q-item>
          <q-item to="/logs">
            <q-item-section avatar>
              <q-icon name="article" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageLogs') }}</q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-lg" />
          <HelpListItemGroup />
        </q-list>
        <q-list v-else padding>
          <q-item to="/login">
            <q-item-section avatar>
              <q-icon name="login" size="sm" />
            </q-item-section>
            <q-item-section>{{ $t('ui.navigation.pageLogin') }}</q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-lg" />
          <HelpListItemGroup />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
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
import { useAccountStore } from 'src/stores/account-store'
import { ref } from 'vue'
import PlayerFace from 'src/components/PlayerFace.vue'
import QItemSpinner from 'src/components/QItemSpinner.vue'
import HelpListItemGroup from 'src/components/HelpListItemGroup.vue'
import { QSelect } from 'quasar'

const leftDrawerOpen = ref(false)
const leftDrawerMini = ref(false)
const rightDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerMini.value = !leftDrawerMini.value
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

const { darkMode } = storeToRefs(useGlobalStore())
const { isLoggedIn } = storeToRefs(useAccountStore())

type SearchOption = {
  label: string
  uuid?: string
  type: 'player' | 'server'
  recent?: boolean
}
type SearchHeader = {
  header: 'recent' | 'results'
}

let hasLoaded = false
let isLoading = false
const search = ref('')
const searchRef = ref<QSelect>()
const displaySpinner = ref(false)
const recentOptions: SearchOption[] = [
  {
    label: 'IballisticBoss',
    uuid: '1b691fec-39e5-4e2c-ba93-1f2914550646',
    type: 'player',
    recent: true,
  },
  { label: 'Notch', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', type: 'player', recent: true },
  { label: 'Steve', uuid: '8667ba71-b85a-4004-af54-457a9734eed7', type: 'player', recent: true },
  { label: 'jeb_', uuid: '853c80ef-3c37-49fd-aa49-938b674adae6', type: 'player', recent: true },
  { label: 'Lobby', type: 'server', recent: true },
]
const newOptions: SearchOption[] = [
  { label: 'Keith', type: 'player' },
  { label: 'Bob', type: 'player' },
  {
    label: 'Herobrine',
    uuid: 'f84c6a79-0a4e-45e0-879b-cd49ebd4c4e2',
    type: 'player',
  },
]
const filteredOptions = ref<(SearchOption | SearchHeader)[]>([])

function filter(val: string, update: (callbackFn: () => void) => void) {
  if (val.length > 2 && !hasLoaded && !isLoading) {
    isLoading = true
    displaySpinner.value = true
    setTimeout(() => {
      hasLoaded = true
      isLoading = false
      displaySpinner.value = false
      searchRef.value?.filter(search.value)
    }, 5000)
  }
  if (val === '') {
    update(() => {
      filteredOptions.value =
        recentOptions.length > 0 ? [{ header: 'recent' }, ...recentOptions] : []
    })
  } else if (hasLoaded) {
    update(() => {
      let opts: (SearchOption | SearchHeader)[] = recentOptions.filter((op) =>
        op.label.toLowerCase().includes(val.toLowerCase())
      )
      const newOpts = newOptions.filter((op) => op.label.toLowerCase().includes(val.toLowerCase()))
      opts = opts.length > 0 ? [{ header: 'recent' }, ...opts] : []
      if (newOpts.length > 0) {
        opts = opts.length > 0 ? [...opts, { header: 'results' }, ...newOpts] : newOpts
      }
      filteredOptions.value = opts
    })
  } else {
    update(() => {
      const opts = recentOptions.filter((op) => op.label.toLowerCase().includes(val.toLowerCase()))
      filteredOptions.value = opts.length > 0 ? [{ header: 'recent' }, ...opts] : []
    })
  }
}

function searchValueChange(val: string) {
  search.value = val
}
</script>
