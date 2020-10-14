const fs = require('fs')
const csv = require('csv-parser')
const { Transform } = require('stream')

fs.createReadStream('people.csv')
  .pipe(csv())
  .pipe(clean())
  .on('data', row => console.log(JSON.stringify(row)))

function clean () {
  return new Transform({
    transform (row, encoding, callback) {
      callback(null, row)
    }
  })
}
