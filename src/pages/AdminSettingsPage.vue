<template>
  <q-page class="row items-center justify-evenly">
    <q-list padding>
      <q-item-label header>{{ $t('ui.navigation.pageAdministrativeSettings') }}</q-item-label>
      <q-item>
        <q-select
          filled
          v-model="authenticationModeSelected"
          :options="authenticationOptions"
          :label="$t('admin.auth.title')"
        >
          <q-tooltip anchor="top right" self="top left"
            >{{ $t('admin.auth.tip') }}
            <ul>
              <li>
                <b>{{ $t('admin.auth.password') }}</b
                >{{ $t('admin.auth.passwordDescription') }}
              </li>
              <li>
                <b>{{ $t('admin.auth.microsoftSSO') }}</b
                >{{ $t('admin.auth.microsoftSSODescription') }}
              </li>
              <li>
                <b>{{ $t('admin.auth.temporarySession') }}</b
                >{{ $t('admin.auth.temporarySessionDescription') }}
              </li>
              <li>
                <b>{{ $t('admin.auth.insecure') }}</b
                >{{ $t('admin.auth.insecureDescription') }}
              </li>
            </ul>
          </q-tooltip>
        </q-select>
      </q-item>

      <q-item>
        <q-btn class="bg-primary" :label="$t('admin.saveChanges')" />
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const authenticationModeSelected = ref(null)
const authenticationOptions = ['Password', 'Microsoft SSO', 'Temporary Session', 'Unsecured']
</script>
