const fs = require('fs')

fs.readdir('./', function (err, files) {
  if (err) return console.error(err)

  mapAsync(files, readFile, onFinish)

  function readFile (file, cb) {
    fs.readFile(file, function (err, data) {
      if (err) {
        if (err.code === 'EISDIR') return cb(null, [file, 0])
        return cb(err)
      }

      cb(null, [file, data.length])
    })
  }

  function onFinish (err, results) {
    if (err) return console.error(err)

    results.forEach(([file, length]) => console.log(`${file}: ${length}`))

    console.log('done!')
  }
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
