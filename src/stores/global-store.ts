import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  }),
  getters: {},
  actions: {},
  persist: true,
})
