const fs = require('fs').promises
const path = require('path')
const express = require('express')

const port = process.env.PORT || 1337

const app = express()
app.get('/products', listProducts)
app.listen(port, () => console.log(`Server listening on port ${port}`))

async function listProducts (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const productsFile = path.join(__dirname, '../products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
