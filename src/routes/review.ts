import { Router } from "express";
import { ReviewController } from "../controllers/review";
import {
  validateCreateReview,
  validateUpdateReview,
  validateGetReview,
  validateDeleteReview,
  validateGetReviews
} from "../validations/review";

const router = Router();

router.post("/", validateCreateReview, ReviewController.add);
router.get("/:id", validateGetReview, ReviewController.get);
router.get("/", validateGetReviews, ReviewController.getAll);
router.put("/:id", validateUpdateReview, ReviewController.update);
router.delete("/:id", validateDeleteReview, ReviewController.delete);

export default router;
