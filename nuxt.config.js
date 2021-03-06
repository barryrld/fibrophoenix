const Content = require('./modules/contentLoader/contentLoader')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Fibro Phoenix - Fibromyalgia information and resources',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Fibromyalgia information and resources' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Courgette|Lora:400,700' },
    ]
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sitemap',
    ['./modules/globalComponents', { prefix: 'fp-' }],
    './modules/contentLoader',
    ['@reallifedigital/nuxt-image-loader-module', {
      imageStyles: {
        small: { macros: ['scaleAndCrop|160|90'] },
        medium: { macros: ['scaleAndCrop|320|180'] },
        large: { macros: ['scaleAndCrop|640|360'] },
      },
    }]
  ],
  sitemap: {
    path: '/sitemap.xml',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false, // Enable when using nuxt generate
    exclude: [
      '/patterns',
      '/api/**'
    ],
    routes () {
      const dynamicRoutes = []
      const articles = Content.getCollectionData('articles')
      const paths = articles.forEach(article => {
        dynamicRoutes.push({
          url: article.path,
          lastmodISO: article.updated
        })
      })
      return dynamicRoutes
    }
  },
  /*
  ** Progress bar color
  */
  loading: { color: '#f54c00' },
  /*
  ** Build configuration
  */
  build: {
    styleResources: {
      scss: './assets/styles/fp.scss'
    },
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

