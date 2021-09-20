const { Role, AdminRole, Server } = require("./dist/entities");

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // database: process.env.DB_NAME,
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  entities: [ Role, AdminRole, Server ],
  synchronize: true,
  logging: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};
