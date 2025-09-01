import { Router } from "express";
import { LogController } from "../controllers/log";
import {
  validateCreateLog,
  validateUpdateLog,
  validateGetLog,
  validateDeleteLog,
  validateGetLogs,
  validateGetTrends,
  validateGetAnalytics,
  validateDeleteBulk,
  validateDeleteAll,
} from "../validations/log";

const router = Router();

router.post("/", validateCreateLog, LogController.add);
router.get("/trends", validateGetTrends, LogController.getTrends);
router.get("/analytics", validateGetAnalytics, LogController.getAnalytics);
router.delete("/bulk", validateDeleteBulk, LogController.deleteBulk);
router.delete("/all", validateDeleteAll, LogController.deleteAllLogs);
router.delete("/:id", validateDeleteLog, LogController.deleteById);
router.get("/:id", validateGetLog, LogController.get);
router.get("/", validateGetLogs, LogController.getAll);
router.put("/:id", validateUpdateLog, LogController.update);

export default router;
