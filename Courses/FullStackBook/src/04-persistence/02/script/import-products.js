const Products = require('../products')

const products = require('../../products.json')

products.forEach(async function (product) {
  await Products.create(product)
})
