const cuid = require('cuid')
const { isURL } = require('validator')

const db = require('../db')
const dbPg = require('../db-pg')

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

const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String, required: true },
  imgThumb: urlSchema({ required: true }),
  img: urlSchema({ required: true }),
  link: urlSchema(),
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userLink: urlSchema(),
  tags: { type: [String], index: true }
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Product
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, tag } = opts

  const query = tag ? { tags: tag } : {}
  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return products
}

async function get (_id) {
  const product = await Product.findById(_id)
  return product
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

  await dbPg.query(query)
  return fields
}

async function edit (_id, change) {
  const product = await get(_id)
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  await product.save()
  return product
}

async function remove (_id) {
  await Product.deleteOne({ _id })
}

function urlSchema (opts = {}) {
  const { required } = opts
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isURL,
      message: props => `${props.value} is not a valid URL`
    }
  }
}
