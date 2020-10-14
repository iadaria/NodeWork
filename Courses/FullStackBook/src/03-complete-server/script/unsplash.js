require('isomorphic-fetch')
const Unsplash = require('unsplash-js').default
const toJson = require('unsplash-js').toJson

const creds = require('./creds.json')

const unsplash = new Unsplash(creds)

const search = process.argv[2]

unsplash.search.photos(search, 1, 100).then(toJson).then(body => console.log(JSON.stringify(body, null, 2)))
