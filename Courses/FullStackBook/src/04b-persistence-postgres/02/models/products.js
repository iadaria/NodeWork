const cuid = require('cuid')

const db = require('../db-pg')

module.exports = {
  get,
  list,
  create,
  edit,
  remove
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, tag } = opts

  const table = db('products')
  const query = tag
    ? table.whereRaw('? = ANY (tags)', [tag])
    : table

  const result = await query.orderBy('_id').limit(limit).offset(offset)
  return result
}

async function get (_id) {
  const [ product ] = await db('products').where({ _id })
  return product
}

async function create (fields) {
  fields._id = fields._id || cuid()

  await db('products').insert(fields)
  return fields
}

async function edit (_id, change) {
  await db('products').where({ _id }).update(change)
  const product = await get(_id)
  return product
}

async function remove (_id) {
  await db('products').where({ _id }).del()
}
