import { Router } from "express";
import { UserController } from "../controllers/user";
import {
  validateCreateUser,
  validateUpdateUser,
  validateGetUser,
  validateDeleteUser,
  validateGetUsers
} from "../validations/user";

const router = Router();

router.post("/", validateCreateUser, UserController.add);
router.get("/:id", validateGetUser, UserController.get);
router.get("/", validateGetUsers, UserController.getAll);
router.put("/:id", validateUpdateUser, UserController.update);
router.delete("/:id", validateDeleteUser, UserController.delete);

// Additional endpoints for user-specific functionality
router.post("/entry", UserController.entry);

export default router;
