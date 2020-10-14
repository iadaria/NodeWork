const cuid = require('cuid')

const db = require('../db-pg')

const COLS = [
  '_id',
  'description',
  'imgThumb',
  'img',
  'link',
  'userId',
  'userName',
  'userLink',
  'tags'
]

module.exports = {
  get,
  list,
  create,
  edit,
  remove
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, tag } = opts

  const query = tag
    ? {
      text: `SELECT * FROM products WHERE $3 = ANY (tags) ORDER BY _id LIMIT $1 OFFSET $2`,
      values: [limit, offset, tag]
    }
    : {
      text: `SELECT * FROM products ORDER BY _id LIMIT $1 OFFSET $2`,
      values: [limit, offset]
    }

  const result = await db.query(query)
  return result.rows
}

async function get (_id) {
  const query = {
    text: `SELECT * FROM products WHERE _id = $1`,
    values: [_id]
  }

  const result = await db.query(query)
  return result.rows[0]
}

async function create (fields) {
  fields._id = fields._id || cuid()
  const cols = COLS.map(col => `"${col}"`).join(', ')

  const values = COLS.map(col => Array.isArray(fields[col])
    ? `{${fields[col].join(', ')}}`
    : fields[col]
  )

  const phValues = values.map((v, i) => `$${i + 1}`).join(', ')

  const query = {
    text: `INSERT INTO products (${cols}) VALUES (${phValues})`,
    values
  }

  await db.query(query)
  return fields
}

async function edit (_id, change) {
  const changeKeys = Object.keys(change).filter(k => COLS.indexOf(k) >= 0)

  const setClause = changeKeys.map((k, i) => `"${k}" = $${i + 1}`).join(', ')
  const queryText = `UPDATE products SET ${setClause}
    WHERE _id = $${changeKeys.length + 1}`

  const values = changeKeys.map(k => change[k])

  const query = {
    text: queryText,
    values: values.concat([_id])
  }

  await db.query(query)
  const product = await get(_id)
  return product
}

async function remove (_id) {
  const query = {
    text: `DELETE FROM products WHERE _id = $1`,
    values: [_id]
  }

  await db.query(query)
}
