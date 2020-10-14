const tape = require('tape')

const port = process.env.PORT = process.env.PORT || require('get-port-sync')()
const server = require('./server')
const client = require('./client')({ endpoint: `http://localhost:${port}` })

tape('should list all products', function (t) {
  client.listProducts(function (err, products) {
    if (err) t.error('should not error')

    t.equal(products.length, 346, 'number of products should match')
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

tape('cleanup', function (t) {
  server.close()
  t.end()
})
