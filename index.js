const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const assets = require('metalsmith-assets')
const layouts = require('metalsmith-layouts')
const multiLanguage = require('metalsmith-multi-language')
const permalinks = require('metalsmith-permalinks')
const dateInFilename = require('metalsmith-date-in-filename')
const debug = require('metalsmith-debug')

const DEFAULT_LOCALE = 'en'
const LOCALES = ['en', 'es']

metalsmith(__dirname)
  .source('src')
  .destination('dist')
  .use(multiLanguage({
    default: DEFAULT_LOCALE,
    locales: LOCALES
  }))
  .use(dateInFilename())
  .use(markdown())
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
    default: 'default.pug',
    pattern: '**/*.html'
  }))
  .use(debug())
  .build(err => {
    if (err) { console.error(err) }
  })