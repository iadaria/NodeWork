const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

module.exports = autoCatch({
  getProduct,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct
})

async function getProduct (req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) return next()

  res.json(product)
}

async function listProducts (req, res, next) {
  const { offset = 0, limit = 25, tag } = req.query

  const products = await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  })

  res.json(products)
}

async function createProduct (req, res, next) {
  console.log('request body:', req.body)
  res.json(req.body)
}

async function editProduct (req, res, next) {
  // console.log(req.body)
  res.json(req.body)
}

async function deleteProduct (req, res, next) {
  res.json({ success: true })
}
