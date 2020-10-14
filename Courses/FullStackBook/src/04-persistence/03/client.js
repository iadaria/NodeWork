const http = require('http')
const querystring = require('querystring')

module.exports = function ({ endpoint }) {
  endpoint = endpoint || 'http://localhost:1337'

  return {
    getProduct,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    createOrder,
    listOrders
  }

  function getProduct (id, cb) {
    const url = `${endpoint}/products/${id}`
    getJSON(url, cb)
  }

  function listProducts (opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    }

    const { offset = 0, limit = 25, tag } = opts
    const url = `${endpoint}/products?${querystring.stringify({
      offset,
      limit,
      tag
    })}`
    getJSON(url, cb)
  }

  function createProduct (product, cb) {
    const url = `${endpoint}/products`
    postJSON(url, product, cb)
  }

  function editProduct (id, changes, cb) {
    const url = `${endpoint}/products/${id}`
    putJSON(url, changes, cb)
  }

  function deleteProduct (id, cb) {
    const url = `${endpoint}/products/${id}`
    delJSON(url, cb)
  }

  function createOrder ({ products, buyerEmail }, cb) {
    const url = `${endpoint}/orders`
    postJSON(url, { products, buyerEmail }, cb)
  }

  function listOrders (opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    }

    const { offset = 0, limit = 25, status, productId } = opts
    const url = `${endpoint}/orders?${querystring.stringify({
      offset,
      limit,
      status,
      productId
    })}`
    getJSON(url, cb)
  }
}

function getJSON (url, cb) {
  http.get(url, res => parseJSON(res, cb)).on('error', err => cb(err))
}

function postJSON (url, data, cb) {
  const postData = JSON.stringify(data)

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  http
    .request(url, options, res => parseJSON(res, cb))
    .on('error', err => cb(err))
    .end(postData)
}

function putJSON (url, data, cb) {
  const postData = JSON.stringify(data)

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  http
    .request(url, options, res => parseJSON(res, cb))
    .on('error', err => cb(err))
    .end(postData)
}

function delJSON (url, cb) {
  const options = { method: 'DELETE' }

  http
    .request(url, options, res => parseJSON(res, cb))
    .on('error', err => cb(err))
    .end()
}

function parseJSON (res, cb) {
  const { statusCode } = res
  const contentType = res.headers['content-type']

  let error
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
    error.statusCode = statusCode
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(
      'Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`
    )
  }

  if (error) {
    res.resume()
    return cb(error)
  }

  res.setEncoding('utf8')
  let rawData = ''
  res
    .on('data', chunk => {
      rawData += chunk
    })
    .on('end', () => {
      try {
        const parsedData = JSON.parse(rawData)
        cb(null, parsedData)
      } catch (e) {
        console.error(e.message)
      }
    })
}
