import { query, body } from "express-validator";

const SystemValidation = {
  deleteAll: [
    query("model")
      .optional()
      .isIn([
        "all",
        "applications",
        "application",
        "logs",
        "log",
        "tasks",
        "task",
        "reviews",
        "review",
      ])
      .withMessage(
        "Model must be one of: all, applications, logs, tasks, reviews"
      ),
  ],

  resetSystem: [
    // No specific validation needed for reset - it's a dangerous operation that should be protected by auth
  ],

  exportData: [
    query("models")
      .optional()
      .isString()
      .withMessage("Models must be a comma-separated string")
      .custom((value) => {
        if (value) {
          const validModels = ["applications", "logs", "tasks", "reviews"];
          const requestedModels = value.split(",").map((m: string) => m.trim());
          const invalidModels = requestedModels.filter(
            (m: string) => !validModels.includes(m)
          );

          if (invalidModels.length > 0) {
            throw new Error(
              `Invalid models: ${invalidModels.join(
                ", "
              )}. Valid models are: ${validModels.join(", ")}`
            );
          }
        }
        return true;
      }),
  ],
};

export default SystemValidation;
