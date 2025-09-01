import { Router } from "express";
import userRoutes from "./user";
import applicationRoutes from "./application";
import logRoutes from "./log";
import reviewRoutes from "./review";
import taskRoutes from "./task";
import systemRoutes from "./system";

const router = Router();

router.use("/user", userRoutes);
router.use("/application", applicationRoutes);
router.use("/log", logRoutes);
router.use("/review", reviewRoutes);
router.use("/task", taskRoutes);
router.use("/system", systemRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API v1 is running",
    endpoints: ["/user", "/application", "/log", "/review", "/task", "/system"],
    timestamp: new Date().toISOString(),
  });
});

export default router;
