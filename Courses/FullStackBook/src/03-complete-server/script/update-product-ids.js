const cuid = require('cuid')

const productsV1 = require('../products.json')

console.log(JSON.stringify(productsV1.map(p => ({
  _id: cuid(),
  description: p.description,
  imgThumb: p.imgThumb,
  img: p.img,
  link: p.link,
  userId: p.userId,
  userName: p.userName,
  userLink: p.userLink,
  tags: p.tags
}))))
