// https://nuxt.com/docs/api/configuration/nuxt-config
// require('dotenv').config()

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            keyClodinary: process.env.KEY_CLOUDINARY,
            apiKey: process.env.API_URL
        }
      },
      vite: process.env.NODE_ENV === 'development' ? {
        server: {
            hmr: {
                port: 4001,
                protocol: 'wss',
                host: 'localhost',
            }
        }
    } : {},
    css: ['~/assets/css/main.css','@fortawesome/fontawesome-svg-core/styles.css'],
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
    },
    ssr: false,
    build: {
        transpile: [
          "@urql/vue"
        ], 
      },
})
