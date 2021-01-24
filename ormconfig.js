const { PROD } = require("./dist/constants");
const { Role, Server } = require("./dist/entities");

module.exports = {
  type: "postgres",
  // url: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [ Role, Server ],
  synchronize: true,
  logging: !PROD
};
