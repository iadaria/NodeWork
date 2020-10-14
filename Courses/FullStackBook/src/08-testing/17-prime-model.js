const db = require('./17-prime-db')
const isPrime = require('./04-is-prime-sqrt')

const Primes = db.model('Primes', {
  _id: {
    type: Number,
    validate: {
      validator: isPrime,
      message: props => `${props.value} is not prime`
    }
  }
})

module.exports = {
  setLargest,
  getLargest,
  model: Primes
}

async function getLargest () {
  const largest = await Primes.findOne().sort({ _id: -1 })
  return (largest || {})._id || 2
}

async function setLargest (number) {
  const currentLargest = await getLargest()
  if (currentLargest >= number) return currentLargest

  await new Primes({ _id: number }).save()
  return number
}
