require('dotenv').config()

module.exports = {
  adminPassword: process.env.ADMIN_PASSWORD || 'iamthewalrus',
  jwtSecret: process.env.JWT_SECRET || 'mark it zero',
  mongo: {
    connectionString: process.env.MONGO_URI || 'mongodb://localhost:27017/printshop'
  }
}
