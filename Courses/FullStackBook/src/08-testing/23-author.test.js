const test = require('ava')
const proxyquire = require('proxyquire')

const words = ['this', 'is', 'a', 'random', 'sentence']
const author = proxyquire('./23-author', {
  './23-word-utils': { randomWord: () => words.shift() }
})

test('should create random sentence', function (t) {
  const sentence = author.randomSentence(5)
  const expected = 'This is a random sentence.'
  t.is(sentence, expected, 'sentence should match')
})
