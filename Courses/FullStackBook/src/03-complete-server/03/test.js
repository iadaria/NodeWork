const tape = require('tape')

const port = process.env.PORT = process.env.PORT || require('get-port-sync')()
const server = require('./server')
const client = require('./client')({ endpoint: `http://localhost:${port}` })

tape('should list all products', function (t) {
  client.listProducts(function (err, products) {
    if (err) t.error('should not error')

    t.equal(products.length, 25, 'number of products should match')
    const product = products[20]

    t.equal(product._id, 'cjv32mizj000kc9gl2r2lgj1r', 'id should match')
    t.equal(
      product.description,
      'Oculus NYC facade',
      'description should match'
    )

    t.end()
  })
})

tape('should list all products with limit', function (t) {
  client.listProducts({ limit: 5 }, function (err, products) {
    if (err) t.error('should not error')

    t.equal(products.length, 5, 'number of products should match')
    const product = products[4]

    t.equal(product._id, 'cjv32mizj0004c9glejahg9i4', 'id should match')
    t.equal(
      product.description,
      'blue and black abstract artwork',
      'description should match'
    )

    t.end()
  })
})

tape('should list all products with offset', function (t) {
  client.listProducts({ offset: 4, limit: 5 }, function (err, products) {
    if (err) t.error('should not error')

    t.equal(products.length, 5, 'number of products should match')
    const product = products[0]

    t.equal(product._id, 'cjv32mizj0004c9glejahg9i4', 'id should match')
    t.equal(
      product.description,
      'blue and black abstract artwork',
      'description should match'
    )

    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
