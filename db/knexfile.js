// Update with your config settings.

module.exports = {
  test: {
    client: 'mysql',
    connection: {
      host: "localhost",
      user: "tester",
      password: "pass123",
      database: "testingDB"
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/test'
    }
  }
};
