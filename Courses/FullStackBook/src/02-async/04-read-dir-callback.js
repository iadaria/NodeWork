const fs = require('fs')

const directoryPath = './'

fs.readdir(directoryPath, (err, fileList) => {
  if (err) return console.error(err)

  console.log(fileList)
})
