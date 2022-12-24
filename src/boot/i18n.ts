import { createI18n } from 'vue-i18n'
import { boot } from 'quasar/wrappers'
import messages from 'src/lang'

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: messages as never,
    legacy: false,
  })

  app.use(i18n)
})
