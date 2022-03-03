"use strict";

require("./env/dotenv.js");

module.exports = {
  test: {
    database: "api_challenge",
    username: process.env.DATABASE_USERNAME || "postgres",
    password: "1234",
    host: "localhost",
    dialect: "postgres",
    port: 5432,
  },
};
