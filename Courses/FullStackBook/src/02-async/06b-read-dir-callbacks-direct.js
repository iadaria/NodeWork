const fs = require('fs')

fs.readdir('./', function (err, files) {
  if (err) return console.error(err)

  mapAsync(files, fs.readFile, (err, results) => {
    if (err) return console.error(err)

    results.forEach((data, i) => console.log(`${files[i]}: ${data.length}`))

    console.log('done!')
  })
})

function mapAsync (arr, fn, onFinish) {
  let prevError
  let nRemaining = arr.length
  const results = []

  arr.forEach(function (item, i) {
    fn(item, function (err, data) {
      if (prevError) return

      if (err) {
        prevError = err
        return onFinish(err)
      }

      results[i] = data

      nRemaining--
      if (!nRemaining) onFinish(null, results)
    })
  })
}
