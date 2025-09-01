// Import all models to initialize them
import { User } from "./user";
import { Application } from "./application";
import { Log } from "./log";
import { Review } from "./review";
import { Task } from "./task";

// Define associations
Application.hasMany(Task, {
  foreignKey: "appId",
  sourceKey: "appId",
  as: "tasks",
});

Task.belongsTo(Application, {
  foreignKey: "appId",
  targetKey: "appId",
  as: "Application",
});

Application.hasMany(Log, {
  foreignKey: "appId",
  sourceKey: "appId",
  as: "logs",
});

Log.belongsTo(Application, {
  foreignKey: "appId",
  targetKey: "appId",
  as: "Application",
});

Application.hasMany(Review, {
  foreignKey: "appId",
  sourceKey: "appId",
  as: "reviews",
});

Review.belongsTo(Application, {
  foreignKey: "appId",
  targetKey: "appId",
  as: "Application",
});

// Export all models for easy access
export { User, Application, Log, Review, Task };

// Array of all model classes for database operations
export const models = [User, Application, Log, Review, Task];
