// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
  head: {
    title: 'MétéoCI',
    link: [
      { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛅</text></svg>' }
    ]
  }
},
vite: {
    server: {
      allowedHosts: ['meteoci.chalenge14.com', 'localhost']
    }
  }
})
