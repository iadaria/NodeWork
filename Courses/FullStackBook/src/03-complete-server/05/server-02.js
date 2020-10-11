const express = require('express')

const api = require('./api-02')
const middleware = require('./middleware')

const port = process.env.PORT || 1337
const app = express()

app.use(middleware.cors)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
