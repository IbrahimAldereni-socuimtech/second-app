import Sequelize from "sequelize";

const sequelize = new Sequelize("db2", "postgres", "12345", {
  dialect: "postgres",
  host: "localhost",
});

export default sequelize;
