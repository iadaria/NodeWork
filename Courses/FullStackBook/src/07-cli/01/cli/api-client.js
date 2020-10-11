const axios = require('axios')
const querystring = require('querystring')

module.exports = function (opts = {}) {
  let { endpoint, username, password, authToken } = opts
  endpoint = endpoint || 'http://localhost:1337'

  let authAgent = authToken
    ? axios.create({ headers: { authorization: `Bearer ${authToken}` } })
    : null

  return {
    login,
    getProduct,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    createOrder,
    createUser,
    listOrders
  }

  async function login () {
    const url = `${endpoint}/login`
    const response = await postJSON(url, { username, password })

    if (response.data.token) {
      let token = response.data.token
      authAgent = axios.create({
        headers: { authorization: `Bearer ${token}` }
      })
      return token
    }
  }

  async function getProduct (id) {
    const url = `${endpoint}/products/${id}`
    return (await getJSON(url)).data
  }

  async function listProducts (opts = {}) {
    const { offset = 0, limit = 25, tag } = opts
    const url = `${endpoint}/products?${querystring.stringify({
      offset,
      limit,
      tag
    })}`
    return (await getJSON(url)).data
  }

  async function createProduct (product) {
    const url = `${endpoint}/products`
    return (await withLogin(postJSON)(url, product)).data
  }

  async function editProduct (id, changes) {
    const url = `${endpoint}/products/${id}`
    return (await withLogin(putJSON)(url, changes)).data
  }

  async function deleteProduct (id) {
    const url = `${endpoint}/products/${id}`
    return (await withLogin(delJSON)(url)).data
  }

  async function createOrder ({ products, username }) {
    const url = `${endpoint}/orders`
    return (await withLogin(postJSON)(url, { products, username })).data
  }

  async function createUser ({ username, password, email }) {
    const url = `${endpoint}/users`
    return (await postJSON(url, { username, password, email })).data
  }

  async function listOrders (opts = {}) {
    const { offset = 0, limit = 25, status, productId } = opts
    const url = `${endpoint}/orders?${querystring.stringify({
      offset,
      limit,
      status,
      productId
    })}`
    return (await withLogin(getJSON)(url)).data
  }

  function withLogin (fn) {
    if (authAgent) return fn
    if (!username || !password) return fn

    return async function () {
      await login()
      const result = await fn.apply(fn, arguments)
      return result
    }
  }

  function getJSON (url) {
    return (authAgent || axios).get(url)
  }

  async function postJSON (url, data) {
    return (authAgent || axios).post(url, data)
  }

  function putJSON (url, data, cb) {
    return (authAgent || axios).put(url, data)
  }

  function delJSON (url, cb) {
    return (authAgent || axios).delete(url)
  }
}
