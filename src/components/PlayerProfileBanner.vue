<template>
  <div class="row full-width">
    <q-space class="col-3" />
    <q-card class="my-card col" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="col-4 flex flex-center">
          <q-img class="rounded-borders" :src="imgSrc" height="16em" fit="contain" />
        </q-card-section>

        <q-card-section class="col q-pt-xs">
          <div class="row items-center">
            <div class="text-h4 q-my-md q-mb-xs">{{ name }}</div>
            <q-btn
              icon="content_copy"
              padding="xs"
              size="xs"
              class="q-my-md q-mb-xs q-ml-sm"
              color="transparent"
              text-color="fg"
              unelevated
              @click="copyNameToClipboard"
            >
              <q-tooltip class="bg">Copy to clipboard</q-tooltip>
            </q-btn>
            <q-space />
            <div class="text-bold" :class="online ? 'text-green' : 'text-red'">
              {{ online ? 'ONLINE' : 'OFFLINE' }}
            </div>
          </div>
          <div class="row">
            {{ uuid
            }}<q-btn
              icon="content_copy"
              padding="xs"
              size="xs"
              class="q-ml-xs"
              color="transparent"
              text-color="fg"
              unelevated
              @click="copyUUIDToClipboard"
            >
              <q-tooltip class="bg">Copy to clipboard</q-tooltip>
            </q-btn>
          </div>

          <q-separator />
          <div class="q-my-xs">
            <q-scroll-area
              :thumb-style="{
                borderRadius: '5px',
                height: '5px',
                opacity: '0.75',
              }"
              style="height: 3em"
            >
              <div class="row no-wrap">
                <q-chip
                  v-for="group in groups"
                  :key="group.name"
                  :color="group.color"
                  :clickable="false"
                  style="width: 6em"
                >
                  <div class="text-center full-width ellipsis">
                    {{ group.name }}
                    <q-tooltip>{{ group.name }}</q-tooltip>
                  </div>
                </q-chip>
              </div>
            </q-scroll-area>
          </div>

          <q-list dense>
            <QItemDetail icon="more_time" :label="$t('ui.player.currentSession')" caption="4h32m" />
            <QItemDetail icon="map" :label="$t('ui.player.currentServer')" caption="LOBBY-12" />
          </q-list>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-tabs
        v-model="tab"
        inline-label
        switch-indicator
        outside-arrows
        mobile-arrows
        indicator-color="primary"
        class="shadow-2"
      >
        <q-tab name="details" icon="person" :label="$t('ui.player.details')" />
        <q-tab name="history" icon="history" :label="$t('ui.player.history')" />
        <q-tab name="aliases" icon="diversity_3" :label="$t('ui.player.aliases')" />
        <q-tab name="moderation" icon="gavel" :label="$t('ui.player.moderation')" />
        <q-tab name="actions" icon="construction" :label="$t('ui.player.actions')" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="details">
          <div class="row">
            <q-list class="col q-mr-lg">
              <QItemDetail
                icon="calendar_today"
                :label="$t('ui.player.firstJoined')"
                caption="2022/07/21 22:29:56"
              />
              <QItemDetail
                icon="calendar_month"
                :label="$t('ui.player.lastJoined')"
                caption="2022/07/22 00:30:00"
              />
              <QItemDetail
                icon="logout"
                :label="$t('ui.player.lastDisconnected')"
                caption="2022/07/21 22:30:00"
              />
              <QItemDetail icon="bar_chart" :label="$t('ui.player.timesJoined')" caption="2" />
              <QItemDetail icon="timer" :label="$t('ui.player.playTime')" caption="4h32m" />
            </q-list>
            <q-separator vertical />
            <q-list class="col q-ml-lg">
              <QItemDetail icon="lan" :label="$t('ui.player.lastIPAddress')" caption="127.0.0.1" />
              <QItemDetail
                icon="mood_bad"
                :label="$t('ui.player.lastPunishment')"
                :caption="$t('common.never')"
              />
              <QItemDetail icon="no_accounts" :label="$t('ui.player.bans')" caption="0" />
              <QItemDetail icon="volume_off" :label="$t('ui.player.mutes')" caption="0" />
              <QItemDetail icon="call_missed_outgoing" :label="$t('ui.player.kicks')" caption="0" />
            </q-list>
          </div>
        </q-tab-panel>
        <q-tab-panel name="history">History</q-tab-panel>
        <q-tab-panel name="aliases">Aliases</q-tab-panel>
        <q-tab-panel name="moderation">Moderation</q-tab-panel>
        <q-tab-panel name="actions">Actions</q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-space class="col-3" />
  </div>
</template>

<script setup lang="ts">
import { validateUUID } from 'src/util/data-validation'
import { Ref, ref, toRefs, watch } from 'vue'

import QItemDetail from 'src/components/QItemDetail.vue'

type PlayerGroup = {
  name: string
  color: string
}

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})
const { uuid, name } = toRefs(props)

const tab = ref('details')
const groups: Ref<PlayerGroup[]> = ref([
  { name: 'Owner', color: 'red' },
  { name: 'LongRankName', color: 'green' },
  { name: 'Default', color: 'grey' },
  { name: 'VIP', color: 'yellow' },
  { name: 'Developer', color: 'purple' },
])
const online = ref(true)

const defaultAvatarSrc = 'src/assets/easyadmin_logo_grey.png'
const imgSrc = ref(defaultAvatarSrc)

function updateUUID(newValue: string) {
  const validUUID = validateUUID(newValue)
  imgSrc.value =
    (validUUID ? process.env.URL_PLAYER_HEADS_ISO?.replace('{}', uuid.value) : undefined) ??
    defaultAvatarSrc
}
updateUUID(uuid.value)

watch(uuid, updateUUID)

function copyNameToClipboard() {
  navigator.clipboard.writeText(name.value)
}

function copyUUIDToClipboard() {
  navigator.clipboard.writeText(uuid.value)
}
</script>
