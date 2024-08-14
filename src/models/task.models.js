import { DataTypes } from "sequelize";

export const taskSchema = async (sequelize) => {
  const Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Todo", // Set default value to 'Todo'
      validate: {
        isIn: [["Todo", "In progress", "Done"]], // Ensure value is one of the allowed options
      },
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "medium", // Set default value to 'medium'
      validate: {
        isIn: [["low", "medium", "high"]], // Ensure value is one of the allowed options
      },
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  return Task;
};
