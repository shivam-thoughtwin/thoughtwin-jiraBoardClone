import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Apply the protect middleware to all task routes
router.post("/create", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.delete("/", protect, deleteAllTasks);

export default router;
