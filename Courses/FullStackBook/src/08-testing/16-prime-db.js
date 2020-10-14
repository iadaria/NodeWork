const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost:27017/prime-test',
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
)

module.exports = mongoose
