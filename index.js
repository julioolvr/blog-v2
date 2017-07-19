const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdownit')
const assets = require('metalsmith-assets')
const layouts = require('metalsmith-layouts')
const multiLanguage = require('metalsmith-multi-language')
const permalinks = require('metalsmith-permalinks')
const dateInFilename = require('metalsmith-date-in-filename')
const collections = require('metalsmith-collections')
const summary = require('metalsmith-md-summary')
const debug = require('metalsmith-debug')
const tags = require('metalsmith-tags')
const hljs = require('highlight.js')

const DEFAULT_LOCALE = 'en'
const LOCALES = ['en', 'es']

const md = markdown({
  plugin: {
    fields: ['contents', 'summary']
  },
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>'
      } catch (__) {}
    }

    return ''
  }
})
md.use(require('markdown-it-code-embed'), { user: 'julioolvr' })

metalsmith(__dirname)
  .source('src')
  .destination('dist')
  .use(collections({
    posts_en: {
      pattern: 'posts/*_en.md',
      sortBy: 'date',
      reverse: true
    },
    posts_es: {
      pattern: 'posts/*_es.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(multiLanguage({
    default: DEFAULT_LOCALE,
    locales: LOCALES
  }))
  .use(dateInFilename())
  .use(summary({
    pattern: 'posts/*.md'
  }))
  .use(md)
  .use(permalinks({
    pattern: ':locale/:date/:title',
    linksets: [{
      match: { legacy: true },
      pattern: ':date/:legacyPath'
    }, {
      match: { collection: 'pages' },
      pattern: ':locale/x/:title'
    }]
  }))
  .use(tags({
    path: 'tags/:tag.html',
    layout: 'tag.pug',
    sortBy: 'date',
    reverse: true
  }))
  .use(permalinks({
    linksets: [{
      match: { layout: 'tag.pug' },
      pattern: 'tags/:tag'
    }]
  }))
  .use(assets({
    source: 'assets'
  }))
  .use(debug())
  .use(layouts({
    engine: 'pug',
    default: 'post.pug',
    pattern: '**/*.html'
  }))
  .build(err => {
    if (err) { console.error(err) }
  })