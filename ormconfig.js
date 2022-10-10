const { Role, AdminRole, Server } = require("./dist/entities");

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [ Role, AdminRole, Server ],
  synchronize: false,
  logging: true,
  ssl: process.env.ENABLE_SSL === 'true' ? true : false,
};
