const ghpages = require('gh-pages')
const path = require('path')

const REPO_URL = 'git@github.com:julioolvr/julioolvr.github.com.git'
const BRANCH = 'master'

const options = {
  repo: REPO_URL,
  branch: BRANCH
}

ghpages.publish(path.join(__dirname, 'dist'), options, err => {
  if (err) {
    console.error('Error publishing', err)
  } else {
    console.log('Published')
  }
})