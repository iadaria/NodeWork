/* global beforeAll, afterAll, test, expect */

process.env.NODE_ENV = 'test'

const got = require('got')
const getPort = require('get-port')
const { MongoMemoryServer } = require('mongodb-memory-server')

const db = require('./17-prime-db')
const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./08-find-primes-async')
const createServer = require('./17-prime-server')
const { mongo: mongoOpts } = require('./17-config.json')

const context = {}

beforeAll(async function () {
  const port = await getPort()
  context.server = createServer().listen(port)
  context.origin = `http://localhost:${port}`

  context.mongoServer = new MongoMemoryServer()
  const uri = await context.mongoServer.getConnectionString()
  await db.connect(uri, mongoOpts)
})

afterAll(function () {
  context.server.close()
  db.disconnect()
  context.mongoServer.stop()
})

test('should detect prime numbers', function () {
  expect(isPrime(2)).toBe(true)
  expect(isPrime(3)).toBe(true)
  expect(isPrime(5)).toBe(true)
  expect(isPrime(1489)).toBe(true)
  expect(isPrime(2999)).toBe(true)

  expect(isPrime(4)).toBe(false)
  expect(isPrime(9)).toBe(false)
  expect(isPrime(200)).toBe(false)
})

test('should find prime numbers', async function () {
  const primes = await findPrimes(1000, 5)
  expect(primes).toStrictEqual([1009, 1013, 1019, 1021, 1031])
})

test('should not block while finding primes', function () {
  const { origin } = context
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
      expect(correctOrder).toBe(true)
      resolve()
    }
  })
}, 10000)

test('should track largest prime found', async function () {
  await db.connection.db.dropDatabase()

  const { origin } = context
  const urlFind = `${origin}/find-primes?nStart=1&count=5`
  const foundPrimes = await got(urlFind).json()
  expect(foundPrimes).toStrictEqual([ 2, 3, 5, 7, 11 ])

  const urlLargest = `${origin}/largest-prime`
  const largest = await got(urlLargest).json()
  expect(largest).toBe(11)
})
