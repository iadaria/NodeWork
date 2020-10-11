const fs = require('fs').promises
const path = require('path')
const cuid = require('cuid')

const db = require('./db')
const productsFile = path.join(__dirname, '../products.json')

const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: String,
  imgThumb: String,
  img: String,
  link: String,
  userId: String,
  userName: String,
  userLink: String,
  tags: { type: [String], index: true }
})

module.exports = {
  get,
  list,
  create
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, tag } = opts

  const products = JSON.parse(await fs.readFile(productsFile))

  return products
    .filter((p, i) => !tag || p.tags.indexOf(tag) >= 0)
    .slice(offset, offset + limit)
}

async function get (id) {
  const products = JSON.parse(await fs.readFile(productsFile))

  for (let i = 0; i < products.length; i++) {
    if (products[i]._id === id) return products[i]
  }

  return null
}

async function create (fields) {
  const product = await new Product(fields).save()
  return product
}
