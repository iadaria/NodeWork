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

tape('should list all products with filter', function (t) {
  client.listProducts({ tag: 'dog', limit: 2 }, function (err, products) {
    if (err) t.error('should not error')

    t.equal(products.length, 2, 'number of products should match')

    const tagSets = products.map(p => p.tags)
    tagSets.forEach(ts =>
      t.ok(ts.indexOf('dog') > -1, 'product should have selected tag')
    )

    t.end()
  })
})

tape('should get single product', function (t) {
  client.getProduct('cjv32mizj0004c9glejahg9i4', function (err, product) {
    if (err) t.error('should not error')

    t.equal(product._id, 'cjv32mizj0004c9glejahg9i4', 'id should match')
    t.equal(
      product.description,
      'blue and black abstract artwork',
      'description should match'
    )

    t.end()
  })
})

tape('should get error for missing single product', function (t) {
  client.getProduct('doesntexist', function (err, product) {
    t.ok(err.message.match('404'), 'should get 404')

    t.end()
  })
})

tape('should create new product', function (t) {
  const testProduct = {
    description: 'test description',
    imgThumb:
      'https://www.newline.co/fullstack-react/assets/images/fullstack-react-hero-book.png',
    img:
      'https://www.newline.co/fullstack-react/assets/images/fullstack-react-hero-book.png',
    link: 'https://fullstackreact.com',
    userId: 'fsreact',
    userName: 'David Guttman',
    userLink: 'https://fullstackreact.com',
    tags: ['react', 'javascript']
  }

  client.createProduct(testProduct, function (err, product) {
    if (err) t.error('should not error')
    t.end()

    // t.deepEqual(product, testProduct, 'product should match')

    // t.ok(product._id, 'should have product id')
    // client.getProduct(product._id, function (err, remoteProduct) {
    //   if (err) t.error('should not error')
    //
    //   t.equal(remoteProduct.description, testProduct.description, 'description should match')
    //   t.equal(remoteProduct.userName, testProduct.userName, 'userName should match')
    //   t.end()
    // })
  })
})

tape('should edit product', function (t) {
  const productId = 'cjv32mizj0004c9glejahg9i4'
  const changes = {
    userName: 'FS Test Bot'
  }

  client.editProduct(productId, changes, function (err, product) {
    if (err) t.error('should not error')

    t.equal(product.userName, changes.userName, 'userName should match')
    // t.equal(product.description, 'blue and black abstract artwork', 'description should stay the same')
    t.end()
  })
})

tape('should delete product', function (t) {
  const productId = 'cjv32mizj0004c9glejahg9i4'

  client.deleteProduct(productId, function (err, status) {
    if (err) t.error('should not error')

    t.ok(status.success, 'delete should be successful')
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
