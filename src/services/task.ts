import { Task } from "../models/task";
import { Application } from "../models/application";
import { Op } from "sequelize";

const TaskService = {
  add: async (data: any) => {
    try {
      const task = await Task.create({
        appId: data.appId,
        description: data.description,
        status: data.status,
        dateToFinish: new Date(data.dateToFinish),
      });

      return {
        success: true,
        message: "Task added successfully",
        data: task,
      };
    } catch (err: any) {
      console.log("[ERROR - TaskService.add]", err);
      throw err;
    }
  },

  get: async (id: string) => {
    try {
      const task = await Task.findByPk(id, {
        include: [
          {
            model: Application,
            as: "Application",
            attributes: ["name"],
            required: false,
          },
        ],
      });

      if (!task) {
        return {
          success: false,
          message: "Task not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Task retrieved successfully",
        data: task,
      };
    } catch (err: any) {
      console.log("[ERROR - TaskService.get]", err);
      throw err;
    }
  },

  getAll: async (params?: {
    appId?: string;
    status?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    try {
      const { appId, status, search, limit = 10, page = 1 } = params || {};

      // Build where conditions
      const where: any = {};

      if (appId) {
        where.appId = appId;
      }

      if (status) {
        where.status = status;
      }

      if (search) {
        where[Op.or] = [{ description: { [Op.like]: `%${search}%` } }];
      }

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await Task.count({ where });

      // Get tasks with filters and pagination
      const tasks = await Task.findAll({
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

      // Get counts by task status
      const baseWhereForCounts = { ...where };
      delete baseWhereForCounts.status; // Remove status filter for counts

      const [pendingCount, inprogressCount, doneCount] = await Promise.all([
        Task.count({ where: { ...baseWhereForCounts, status: "pending" } }),
        Task.count({ where: { ...baseWhereForCounts, status: "inprogress" } }),
        Task.count({ where: { ...baseWhereForCounts, status: "done" } }),
      ]);

      return {
        success: true,
        message: "All tasks retrieved successfully",
        data: tasks,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
        counts: {
          pending: pendingCount,
          inprogress: inprogressCount,
          done: doneCount,
          total: pendingCount + inprogressCount + doneCount,
        },
      };
    } catch (err: any) {
      console.log("[ERROR - TaskService.getAll]", err);
      throw err;
    }
  },

  update: async (id: string, data: any) => {
    try {
      return { success: true, message: "Task updated successfully" };
    } catch (err: any) {
      console.log("[ERROR - TaskService.update]", err);
      throw err;
    }
  },

  delete: async (id: string) => {
    try {
      return { success: true, message: "Task deleted successfully" };
    } catch (err: any) {
      console.log("[ERROR - TaskService.delete]", err);
      throw err;
    }
  },

  entry: async (data: any) => {
    try {
      return { success: true, message: "Welcome to Task entry!" };
    } catch (err: any) {
      console.log("[ERROR - TaskService.entry]", err);
      throw err;
    }
  },

  checkExisting: async (data: any) => {
    try {
      return { success: true, message: "Welcome to Task checkExisting!" };
    } catch (err: any) {
      console.log("[ERROR - TaskService.checkExisting]", err);
      throw err;
    }
  },

  getByAppId: async (appId: string, limit?: number) => {
    try {
      const tasks = await Task.findAll({
        where: { appId: appId },
        order: [["createdAt", "DESC"]],
        ...(limit && { limit }),
      });

      return {
        success: true,
        message: "Tasks retrieved successfully",
        data: tasks,
      };
    } catch (err: any) {
      console.log("[ERROR - TaskService.getByAppId]", err);
      throw err;
    }
  },

  countByAppId: async (appId: string) => {
    try {
      const count = await Task.count({ where: { appId: appId } });

      return {
        success: true,
        message: "Tasks count retrieved successfully",
        data: { count },
      };
    } catch (err: any) {
      console.log("[ERROR - TaskService.countByAppId]", err);
      throw err;
    }
  },
};

export { TaskService };
