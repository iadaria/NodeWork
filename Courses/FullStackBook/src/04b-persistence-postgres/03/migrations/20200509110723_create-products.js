exports.up = function (knex) {
  return knex.schema.createTable('products', function (table) {
    table.text('_id').primary()
    table.text('description').notNullable()
    table.text('imgThumb').notNullable()
    table.text('img').notNullable()
    table.text('link').notNullable()
    table.text('userId').notNullable()
    table.text('userName').notNullable()
    table.text('userLink').notNullable()
    table.specificType('tags', 'TEXT[]')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('products')
}
