import { Router } from "express";
import { ApplicationController } from "../controllers/application";
import { upload } from "../middleware/upload";
import {
  validateCreateApplication,
  validateUpdateApplication,
  validateGetApplication,
  validateDeleteApplication,
  validateGetApplications,
  validateUpdateStatus,
} from "../validations/application";

const router = Router();

router.post(
  "/",
  upload.fields([
    { name: "smallImages", maxCount: 10 },
    { name: "largeImages", maxCount: 10 },
  ]),
  validateCreateApplication,
  ApplicationController.add
);
router.get("/:appId", validateGetApplication, ApplicationController.get);
router.get("/", validateGetApplications, ApplicationController.getAll);
router.put(
  "/:appId",
  upload.fields([
    { name: "newSmallImages", maxCount: 10 },
    { name: "newLargeImages", maxCount: 10 },
  ]),
  validateUpdateApplication,
  ApplicationController.update
);
router.delete(
  "/:appId",
  validateDeleteApplication,
  ApplicationController.delete
);

// Additional endpoints for application-specific functionality
router.post("/generateAppId", ApplicationController.generateAppId);
router.patch(
  "/:appId/status",
  validateUpdateStatus,
  ApplicationController.updateStatus
);
router.post("/:appId/sample-data", ApplicationController.createSampleData);
router.post("/health-update", ApplicationController.healthUpdate);
router.post(
  "/upload-image",
  upload.single("image"),
  ApplicationController.uploadImage
);

export default router;
