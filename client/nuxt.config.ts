// https://nuxt.com/docs/api/configuration/nuxt-config
// require('dotenv').config()

export default defineNuxtConfig({
  app: {
    head: {
      title: "Carles Far - Desarrollo Web y Consultoría",
      meta: [
        {
          name: "description",
          content:
            "Carles Far, experto en desarrollo web, ofrece soluciones a medida para empresas y emprendedores.",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      keyClodinary: process.env.KEY_CLOUDINARY,
      apiKey: process.env.API_URL,
    },
  },
  //   vite: process.env.NODE_ENV === 'development' ? {
  //     server: {
  //         hmr: {
  //             port: 4001,
  //             protocol: 'wss',
  //             host: 'localhost',
  //         }
  //     }
  // } : {},
  css: [
    "~/assets/css/main.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
  build: {
    transpile: ["@urql/vue"],
  },
});
