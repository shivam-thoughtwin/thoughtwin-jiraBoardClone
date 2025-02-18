import { Document, Schema, model, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: "active" | "inactive";
  completed: boolean;
  priority: "low" | "medium" | "high";
  user: Types.ObjectId; // Use Types.ObjectId for proper typing.
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      unique: true,
    },
    description: {
      type: String,
      default: "No description",
    },
    dueDate: {
      type: Date,
      default: Date.now, // Note: pass the function reference.
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TaskModel = model<ITask>("Task", TaskSchema);

export default TaskModel;
