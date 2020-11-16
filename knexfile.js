// Update with your config settings.
const { DB_URI } = process.env
const { knexSnakeCaseMappers } = require('objection')

module.exports = {
  development: {
    client: 'postgresql',
    connection: DB_URI,
    ...knexSnakeCaseMappers(),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: DB_URI,
    ...knexSnakeCaseMappers(),
    pool: {
      min: 2,
      max: 15
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  onUpdateTimestampTrigger: table => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
}
