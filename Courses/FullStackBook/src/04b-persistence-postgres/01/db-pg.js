const { Pool } = require('pg')

module.exports = new Pool({
  // host: 'localhost',
  // port: 5432,
  // user: 'donny',
  // password: 'iamthewalrus',
  database: process.env.PGDATABASE || 'printshop'
})
