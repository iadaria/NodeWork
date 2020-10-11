const { randomWord } = require('./23-word-utils')

module.exports = {
  randomSentence
}

function randomSentence (wordCount) {
  const words = new Array(wordCount).fill(0).map(randomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}
