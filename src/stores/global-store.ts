import { defineStore } from 'pinia'
import { Dark } from 'quasar'
import { toRef, watch } from 'vue'

const defaultDarkMode =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

function localStorageOrDefault<T>(key: string, converter: (str: string) => T, def: T): T {
  const value = localStorage.getItem(key)
  return value === null ? def : converter(value)
}

function toBoolean(value: string) {
  return value === 'true'
}

export const useGlobalStore = defineStore('global', {
  state: () => ({
    darkMode: (function () {
      const darkMode = localStorageOrDefault('darkMode', toBoolean, defaultDarkMode)
      Dark.set(darkMode)
      return darkMode
    })(),
  }),
  getters: {},
  actions: {},
})

watch(toRef(useGlobalStore(), 'darkMode'), (value) => {
  Dark.set(value)
  localStorage.setItem('darkMode', value.toString())
})
