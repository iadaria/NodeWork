const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, '../products.json')

module.exports = {
  list
}

async function list (opts = {}) {
  const { offset = 0, limit = 25 } = opts

  const data = await fs.readFile(productsFile)
  return JSON.parse(data).slice(offset, offset + limit)
}
