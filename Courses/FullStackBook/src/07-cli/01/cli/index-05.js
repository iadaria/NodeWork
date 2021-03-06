#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const netrc = require('netrc')
const Table = require('cli-table')
const prompts = require('prompts')
const ApiClient = require('./api-client')

yargs
  .option('endpoint', {
    alias: 'e',
    default: 'http://localhost:1337',
    describe: 'The endpoint of the API'
  })
  .command('login', 'Log in to API', {}, login)
  .command('logout', 'Log out of API', {}, logout)
  .command('whoami', 'Check login status', {}, whoami)
  .command(
    'list products',
    'Get a list of products',
    {
      tag: {
        alias: 't',
        describe: 'Filter results by tag'
      },
      limit: {
        alias: 'l',
        type: 'number',
        default: 25,
        describe: 'Limit the number of results'
      },
      offset: {
        alias: 'o',
        type: 'number',
        default: 0,
        describe: 'Skip number of results'
      }
    },
    listProducts
  )
  .command('view product <id>', 'View a product', {}, viewProduct)
  .command(
    'edit product <id>',
    'Edit a product',
    {
      key: {
        alias: 'k',
        required: true,
        describe: 'Product key to edit'
      },
      value: {
        alias: 'v',
        required: true,
        describe: 'New value for product key'
      }
    },
    editProduct
  )
  .help()
  .demandCommand(1, 'You need at least one command before moving on')
  .parse()

async function login (opts) {
  const { endpoint } = opts

  const { username, password } = await prompts([
    {
      name: 'username',
      message: chalk.gray('What is your username?'),
      type: 'text'
    },
    {
      name: 'password',
      message: chalk.gray('What is your password?'),
      type: 'password'
    }
  ])

  const api = ApiClient({ username, password, endpoint })
  const authToken = await api.login()

  saveConfig({ endpoint, username, authToken })

  console.log(chalk.green(`Logged in as ${chalk.bold(username)}`))
}

function logout ({ endpoint }) {
  saveConfig({ endpoint })
  console.log('You are now logged out.')
}

function whoami ({ endpoint }) {
  const { username } = loadConfig({ endpoint })

  const message = username
    ? `You are logged in as ${chalk.bold(username)}`
    : 'You are not currently logged in.'

  console.log(message)
}

async function listProducts (opts) {
  const { tag, offset, limit, endpoint } = opts
  const api = ApiClient({ endpoint })
  const products = await api.listProducts({ tag, offset, limit })

  const cols = process.stdout.columns - 10
  const colsId = 30
  const colsProp = Math.floor((cols - colsId) / 3)
  const table = new Table({
    head: ['ID', 'Description', 'Tags', 'User'],
    colWidths: [colsId, colsProp, colsProp, colsProp]
  })

  products.forEach(p =>
    table.push([
      p._id,
      p.description.replace(/\n|\r/g, ' '),
      p.userName,
      p.tags.slice(0, 3).join(', ')
    ])
  )

  console.log(table.toString())
}

async function viewProduct (opts) {
  const { id, endpoint } = opts
  const api = ApiClient({ endpoint })
  const product = await api.getProduct(id)

  const cols = process.stdout.columns - 10
  const table = new Table({
    colWidths: [15, cols - 15]
  })
  Object.keys(product).forEach(k =>
    table.push({ [k]: JSON.stringify(product[k]) })
  )

  console.log(table.toString())
}

async function editProduct (opts) {
  const { id, key, value, endpoint } = opts
  const change = { [key]: value }

  const { authToken } = loadConfig({ endpoint })

  const api = ApiClient({ endpoint, authToken })
  await api.editProduct(id, change)

  viewProduct({ id, endpoint })
}

function saveConfig ({ endpoint, username, authToken }) {
  const allConfig = netrc()
  const host = endpointToHost(endpoint)
  allConfig[host] = { login: username, password: authToken }
  netrc.save(allConfig)
}

function loadConfig ({ endpoint }) {
  const host = endpointToHost(endpoint)
  const config = netrc()[host] || {}
  return { username: config.login, authToken: config.password }
}

function endpointToHost (endpoint) {
  return endpoint.split('/')[2]
}
