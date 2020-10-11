const knex = require('knex')

module.exports = knex({
  client: 'pg',
  connection: {
    // host: 'localhost',
    // port: 5432,
    // user: 'donny',
    // password: 'iamthewalrus',
    database: process.env.PGDATABASE || 'printshop'
  }
})
