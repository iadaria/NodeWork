const cuid = require('cuid')
const { isEmail } = require('validator')

const db = require('../db')
const Products = require('./products')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: emailSchema({ required: true }),
  products: [
    {
      type: String,
      index: true,
      required: true
    }
  ],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Order
}

async function list (opts = {}) {
  const { offset = 0, limit = 25, productId, status } = opts

  const query = {}
  if (productId) query.products = productId
  if (status) query.status = status

  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
    .exec()

  const withProducts = await Promise.all(orders.map(populate))
  return withProducts
}

async function get (_id) {
  const order = await Order.findById(_id).exec()
  const withProducts = await populate(order)
  return withProducts
}

async function create (fields) {
  const order = await new Order(fields).save()
  const withProducts = await populate(order)
  return withProducts
}

async function edit (_id, change) {
  const order = await Order.findById(_id).exec()
  Object.keys(change).forEach(function (key) {
    order[key] = change[key]
  })
  await order.save()
  return order
}

async function remove (_id) {
  await Order.deleteOne({ _id })
}

function emailSchema (opts = {}) {
  const { required } = opts
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    }
  }
}

async function populate (order) {
  const products = await Promise.all(
    order.products.map(async function (productId) {
      const product = await Products.get(productId)
      return product
    })
  )

  return { ...order._doc, ...{ products } }
}
