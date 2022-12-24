<template>
  <q-page padding class="column items-start items-stretch content-center justify-center">
    <p class="text-h2">Login</p>

    <q-tabs
      v-model="tab"
      inline-label
      switch-indicator
      outside-arrows
      mobile-arrows
      indicator-color="primary"
      class="shadow-2"
    >
      <q-tab name="switch" icon="switch_account" :label="$t('ui.login.switchAccount')" />
      <q-tab name="ms-oauth2" icon="person" :label="$t('ui.login.msOauth2')" />
      <q-tab name="password" icon="password" :label="$t('ui.login.password')" />
      <q-tab name="otc" icon="key" :label="$t('ui.login.oneTimePassword')" />
      <q-tab name="open" icon="no_encryption" :label="$t('ui.login.insecure')" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated swipeable infinite>
      <q-tab-panel name="switch" class="no-scroll">
        <div class="col q-gutter-y-md">
          <q-select
            :model-value="existing_accounts"
            :label="$t('ui.login.existingAccountsField')"
            placeholder="server[:port]"
            :rules="requiredField"
          />
          <q-btn :label="$t('ui.login.switchAccount')" @click="login('switch')" color="primary" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="ms-oauth2" class="no-scroll">
        <div class="col q-gutter-y-md">
          <q-input
            v-model="server_address"
            :label="$t('ui.login.remoteAddressField')"
            placeholder="server[:port]"
            :rules="requiredField"
          />
          <q-btn
            :label="$t('ui.login.withMicrosoft')"
            @click="login('ms-oauth2')"
            color="primary"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="password" class="no-scroll">
        <div class="col q-gutter-y-md">
          <q-input
            v-model="username"
            :label="$t('ui.login.usernameField')"
            :rules="requiredField"
          />
          <q-input
            v-model="password"
            type="password"
            :label="$t('ui.login.passwordField')"
            :rules="requiredField"
          />
          <q-input
            v-model="server_address"
            :label="$t('ui.login.remoteAddressField')"
            placeholder="server[:port]"
            :rules="requiredField"
          />
          <q-btn :label="$t('ui.login.withPassword')" @click="login('password')" color="primary" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="otc" class="no-scroll">
        <div class="col q-gutter-y-md">
          <q-input
            v-model="otp"
            :label="$t('ui.login.oneTimePasswordField')"
            :rules="requiredField"
          />
          <q-input
            v-model="server_address"
            :label="$t('ui.login.remoteAddressField')"
            placeholder="server[:port]"
            :rules="requiredField"
          />
          <q-btn
            :label="$t('ui.login.withOneTimePassword')"
            @click="login('otp')"
            color="primary"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="open" class="no-scroll">
        <div class="col q-gutter-y-md">
          <q-input
            v-model="server_address"
            :label="$t('ui.login.remoteAddressField')"
            placeholder="server[:port]"
            :rules="requiredField"
          />
          <q-btn :label="$t('ui.login.withInsecure')" @click="login('open')" color="primary" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { EasyAdminAPI } from 'src/util/api-connector'
import { EasyAdminAuth } from 'src/util/auth-engine'

const tab = ref('switch')
const { t } = useI18n()
const q = useQuasar()

const requiredField = [(val: string) => !!val || t('ui.generic.fieldRequired')]

const existing_accounts = ref([])
const username = ref('')
const password = ref('')
const otp = ref('')
const server_address = ref('')
const remember = ref(false)

function login(method: 'switch' | 'ms-oauth2' | 'password' | 'otp' | 'open') {
  if (server_address.value === '' && method !== 'switch') {
    q.notify({ message: t('ui.login.missingServerAddress'), type: 'negative' })
    return
  }

  switch (method) {
    case 'switch':
      q.notify({ message: 'Not currently available', type: 'negative' })
      break
    case 'ms-oauth2':
      q.notify({ message: 'Not currently available', type: 'negative' })
      break
    case 'password':
      if (username.value === '' || password.value === '') {
        q.notify({ message: t('ui.login.missingUsernameOrPassword'), type: 'negative' })
        return
      }

      EasyAdminAPI.login(
        server_address.value,
        new EasyAdminAuth.PasswordAuth(),
        {
          method: 'password',
          username: username.value,
          password: password.value,
        },
        remember.value
      )
      break
    case 'otp':
      if (otp.value === '') {
        q.notify({ message: t('ui.login.missingOTP'), type: 'negative' })
        return
      }

      EasyAdminAPI.login(
        server_address.value,
        new EasyAdminAuth.OTPAuth(),
        {
          method: 'otp',
          otp: otp.value,
        },
        remember.value
      )
      break
    case 'open':
      EasyAdminAPI.login(
        server_address.value,
        new EasyAdminAuth.Authless(),
        undefined,
        remember.value
      )
      break
  }
}
</script>
