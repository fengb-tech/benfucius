// Update with your config settings.

var knexfile = module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://rails:@localhost/benfucius_dev',
  },

  test: {
    client: 'postgresql',
    connection: 'postgres://rails:@localhost/benfucius_test',
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
    }
  },

}

knexfile.current = knexfile[process.env.NODE_ENV || 'development']
