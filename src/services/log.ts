import { Log } from "../models/log";
import { Application } from "../models/application";
import { Op } from "sequelize";

const LogService = {
  add: async (data: any) => {
    try {
      const log = await Log.create({
        appId: data.appId,
        appName: data.appName,
        logType: data.logType,
        message: data.message,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        endpoint: data.endpoint,
        userAgent: data.userAgent,
        ip: data.ip,
        method: data.method,
        additionalData: data.additionalData || null,
      });

      return {
        success: true,
        message: "Log added successfully",
        data: log,
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.add]", err);
      throw err;
    }
  },

  get: async (id: string) => {
    try {
      const log = await Log.findByPk(id, {
        include: [
          {
            model: Application,
            as: "Application",
            attributes: ["name"],
            required: false,
          },
        ],
      });

      if (!log) {
        return {
          success: false,
          message: "Log not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Log retrieved successfully",
        data: log,
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.get]", err);
      throw err;
    }
  },

  getAll: async (params?: {
    appId?: string;
    logType?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    try {
      const { appId, logType, search, limit = 10, page = 1 } = params || {};

      // Build where conditions
      const where: any = {};

      if (appId) {
        where.appId = appId;
      }

      if (logType) {
        where.logType = logType;
      }

      if (search) {
        where[Op.or] = [
          { message: { [Op.like]: `%${search}%` } },
          { endpoint: { [Op.like]: `%${search}%` } },
          { appName: { [Op.like]: `%${search}%` } },
        ];
      }

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await Log.count({ where });

      // Get logs with filters and pagination
      const logs = await Log.findAll({
        where,
        include: [
          {
            model: Application,
            as: "Application",
            attributes: ["name"],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      // Get counts by log type
      const baseWhereForCounts = { ...where };
      delete baseWhereForCounts.logType; // Remove logType filter for counts

      const [successCount, errorCount, warningCount, infoCount] =
        await Promise.all([
          Log.count({ where: { ...baseWhereForCounts, logType: "success" } }),
          Log.count({ where: { ...baseWhereForCounts, logType: "error" } }),
          Log.count({ where: { ...baseWhereForCounts, logType: "warning" } }),
          Log.count({ where: { ...baseWhereForCounts, logType: "info" } }),
        ]);

      return {
        success: true,
        message: "All logs retrieved successfully",
        data: logs,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
        counts: {
          success: successCount,
          error: errorCount,
          warning: warningCount,
          info: infoCount,
          total: successCount + errorCount + warningCount + infoCount,
        },
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.getAll]", err);
      throw err;
    }
  },
  update: async (id: string, data: any) => {
    try {
      return { success: true, message: "Log updated successfully" };
    } catch (err: any) {
      console.log("[ERROR - LogService.update]", err);
      throw err;
    }
  },

  delete: async (id: string) => {
    try {
      return { success: true, message: "Log deleted successfully" };
    } catch (err: any) {
      console.log("[ERROR - LogService.delete]", err);
      throw err;
    }
  },

  entry: async (data: any) => {
    try {
      return { success: true, message: "Welcome to Log entry!" };
    } catch (err: any) {
      console.log("[ERROR - LogService.entry]", err);
      throw err;
    }
  },

  checkExisting: async (data: any) => {
    try {
      return { success: true, message: "Welcome to Log checkExisting!" };
    } catch (err: any) {
      console.log("[ERROR - LogService.checkExisting]", err);
      throw err;
    }
  },

  getByAppId: async (appId: string, limit?: number) => {
    try {
      const logs = await Log.findAll({
        where: { appId: appId },
        order: [["createdAt", "DESC"]],
        ...(limit && { limit }),
      });

      return {
        success: true,
        message: "Logs retrieved successfully",
        data: logs,
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.getByAppId]", err);
      throw err;
    }
  },

  countByAppId: async (appId: string) => {
    try {
      const count = await Log.count({ where: { appId: appId } });

      return {
        success: true,
        message: "Logs count retrieved successfully",
        data: { count },
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.countByAppId]", err);
      throw err;
    }
  },

  getTrends: async (params?: {
    appId?: string;
    days?: number;
    logType?: string;
  }) => {
    try {
      const { appId, days = 7, logType } = params || {};

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Build where conditions
      const whereConditions: any = {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      };

      if (appId) {
        whereConditions.appId = appId;
      }

      if (logType) {
        whereConditions.logType = logType;
      }

      // Get daily trends using raw query for better performance
      const { QueryTypes } = require("sequelize");
      const sequelize = Log.sequelize!;

      let query = `
        SELECT 
          DATE(created_at) as date,
          log_type,
          COUNT(*) as count,
          AVG(response_time) as avg_response_time,
          MAX(response_time) as max_response_time,
          MIN(response_time) as min_response_time
        FROM logs 
        WHERE created_at >= ? AND created_at <= ?
      `;

      const queryParams: any[] = [startDate, endDate];

      if (appId) {
        query += ` AND app_id = ?`;
        queryParams.push(appId);
      }

      if (logType) {
        query += ` AND log_type = ?`;
        queryParams.push(logType);
      }

      query += ` GROUP BY DATE(created_at), log_type ORDER BY date ASC, log_type`;

      const dailyTrends = await sequelize.query(query, {
        replacements: queryParams,
        type: QueryTypes.SELECT,
      });

      // Get overall statistics for the period
      const totalLogs = await Log.count({ where: whereConditions });

      // Get log type distribution
      const logTypeDistribution = await Log.findAll({
        attributes: [
          "log_type",
          [sequelize.fn("COUNT", sequelize.col("log_type")), "count"],
          [
            sequelize.fn("AVG", sequelize.col("response_time")),
            "avgResponseTime",
          ],
        ],
        where: whereConditions,
        group: ["log_type"],
        raw: true,
      });

      // Get hourly distribution for last 24 hours if days <= 1
      let hourlyTrends = null;
      if (days <= 1) {
        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        const hourlyQuery = `
          SELECT 
            HOUR(created_at) as hour,
            log_type,
            COUNT(*) as count
          FROM logs 
          WHERE created_at >= ? AND created_at <= ?
          ${appId ? "AND app_id = ?" : ""}
          ${logType ? "AND log_type = ?" : ""}
          GROUP BY HOUR(created_at), log_type 
          ORDER BY hour ASC, log_type
        `;

        const hourlyParams: any[] = [last24Hours, endDate];
        if (appId) hourlyParams.push(appId);
        if (logType) hourlyParams.push(logType);

        hourlyTrends = await sequelize.query(hourlyQuery, {
          replacements: hourlyParams,
          type: QueryTypes.SELECT,
        });
      }

      // Get error rate trend
      const errorQuery = `
        SELECT 
          DATE(created_at) as date,
          SUM(CASE WHEN log_type = 'error' THEN 1 ELSE 0 END) as error_count,
          COUNT(*) as total_count,
          (SUM(CASE WHEN log_type = 'error' THEN 1 ELSE 0 END) / COUNT(*) * 100) as error_rate
        FROM logs 
        WHERE created_at >= ? AND created_at <= ?
        ${appId ? "AND app_id = ?" : ""}
        GROUP BY DATE(created_at) 
        ORDER BY date ASC
      `;

      const errorParams: any[] = [startDate, endDate];
      if (appId) errorParams.push(appId);

      const errorRateTrend = await sequelize.query(errorQuery, {
        replacements: errorParams,
        type: QueryTypes.SELECT,
      });

      // Calculate trend summary
      const summary = {
        totalLogs,
        dateRange: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          days,
        },
        logTypeDistribution: logTypeDistribution.reduce(
          (acc: any, item: any) => {
            acc[item.log_type] = {
              count: parseInt(item.count),
              avgResponseTime: parseFloat(item.avgResponseTime) || 0,
            };
            return acc;
          },
          {}
        ),
        averageLogsPerDay: Math.round(totalLogs / days),
      };

      return {
        success: true,
        message: "Log trends retrieved successfully",
        data: {
          summary,
          dailyTrends,
          errorRateTrend,
          ...(hourlyTrends && { hourlyTrends }),
        },
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.getTrends]", err);
      throw err;
    }
  },

  getAnalytics: async (params?: { appId?: string; days?: number }) => {
    try {
      const { appId, days = 7 } = params || {};

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Build where conditions
      const whereConditions: any = {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      };

      if (appId) {
        whereConditions.appId = appId;
      }

      const sequelize = Log.sequelize!;
      const { QueryTypes } = require("sequelize");

      // Get total logs count
      const totalLogs = await Log.count({ where: whereConditions });

      // Get log types distribution
      const logTypeDistribution = await Log.findAll({
        attributes: [
          "log_type",
          [sequelize.fn("COUNT", sequelize.col("log_type")), "count"],
        ],
        where: whereConditions,
        group: ["log_type"],
        raw: true,
      });

      // Process log types into required format
      const logTypes = {
        success: 0,
        error: 0,
        info: 0,
        warning: 0,
      };

      (logTypeDistribution as any[]).forEach((item: any) => {
        logTypes[item.log_type as keyof typeof logTypes] = parseInt(item.count);
      });

      // Calculate error rate
      const errorCount = logTypes.error;
      const errorRate =
        totalLogs > 0
          ? ((errorCount / totalLogs) * 100).toFixed(2) + "%"
          : "0.00%";

      // Get top applications
      const topApplications = await Log.findAll({
        attributes: [
          "app_id",
          "app_name",
          [sequelize.fn("COUNT", sequelize.col("app_id")), "count"],
        ],
        where: whereConditions,
        group: ["app_id", "app_name"],
        order: [[sequelize.fn("COUNT", sequelize.col("app_id")), "DESC"]],
        limit: 5,
        raw: true,
      });

      // Format top applications
      const formattedTopApps = (topApplications as any[]).map((app: any) => ({
        appId: parseInt(app.app_id),
        count: parseInt(app.count),
        appName: app.app_name,
      }));

      // Get daily breakdown
      const dailyBreakdown = await sequelize.query(
        `
        SELECT 
          DATE(created_at) as date,
          log_type,
          COUNT(*) as count
        FROM logs 
        WHERE created_at >= ? AND created_at <= ?
        ${appId ? "AND app_id = ?" : ""}
        GROUP BY DATE(created_at), log_type 
        ORDER BY date ASC
      `,
        {
          replacements: appId
            ? [startDate, endDate, appId]
            : [startDate, endDate],
          type: QueryTypes.SELECT,
        }
      );

      // Process daily breakdown into required format
      const dailyData: any = {};
      (dailyBreakdown as any[]).forEach((item: any) => {
        const date = item.date;
        if (!dailyData[date]) {
          dailyData[date] = {
            success: 0,
            error: 0,
            info: 0,
            warning: 0,
          };
        }
        dailyData[date][item.log_type] = parseInt(item.count);
      });

      return {
        success: true,
        message: "Analytics fetched successfully",
        data: {
          period: `Last ${days} days`,
          totalLogs,
          logTypes,
          errorRate,
          topApplications: formattedTopApps,
          dailyBreakdown: dailyData,
          dateRange: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        },
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.getAnalytics]", err);
      throw err;
    }
  },

  // Delete single log by ID
  deleteById: async (logId: string) => {
    try {
      const log = await Log.findByPk(logId);

      if (!log) {
        return {
          success: false,
          message: "Log not found",
        };
      }

      await log.destroy();

      return {
        success: true,
        message: "Log deleted successfully",
        data: { deletedId: logId },
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.deleteById]", err);
      throw err;
    }
  },

  // Delete multiple logs by IDs
  deleteBulk: async (logIds: string[]) => {
    try {
      if (!logIds || logIds.length === 0) {
        return {
          success: false,
          message: "No log IDs provided",
        };
      }

      const deletedCount = await Log.destroy({
        where: {
          id: {
            [Op.in]: logIds,
          },
        },
      });

      return {
        success: true,
        message: `${deletedCount} logs deleted successfully`,
        data: {
          deletedCount,
          deletedIds: logIds,
        },
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.deleteBulk]", err);
      throw err;
    }
  },

  // Delete all logs
  deleteAll: async (appId?: string) => {
    try {
      const whereConditions: any = {};

      if (appId) {
        whereConditions.appId = appId;
      }

      const deletedCount = await Log.destroy({
        where: whereConditions,
      });

      const message = appId
        ? `All logs for application ${appId} deleted successfully`
        : "All logs deleted successfully";

      return {
        success: true,
        message,
        data: { deletedCount },
      };
    } catch (err: any) {
      console.log("[ERROR - LogService.deleteAll]", err);
      throw err;
    }
  },
};

export { LogService };
