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

const DEFAULT_LOCALE = 'en'
const LOCALES = ['en', 'es']

const md = markdown({
  plugin: {
    fields: ['contents', 'summary']
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
  .use(debug())
  .use(permalinks({
    pattern: ':locale/:date/:title',
    linksets: [{
      match: { legacy: true },
      pattern: ':date/:legacyPath'
    }]
  }))
  .use(assets({
    source: 'assets'
  }))
  .use(layouts({
    engine: 'pug',
    default: 'post.pug',
    pattern: '**/*.html'
  }))
  .build(err => {
    if (err) { console.error(err) }
  })