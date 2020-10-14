const { Client } = require('pg')
const client = new Client({ database: 'printshop' })
client.connect()

const insertQuery = `
  INSERT INTO products (
    "_id",
    "description",
    "imgThumb",
    "img",
    "link",
    "userId",
    "userName",
    "userLink",
    "tags"
  )
  VALUES (
    'nicerug',
    'a rug that ties the room together',
    'https://maudephotos.com/rug-thumb.jpg',
    'https://maudephotos.com/rug.jpg',
    'https://maudephotos.com/rug',
    'm1234',
    'maude',
    'https://instagram.com/maude',
    '{ rug, design }'
  )
`
client.query(insertQuery).then(console.log)

const selectQuery = 'SELECT * FROM products'
client.query(selectQuery).then(res => console.log(res.rows))

const removeQuery = `DELETE FROM products WHERE _id = 'nicerug'`
client.query(removeQuery).then(res => console.log(res.rowCount))

client.query(selectQuery).then(res => console.log(res.rows))
