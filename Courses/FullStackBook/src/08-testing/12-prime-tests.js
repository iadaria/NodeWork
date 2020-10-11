const got = require('got')
const getPort = require('get-port')

const { isEqual, finish } = require('./07-simple-test')

const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./08-find-primes-async')
const createServer = require('./10-prime-server')

runTests()

async function runTests () {
  isPrimeTests()
  await findPrimeTests()
  await primeServerTests()

  finish()
}

function isPrimeTests () {
  isEqual(isPrime(2), true, '2 should be prime')
  isEqual(isPrime(3), true, '3 should be prime')
  isEqual(isPrime(4), false, '4 should not be prime')
  isEqual(isPrime(5), true, '5 should be prime')
  isEqual(isPrime(9), false, '9 should not be prime')
  isEqual(isPrime(200), false, '200 should not be prime')
  isEqual(isPrime(1489), true, '1489 should be prime')
  isEqual(isPrime(2999), true, '2999 should be prime')
}

async function findPrimeTests () {
  const primes = await findPrimes(1000, 5)
  isEqual(
    primes,
    [1009, 1013, 1019, 1021, 1031],
    'should find 5 primes greater than 1000'
  )
}

async function primeServerTests () {
  const port = await getPort()
  const server = createServer().listen(port)
  const origin = `http://localhost:${port}`

  const urlSlow = `${origin}/find-primes?nStart=1&count=35000`
  const urlFast = `${origin}/is-prime?n=2`

  const timeStart = Date.now()
  return new Promise(function (resolve, reject) {
    const responses = {}
    got(urlSlow).json().then(() => {
      responses.slow = Date.now() - timeStart
      if (responses.fast) onFinish()
    })

    got(urlFast).json().then(() => {
      responses.fast = Date.now() - timeStart
      if (responses.slow) onFinish()
    })

    function onFinish () {
      const correctOrder = responses.fast < responses.slow
      isEqual(correctOrder, true, 'should get fast response before slow')
      server.close()
      resolve()
    }
  })
}
