const fs = require('fs')

module.exports = {
  randomWord
}

function randomWord () {
  const words = fs.readFileSync('/usr/share/dict/words', 'ascii').split('\n')
  return words[Math.floor(Math.random() * words.length)]
}
