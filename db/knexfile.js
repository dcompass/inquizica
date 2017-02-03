// Update with your config settings.

module.exports = {
  test: {
    client: 'mysql',
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "learning_test"
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/test'
    }
  }
};
