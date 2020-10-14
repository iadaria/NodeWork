const fs = require('fs')
const https = require('https')

const fileUrl =
  'https://www.newline.co/fullstack-react/assets/images/fullstack-react-hero-book.png'

https.get(fileUrl, res => {
  const chunks = []

  res.on('data', data => chunks.push(data)).on('end', () =>
    fs.writeFile('book.png', Buffer.concat(chunks), err => {
      if (err) console.error(err)
      console.log('file saved!')
    })
  )
})
