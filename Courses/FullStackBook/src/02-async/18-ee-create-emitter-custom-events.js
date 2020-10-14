const http = require('http')
const readline = require('readline')
const querystring = require('querystring')
const EventEmitter = require('events')

const rl = readline.createInterface({ input: process.stdin })

rl.on('line', line => {
  http.get(
    `http://localhost:1337/chat?${querystring.stringify({ message: line })}`
  )
})

const source = createEventSource('http://localhost:1337/sse')
// source.on('message', console.log)
source.on('question', q => console.log(`Someone asked, "${q}"`))
source.on('statement', s => console.log(`Someone said, "${s}"`))

function createEventSource (url) {
  const source = new EventEmitter()

  http.get(url, res => {
    res.on('data', data => {
      const message = data
        .toString()
        .replace(/^data: /, '')
        .replace(/\n\n$/, '')

      source.emit('message', message)

      const eventType = message.match(/\?$/) ? 'question' : 'statement'
      source.emit(eventType, message)
    })
  })

  return source
}
