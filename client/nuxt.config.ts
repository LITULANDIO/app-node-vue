// https://nuxt.com/docs/api/configuration/nuxt-config
require('dotenv').config()

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            keyClodinary: process.env.KEY_CLOUDINARY,
            apiKey: process.env.API_URL
        }
      },
    vite: {
      server: {
        hmr: {
          port: 4001,
          protocol: 'wss',
          host: 'localhost',
        }
      }
    },
    css: ['~/assets/css/main.css','@fortawesome/fontawesome-svg-core/styles.css'],
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
    },
    modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'], 
    ssr: false,
    build: {
        transpile: [
          "@urql/vue"
        ], 
      },
})
