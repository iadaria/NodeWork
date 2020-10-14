const util = require('util')
const isPrime = require('./04-is-prime-sqrt')

const setImmediatePromise = util.promisify(setImmediate)

module.exports = function findPrimes (nStart, count, primes = []) {
  return new Promise(async function (resolve, reject) {
    await setImmediatePromise()

    const { found, remaining, nLast } = findPrimesTimed(nStart, count, 25)
    primes = primes.concat(found)

    if (!remaining) return resolve(primes)

    resolve(findPrimes(nLast, remaining, primes))
  })
}

function findPrimesTimed (nStart, count, duration) {
  let nLast = nStart
  const found = []

  const breakTime = Date.now() + duration

  while (found.length < count && Date.now() < breakTime) {
    nLast++
    if (isPrime(nLast)) found.push(nLast)
  }

  const remaining = count - found.length
  return { found, nLast, remaining }
}
