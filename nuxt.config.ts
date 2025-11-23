export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  typescript: { typeCheck: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/main.scss'],
  app: {
    head: {
      title: 'Заметки',
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
})
