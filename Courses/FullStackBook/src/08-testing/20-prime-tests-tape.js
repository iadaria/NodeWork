process.env.NODE_ENV = 'test'

const got = require('got')
const tape = require('tape')
const getPort = require('get-port')
const { MongoMemoryServer } = require('mongodb-memory-server')

const db = require('./17-prime-db')
const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./08-find-primes-async')
const createServer = require('./17-prime-server')
const { mongo: mongoOpts } = require('./17-config.json')

const context = {}

tape('setup', async function (t) {
  const port = await getPort()
  context.server = createServer().listen(port)
  context.origin = `http://localhost:${port}`

  context.mongoServer = new MongoMemoryServer()
  const uri = await context.mongoServer.getConnectionString()
  db.connect(uri, mongoOpts)

  t.end()
})

tape.onFinish(function () {
  context.server.close()
  db.disconnect()
  context.mongoServer.stop()
})

tape('should detect prime numbers', function (t) {
  t.true(isPrime(2), '2 should be prime')
  t.true(isPrime(3), '3 should be prime')
  t.true(isPrime(5), '5 should be prime')
  t.true(isPrime(1489), '1489 should be prime')
  t.true(isPrime(2999), '2999 should be prime')

  t.false(isPrime(4), '4 should not be prime')
  t.false(isPrime(9), '9 should not be prime')
  t.false(isPrime(200), '200 should not be prime')

  t.end()
})

tape('should find prime numbers', async function (t) {
  const primes = await findPrimes(1000, 5)
  t.deepEqual(
    primes,
    [1009, 1013, 1019, 1021, 1031],
    'should find 5 primes greater than 1000'
  )
  t.end()
})

tape('should not block while finding primes', async function (t) {
  const { origin } = context
  const urlSlow = `${origin}/find-primes?nStart=1&count=35000`
  const urlFast = `${origin}/is-prime?n=2`

  const responses = {}
  const timeStart = Date.now()
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
    t.true(correctOrder, 'should get fast response before slow')
    t.end()
  }
})

tape('should track largest prime found', async function (t) {
  await db.connection.db.dropDatabase()

  const { origin } = context
  const urlFind = `${origin}/find-primes?nStart=1&count=5`
  const foundPrimes = await got(urlFind).json()
  t.deepEqual(foundPrimes, [ 2, 3, 5, 7, 11 ], 'should find primes via endpoint')

  const urlLargest = `${origin}/largest-prime`
  const largest = await got(urlLargest).json()
  t.equal(largest, 11, 'should get largest prime via endpoint')
  t.end()
})
