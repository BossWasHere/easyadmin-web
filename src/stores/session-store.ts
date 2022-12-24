import { defineStore } from 'pinia'
import { EasyAdminAPI } from 'src/api/api-connector'
import { useAccountStore } from './account-store'

export const useSessionStore = defineStore('session', {
  state: () => ({
    apiSession: new EasyAdminAPI.APISession(),
  }),
  getters: {},
  actions: {
    applyEngine(engine: EasyAdminAPI.APIEngine) {
      this.apiSession.setEngine(engine)
    },
    reloadEngine() {
      const account = useAccountStore().currentAccount
      if (account) {
        this.apiSession.setEngine(new EasyAdminAPI.APIEngine(account.serverUrl, account.token))
      }
    },
  },
})
