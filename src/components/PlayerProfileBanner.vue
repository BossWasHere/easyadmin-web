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
          <div class="text-caption text-grey">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </div>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat> 7:30PM </q-btn>
        <q-btn flat color="primary"> Reserve </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { validateUUID } from 'src/util/data-validation'
import { ref, toRefs, watch } from 'vue'

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
