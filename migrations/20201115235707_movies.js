exports.up = (knex, Promise) =>
  knex.schema.createTable('movies', table => {
    table.increments()
    table
      .string('name')
      .notNullable()
      .unique()
    table.string('genre').notNullable()
    table.integer('rating').notNullable()
    table.boolean('explicit').notNullable()
  })

exports.down = (knex, Promise) => knex.schema.dropTable('movies')
