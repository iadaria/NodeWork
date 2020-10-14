const faker = require('faker')

const companies = new Array(10).fill(0).map(createCompany)

const departments = new Array(5).fill(0).map(createDepartment)

const products = new Array(100).fill(0).map(p => createProduct({
  company: pickRandom(companies),
  department: pickRandom(departments)
}))

console.log(products)

function createProduct ({company, department}) {
  console.log(department)
  return {
    name: faker.commerce.productName(),
    color: faker.commerce.color(),
    company: company.name,
    department: department.name
  }
}

function createCompany () {
  return {
    name: faker.company.companyName(),
    description: faker.company.catchPhrase()
  }
}

function createDepartment () {
  return {
    name: faker.commerce.department()
  }
}

function pickRandom (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
