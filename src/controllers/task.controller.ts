// src/controllers/task.controller.ts

import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import TaskModel from "../models/task.model";
import { Types } from "mongoose";

export const createTask = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required!" });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description is required!" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      user: userId,
    });

    await task.save();
    res.status(201).json(task);
  }
);

export const getTasks = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "User not found!" });
    }

    const tasks = await TaskModel.find({ user: userId });
    res.status(200).json({ length: tasks.length, tasks });
  }
);

export const getTask = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    if (!(task.user as Types.ObjectId).equals(new Types.ObjectId(userId))) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    res.status(200).json(task);
  }
);

export const updateTask = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } =
      req.body;

    if (!id) {
      return res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    if (!(task.user as Types.ObjectId).equals(new Types.ObjectId(userId))) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.status(200).json(task);
  }
);

export const deleteTask = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const userId = req.user?._id;
    const { id } = req.params;

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    if (!(task.user as Types.ObjectId).equals(new Types.ObjectId(userId))) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully!" });
  }
);

export const deleteAllTasks = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "User not found!" });
    }

    await TaskModel.deleteMany({ user: userId });
    res.status(200).json({ message: "All tasks deleted successfully!" });
  }
);
