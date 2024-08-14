import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TaskModel } from "../db/index.js";
import { Sequelize, where } from "sequelize";
import Op from "sequelize";

//create a task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;

  if (!title || !due_date) {
    throw new ApiError(400, "Tittle and due Date are required");
  }

  const task = await TaskModel.create({
    title,
    description,
    status,
    priority,
    due_date,
  });

  if (!task) {
    throw new ApiError(501, "Something went wrong while creating the Task");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

//Get all tasks

const getTask = asyncHandler(async (req, res) => {
  const task = await TaskModel.findAll();

  if (!task) {
    throw new ApiError(500, "Failed to fetch Task details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task,
      "Tasks fetched sucessfully"));
});

//get a task by ID

const getTaskById = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    throw new ApiError(401, "Task Id is not valid");
  }

  const task = await TaskModel.findByPk(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Retrieved Successfully"));
});

//update a task by Id

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    throw new ApiError(400, "Task ID is compulsory for update the task");
  }

  const { title, description, status, priority, due_date } = req.body;

  const task = await TaskModel.findByPk(taskId);

  if (!task) {
    throw new ApiError(404, "Task Not found");
  }

  const update = await task.update({
    title,
    description,
    status,
    priority,
    due_date,
  });

  if (!update) {
    throw new ApiError(500, "Error while updating the server");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, update, "Task is updated successfully"));
});

//Delete a task By id

const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const task = await TaskModel.findByPk(taskId);
  if (!task) {
    throw new ApiError(404, "Task Not Found");
  }

  await task.destroy();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted Successfully"));
});

export { createTask, getTask, getTaskById, updateTask, deleteTask};
