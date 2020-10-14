const { isEqual, finish } = require('./06-simple-test')

const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./05-find-primes-sync')

isEqual(isPrime(2), true, '2 should be prime')
isEqual(isPrime(3), true, '3 should be prime')
isEqual(isPrime(4), false, '4 should not be prime')
isEqual(isPrime(5), true, '5 should be prime')
isEqual(isPrime(9), false, '9 should not be prime')
isEqual(isPrime(200), false, '200 should not be prime')
isEqual(isPrime(1489), true, '1489 should be prime')
isEqual(isPrime(2999), true, '2999 should be prime')

isEqual(
  findPrimes(1000, 5),
  [1009, 1013, 1019, 1021, 1031],
  'should find 5 primes greater than 1000'
)

finish()
