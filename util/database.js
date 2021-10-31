import Sequelize from "sequelize";

// postgress database
// const sequelize = new Sequelize("db2", "postgres", "12345", {
//   dialect: "postgres",
//   host: "localhost",
// });

const sequelize = new Sequelize("testDB", "user", "pass", {
  dialect: "sqlite",
  host: "./util/testDB.sqlite",
});

export default sequelize;
