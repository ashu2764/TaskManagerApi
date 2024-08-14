import { Sequelize } from "sequelize";
import { userSchema } from "../models/user.models.js";
import { taskSchema } from "../models/task.models.js";

const sequelize = new Sequelize(
  "postgres",
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

let UserModel = null;
let TaskModel = null;
const connectionInstance = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    UserModel = await userSchema(sequelize);
    TaskModel = await taskSchema(sequelize);
    await sequelize.sync();

    console.log(`database sync `);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connectionInstance, UserModel, TaskModel };
