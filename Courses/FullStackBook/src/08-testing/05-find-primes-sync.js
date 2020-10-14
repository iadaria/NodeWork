const isPrime = require('./04-is-prime-sqrt')

module.exports = function (nStart, count) {
  let n = nStart

  const primes = []

  while (primes.length < count) {
    n++
    if (isPrime(n)) primes.push(n)
  }

  return primes
}
