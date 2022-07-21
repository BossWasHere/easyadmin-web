<template>
  <div>
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="col-5 flex flex-center">
          <q-img class="rounded-borders" :src="imgSrc" />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-h4 q-mt-md q-mb-xs">{{ name }}</div>
          <div class="text-underline">{{ uuid }}</div>
          <q-separator />
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

          <div class="text-caption text-grey">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </div>
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
        <q-tab-panel name="details">Details</q-tab-panel>
        <q-tab-panel name="history">History</q-tab-panel>
        <q-tab-panel name="aliases">Aliases</q-tab-panel>
        <q-tab-panel name="moderation">Moderation</q-tab-panel>
        <q-tab-panel name="actions">Actions</q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { validateUUID } from 'src/util/data-validation'
import { Ref, ref, toRefs, watch } from 'vue'

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
</script>
