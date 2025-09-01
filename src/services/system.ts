import { Application } from "../models/application";
import { Log } from "../models/log";
import { Task } from "../models/task";
import { Review } from "../models/review";

const SystemService = {
  // Delete all records from specified model(s) or all models
  deleteAll: async (model?: string) => {
    const results: any = {};

    try {
      // If no model specified, delete everything
      if (!model || model === "all") {
        // Delete all data from all models
        const applicationResult = await Application.destroy({ where: {} });
        const logResult = await Log.destroy({ where: {} });
        const taskResult = await Task.destroy({ where: {} });
        const reviewResult = await Review.destroy({ where: {} });

        results.applications = applicationResult;
        results.logs = logResult;
        results.tasks = taskResult;
        results.reviews = reviewResult;
        results.totalDeleted =
          applicationResult + logResult + taskResult + reviewResult;

        return {
          message: "All data has been permanently deleted",
          data: results,
        };
      }

      // Delete specific model
      let deletedCount = 0;
      let modelName = "";

      switch (model.toLowerCase()) {
        case "applications":
        case "application":
          deletedCount = await Application.destroy({ where: {} });
          modelName = "applications";
          break;

        case "logs":
        case "log":
          deletedCount = await Log.destroy({ where: {} });
          modelName = "logs";
          break;

        case "tasks":
        case "task":
          deletedCount = await Task.destroy({ where: {} });
          modelName = "tasks";
          break;

        case "reviews":
        case "review":
          deletedCount = await Review.destroy({ where: {} });
          modelName = "reviews";
          break;

        default:
          throw new Error("Invalid model specified");
      }

      results[modelName] = deletedCount;

      return {
        message: `All ${modelName} have been permanently deleted`,
        data: results,
      };
    } catch (err: any) {
      console.log("[ERROR - SystemService.deleteAll]", err);
      throw err;
    }
  },

  // Get counts of all models
  getCounts: async () => {
    try {
      const counts = {
        applications: await Application.count(),
        logs: await Log.count(),
        tasks: await Task.count(),
        reviews: await Review.count(),
      };

      const total =
        counts.applications + counts.logs + counts.tasks + counts.reviews;

      return { ...counts, total };
    } catch (err: any) {
      console.log("[ERROR - SystemService.getCounts]", err);
      throw err;
    }
  },

  // Reset entire system (delete all + reset sequences)
  resetSystem: async () => {
    try {
      // Get counts before deletion
      const beforeCounts = {
        applications: await Application.count(),
        logs: await Log.count(),
        tasks: await Task.count(),
        reviews: await Review.count(),
      };

      // Delete all data
      const results = await Promise.all([
        Application.destroy({ where: {} }),
        Log.destroy({ where: {} }),
        Task.destroy({ where: {} }),
        Review.destroy({ where: {} }),
      ]);

      const afterCounts = {
        applications: results[0],
        logs: results[1],
        tasks: results[2],
        reviews: results[3],
        totalDeleted: results.reduce((sum, result) => sum + result, 0),
      };

      return {
        message: "System has been completely reset",
        data: {
          beforeReset: beforeCounts,
          afterReset: afterCounts,
          resetTimestamp: new Date().toISOString(),
        },
      };
    } catch (err: any) {
      console.log("[ERROR - SystemService.resetSystem]", err);
      throw err;
    }
  },

  // Get system health and status
  getSystemHealth: async () => {
    try {
      // Check database connectivity by attempting a simple query
      await Application.findOne({ limit: 1 });

      // Get basic counts
      const counts = await SystemService.getCounts();

      // Check for any overdue tasks
      const overdueTasks = await Task.count({
        where: {
          dateToFinish: { [require("sequelize").Op.lt]: new Date() },
          status: { [require("sequelize").Op.ne]: "done" },
        },
      });

      // Check for applications with issues (stopped status)
      const stoppedApps = await Application.count({
        where: { status: "stopped" },
      });

      return {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        metrics: {
          ...counts,
          overdueTasks,
          stoppedApps,
        },
      };
    } catch (error: any) {
      console.log("[ERROR - SystemService.getSystemHealth]", error);
      return {
        status: "unhealthy",
        database: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  },

  // Get system statistics
  getSystemStats: async () => {
    try {
      const counts = await SystemService.getCounts();

      // Get recent activity (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const { Op } = require("sequelize");

      const recentLogs = await Log.count({
        where: { createdAt: { [Op.gte]: yesterday } },
      });

      const recentTasks = await Task.count({
        where: { createdAt: { [Op.gte]: yesterday } },
      });

      const recentReviews = await Review.count({
        where: { createdAt: { [Op.gte]: yesterday } },
      });

      // Get applications by status using raw query for grouping
      const statusQuery = await Application.findAll({
        attributes: [
          "status",
          [
            require("sequelize").fn(
              "COUNT",
              require("sequelize").col("status")
            ),
            "count",
          ],
        ],
        group: ["status"],
        raw: true,
      });

      const statusDistribution = statusQuery.reduce((acc: any, item: any) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {});

      return {
        overview: counts,
        recentActivity: {
          logs: recentLogs,
          tasks: recentTasks,
          reviews: recentReviews,
        },
        applications: {
          total: counts.applications,
          statusDistribution,
        },
        systemInfo: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        },
      };
    } catch (err: any) {
      console.log("[ERROR - SystemService.getSystemStats]", err);
      throw err;
    }
  },

  // Export system data (for backup purposes)
  exportData: async (models?: string[]) => {
    try {
      const exportData: any = {};
      const allModels = models || ["applications", "logs", "tasks", "reviews"];

      for (const model of allModels) {
        switch (model.toLowerCase()) {
          case "applications":
            exportData.applications = await Application.findAll({ raw: true });
            break;
          case "logs":
            exportData.logs = await Log.findAll({ raw: true });
            break;
          case "tasks":
            exportData.tasks = await Task.findAll({ raw: true });
            break;
          case "reviews":
            exportData.reviews = await Review.findAll({ raw: true });
            break;
        }
      }

      return {
        exportTimestamp: new Date().toISOString(),
        models: allModels,
        data: exportData,
      };
    } catch (err: any) {
      console.log("[ERROR - SystemService.exportData]", err);
      throw err;
    }
  },

  entry: async (data: any) => {
    try {
      return { success: true, message: "Welcome to System entry!" };
    } catch (err: any) {
      console.log("[ERROR - SystemService.entry]", err);
      throw err;
    }
  },
};

export { SystemService };
