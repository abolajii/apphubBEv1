import { Router } from "express";
import { TaskController } from "../controllers/task";
import {
  validateCreateTask,
  validateUpdateTask,
  validateGetTask,
  validateDeleteTask,
  validateGetTasks
} from "../validations/task";

const router = Router();

router.post("/", validateCreateTask, TaskController.add);
router.get("/:id", validateGetTask, TaskController.get);
router.get("/", validateGetTasks, TaskController.getAll);
router.put("/:id", validateUpdateTask, TaskController.update);
router.delete("/:id", validateDeleteTask, TaskController.delete);

export default router;
