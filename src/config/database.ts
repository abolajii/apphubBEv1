import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import { dbConfig } from "./index";

const sequelize = new Sequelize({
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  dialectModule: mysql2,
  logging: dbConfig.logging,
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  pool: dbConfig.pool,
});

// Import models after sequelize is created to avoid circular dependency
import { models } from "../models";

export { sequelize, models };
export default sequelize;
