export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  typescript: { typeCheck: true },
  imports: {
    dirs: ['stores']
  },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/main.scss'],
  nitro: {
    preset: 'static'
  },
  app: {
    head: {
      title: 'Заметки',
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
})
