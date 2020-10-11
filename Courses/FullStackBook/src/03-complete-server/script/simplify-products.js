const products = require('../full-products.json').map(simplifyProduct)

require('fs').writeFile(
  require('path').join(__dirname, '../products.json'),
  JSON.stringify(products),
  console.log
)

function simplifyProduct (product) {
  return {
    id: product.id,
    description: product.description || product.alt_description,
    imgThumb: product.urls.thumb,
    img: product.urls.regular,
    link: product.links.html,
    userId: product.user.id,
    userName: product.user.name,
    userLink: product.user.links.html,
    tags: product.tags.map(t => t.title)
  }
}
