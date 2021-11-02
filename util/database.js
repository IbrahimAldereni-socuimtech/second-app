import Sequelize from "sequelize";

import dotenv from "dotenv";
dotenv.config();

// check package json (when run npm test  change the dilact and the host to sqlite)
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

console.log(
  "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
  process.env.DB_HOST,
  process.env.DB_DIALECT
);

export default sequelize;
