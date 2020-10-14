const fs = require('fs')
const https = require('https')

const fileUrl =
  'https://www.newline.co/fullstack-react/assets/images/fullstack-react-hero-book.png'

https.get(fileUrl, res => {
  const fileStream = fs.createWriteStream('book.png')
  res.on('data', data => fileStream.write(data)).on('end', () => {
    fileStream.end()
    console.log('file saved!')
  })
})
