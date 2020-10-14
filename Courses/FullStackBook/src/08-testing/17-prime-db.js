const mongoose = require('mongoose')
const { mongo: opts } = require('./17-config.json')

module.exports = mongoose

if (process.env.NODE_ENV !== 'test') {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/primes'
  mongoose.connect(uri, opts)
}
