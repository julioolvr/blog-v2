const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const assets = require('metalsmith-assets')
const layouts = require('metalsmith-layouts')
const multiLanguage = require('metalsmith-multi-language');

const DEFAULT_LOCALE = 'en'
const LOCALES = ['en', 'es']

metalsmith(__dirname)
  .source('src')
  .destination('dist')
  .use(multiLanguage({
    default: DEFAULT_LOCALE,
    locales: LOCALES
  }))
  .use(markdown())
  .use(assets({
    source: 'assets'
  }))
  .use(layouts({
    engine: 'pug',
    default: 'default.pug',
    pattern: '**/*.html'
  }))
  .build(err => {
    if (err) { console.error(err) }
  })