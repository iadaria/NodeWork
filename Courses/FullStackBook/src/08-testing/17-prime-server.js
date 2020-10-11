const URL = require('url')
const http = require('http')

const Primes = require('./17-prime-model')
const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./08-find-primes-async')

if (require.main === module) {
  const port = process.env.PORT || 1337
  http.createServer(onRequest).listen(port)
  console.log(`Prime Server listening on port ${port}`)
}

module.exports = () => http.createServer(onRequest)

function onRequest (req, res) {
  const opts = URL.parse(req.url, true)

  const handlers = {
    '/is-prime': handleIsPrime,
    '/find-primes': handleFindPrimes,
    '/largest-prime': handleLargestPrime
  }

  const handler = handlers[opts.pathname] || handleNotFound
  handler(req, res, opts)
}

function handleIsPrime (req, res, opts) {
  const n = parseFloat(opts.query.n)

  if (!isFinite(n)) return sendJSON(res, 400, { error: 'Bad Request' })

  sendJSON(res, 200, isPrime(n))
}

async function handleFindPrimes (req, res, opts) {
  const nStart = parseFloat(opts.query.nStart)
  const count = parseFloat(opts.query.count)

  if (!isFinite(nStart) || !isFinite(count)) {
    return sendJSON(res, 400, { error: 'Bad Request' })
  }

  const primes = await findPrimes(nStart, count)

  const largest = primes.slice(-1)[0]
  if (largest) await Primes.setLargest(largest)

  sendJSON(res, 200, primes)
}

async function handleLargestPrime (req, res, opts) {
  const largestPrime = await Primes.getLargest()
  sendJSON(res, 200, largestPrime)
}

function handleNotFound (req, res, opts) {
  sendJSON(res, 404, { error: 'Not Found' })
}

function sendJSON (res, status, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(message))
}
