const { Client } = require('pg')
const pgtools = require('pgtools')

module.exports = async function (opts) {
  const { database } = opts
  delete opts.database
  if (opts.drop) {
    try {
      await pgtools.dropdb(opts, database)
    } catch (err) { }
  }

  await pgtools.createdb(opts, database)

  const client = new Client({ opts, ...{ database } })
  client.connect()

  await client.query(`CREATE TABLE products (
    "_id" TEXT PRIMARY KEY,
    "description" TEXT NOT NULL,
    "imgThumb" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userLink" TEXT NOT NULL,
    "tags" TEXT[]);
  `)

  await client.end()
}
