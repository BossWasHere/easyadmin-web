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
            v-model="selectedAccount"
            :options="accounts"
            option-label="serverUrl"
            :label="$t('ui.login.existingAccountsField')"
          >
            <template v-slot:append>
              <q-btn
                dense
                flat
                icon="delete"
                text-color="negative"
                v-if="selectedAccount"
                @click.stop.prevent="promptDelete"
              />
            </template>
          </q-select>
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
          <div>
            <q-checkbox dense size="lg" v-model="remember" :label="$t('ui.login.remember')" />
          </div>
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
          <div>
            <q-checkbox dense size="lg" v-model="remember" :label="$t('ui.login.remember')" />
          </div>
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
          <div>
            <q-checkbox dense size="lg" v-model="remember" :label="$t('ui.login.remember')" />
          </div>
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
          <div>
            <q-checkbox dense size="lg" v-model="remember" :label="$t('ui.login.remember')" />
          </div>
          <q-btn :label="$t('ui.login.withInsecure')" @click="login('open')" color="primary" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { EasyAdminAPI } from 'src/api/api-connector'
import { EasyAdminAuth } from 'src/api/auth-engine'
import { useAccountStore } from 'src/stores/account-store'

const router = useRouter()
const { t } = useI18n()
const q = useQuasar()

const requiredField = [(val: string) => !!val || t('ui.generic.fieldRequired')]

const { accounts, currentAccount } = storeToRefs(useAccountStore())

const selectedAccount = ref(currentAccount.value)

const tab = ref('switch')
const username = ref('')
const password = ref('')
const otp = ref('')
const server_address = ref('')
const remember = ref(false)

onMounted(() => {
  selectedAccount.value = currentAccount.value
})

function promptDelete() {
  const accountToDelete = selectedAccount.value

  if (!accountToDelete) {
    return
  }

  q.dialog({
    title: t('ui.login.deleteAccountPrompt'),
    message: t('ui.login.deleteAccountPromptMessage', { server: accountToDelete.serverUrl }),
    class: 'wrap-whitespace',
    color: 'negative',
    noEscDismiss: false,
    cancel: true,
  }).onOk(() => {
    useAccountStore().removeAccount(accountToDelete)
    q.notify({ message: t('ui.login.accountDeleted'), type: 'positive' })
    selectedAccount.value = undefined
  })
}

async function login(method: 'switch' | 'ms-oauth2' | 'password' | 'otp' | 'open') {
  const serverAddress = server_address.value

  if (serverAddress === '' && method !== 'switch') {
    q.notify({ message: t('ui.login.missingServerAddress'), type: 'negative' })
    return
  }

  let response: EasyAdminAPI.APIEngine | EasyAdminAPI.APIError | undefined

  switch (method) {
    case 'switch':
      if (!selectedAccount.value) {
        q.notify({ message: t('ui.login.missingAccountSelection'), type: 'negative' })
        return
      }

      if (selectedAccount.value !== currentAccount.value) {
        useAccountStore().switchAccount(selectedAccount.value)

        // TODO verify successful connection
      }

      q.notify({
        message: t('ui.login.loginSuccessful', { server: selectedAccount.value.serverUrl }),
        type: 'positive',
      })
      router.push('/dashboard')
      return
    case 'ms-oauth2':
      q.notify({ message: 'Not currently available', type: 'negative' })
      break
    case 'password':
      if (username.value === '' || password.value === '') {
        q.notify({ message: t('ui.login.missingUsernameOrPassword'), type: 'negative' })
        return
      }

      response = await EasyAdminAPI.login(
        serverAddress,
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

      response = await EasyAdminAPI.login(
        serverAddress,
        new EasyAdminAuth.OTPAuth(),
        {
          method: 'otp',
          otp: otp.value,
        },
        remember.value
      )
      break
    case 'open':
      response = await EasyAdminAPI.login(
        serverAddress,
        new EasyAdminAuth.Authless(),
        undefined,
        remember.value
      )
      break
  }

  if (response) {
    if ('error' in response) {
      q.notify({ message: response.error, type: 'negative' })
    } else {
      q.notify({
        message: t('ui.login.loginSuccessful', { server: serverAddress }),
        type: 'positive',
      })
      router.push('/dashboard')
    }
  }
}
</script>
