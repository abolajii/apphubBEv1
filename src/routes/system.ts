import { Router } from "express";
import SystemController from "../controllers/system";
import SystemValidation from "../validations/system";

const router = Router();

// System management routes
router.delete(
  "/delete-all",
  ...SystemValidation.deleteAll,
  SystemController.deleteAll
);

router.get("/counts", SystemController.getCounts);

router.post(
  "/reset",
  ...SystemValidation.resetSystem,
  SystemController.resetSystem
);

// System monitoring routes
router.get("/health", SystemController.getSystemHealth);

router.get("/stats", SystemController.getSystemStats);

// Data export route
router.get(
  "/export",
  ...SystemValidation.exportData,
  SystemController.exportData
);

export default router;
