<template>
  <q-img :src="imgSrc"></q-img>
</template>

<script setup lang="ts">
import { validateUUID } from 'src/util/data-validation'

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
})

const imgSrc =
  (validateUUID(props.uuid)
    ? process.env.URL_PLAYER_HEADS_AVATAR?.replace('{}', props.uuid)
    : undefined) ?? 'src/assets/easyadmin_logo_grey.png'
</script>
