module.exports = function isPrime (num) {
  for (let den = 2; den < num; den++) {
    if (num % den === 0) return false
  }

  return true
}
