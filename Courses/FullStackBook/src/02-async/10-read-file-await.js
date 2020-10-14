const fs = require('fs').promises

printLength('10-read-file-await.js')

async function printLength (file) {
  try {
    const data = await fs.readFile(file)
    console.log(`${file}: ${data.length}`)
  } catch (err) {
    console.error(err)
  }
}
