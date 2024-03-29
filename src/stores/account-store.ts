import { defineStore } from 'pinia'
import { useSessionStore } from './session-store'
import { EasyAdminAuth } from 'src/api/auth-engine'

export const useAccountStore = defineStore('account', {
  state: () => ({
    accountIndex: -1,
    accounts: [] as EasyAdminAuth.Account[],
    pendingLogin: undefined as EasyAdminAuth.LoginState,
    clientId: window.crypto.randomUUID(),
  }),
  getters: {
    isLoggedIn(state) {
      return state.accountIndex !== -1 && state.accounts.length > state.accountIndex
    },
    isSwitchingAccount(state) {
      return state.accountIndex === -1
    },
    currentAccount(): EasyAdminAuth.Account | undefined {
      return this.isLoggedIn ? this.accounts[this.accountIndex] : undefined
    },
  },
  actions: {
    insertAccount(account: EasyAdminAuth.Account) {
      this.accounts.push(account)
      this.accountIndex = this.accounts.length - 1
    },
    switchAccount(index: number | EasyAdminAuth.Account) {
      if (typeof index === 'object') {
        index = this.accounts.indexOf(index)
      }

      if (index >= 0 && index < this.accounts.length) {
        this.accountIndex = index
        useSessionStore().reloadEngine()
      }
    },
    removeAccount(index: number | EasyAdminAuth.Account) {
      if (typeof index === 'object') {
        index = this.accounts.indexOf(index)
      }

      if (index >= 0 && index < this.accounts.length) {
        this.accounts.splice(index, 1)
        this.accountIndex = -1
      }
    },
    updatePendingLogin(pending: EasyAdminAuth.LoginState) {
      this.pendingLogin = pending
    },
  },
  persist: true,
})
