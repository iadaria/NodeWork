#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const netrc = require('netrc')
const Table = require('cli-table')
const prompts = require('prompts')
const ApiClient = require('./api-client')

yargs
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
    'edit product <id> [key] [value]',
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

  const creds = await prompts([
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

  try {
    const authToken = await ApiClient({ endpoint, ...creds }).login()
    saveConfig({
      username: creds.username,
      authToken
    })
    console.log(chalk.green(`Successfully logged in as ${chalk.bold(creds.username)}`))
    return true
  } catch (err) {
    const message =
      (err.response || {}).status === 401
        ? 'Incorrect username and/or password.'
        : err.message

    const { retry } = await prompts({
      name: 'retry',
      type: 'confirm',
      message: chalk.red(`${message} Retry?`)
    })

    if (retry) return login(opts)
    return false
  }
}

function logout () {
  saveConfig({})
  console.log('You are now logged out.')
}

function whoami () {
  const { username } = loadConfig()

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
  Object.keys(product).forEach(k => table.push(
    { [k]: JSON.stringify(product[k]) }
  ))

  console.log(table.toString())
}

async function editProduct (opts) {
  const { id, key, value, endpoint } = opts
  const change = { [key]: value }

  const { authToken } = loadConfig()

  if (!authToken) {
    const success = await login({ endpoint })
    return success ? editProduct(opts) : null
  }

  const api = ApiClient({ authToken, endpoint })
  await api.editProduct(id, change)

  viewProduct({ id, endpoint })
}

function saveConfig (config) {
  const allConfig = netrc()
  allConfig.printshop = config
  netrc.save(allConfig)
}

function loadConfig () {
  return netrc().printshop || {}
}
