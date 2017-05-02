const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const assets = require('metalsmith-assets')
const layouts = require('metalsmith-layouts')

metalsmith(__dirname)
  .source('src')
  .destination('dist')
  .use(markdown())
  .use(assets({
    source: 'assets'
  }))
  .use(layouts({
    engine: 'jade',
    default: 'default.jade',
    pattern: '**/*.html'
  }))
  .build(err => {
    if (err) { console.error(err) }
  })