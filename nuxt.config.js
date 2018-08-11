const Content = require('./src/content')

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
  plugins: [
    '@/plugins/fp-components',
    '@/plugins/content'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sitemap'
  ],
  router: {
    middleware: [
      'validPaths'
    ]
  },
  serverMiddleware: [
    { path: '/api/content', handler: '@/src/content/api/contentLoader.js' },
    { path: '/api/collection-data', handler: '@/src/content/api/collectionData.js' },
  ],
  sitemap: {
    path: '/sitemap.xml',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false, // Enable me when using nuxt generate
    exclude: [
      '/patterns',
      '/api/**'
    ],
    routes () {
      const dynamicRoutes = []
      const articles = Content.getCollectionData('articles')
      console.log(articles)
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
  ** Customize the progress bar color
  */
  loading: { color: '#f54c00' },
  /*
  ** Build configuration
  */
  build: {
    styleResources: {
      scss: './assets/variables.scss'
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

