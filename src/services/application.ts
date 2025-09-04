import { uploadImage } from "../integration/imagekit";
import { Application } from "../models/application";
import { ApplicationImages } from "../models/application";
import { LogService } from "./log";
import { TaskService } from "./task";
import { ReviewService } from "./review";
import { Op } from "sequelize";

// Helper function to parse images JSON
const parseApplicationImages = (application: any) => {
  const appData = application.toJSON();

  // Parse images if it's a string
  if (typeof appData.images === "string") {
    try {
      appData.images = JSON.parse(appData.images);
    } catch {
      appData.images = { small: [], large: [] };
    }
  }

  // Ensure proper structure
  if (!appData.images || typeof appData.images !== "object") {
    appData.images = { small: [], large: [] };
  }
  if (!appData.images.small) appData.images.small = [];
  if (!appData.images.large) appData.images.large = [];

  return appData;
};

const ApplicationService = {
  add: async (data: any) => {
    try {
      console.log("[DEBUG] ApplicationService.add - Input data:", {
        providedAppId: data.appId,
        dataType: typeof data.appId,
      });

      // Auto-generate appId if not provided
      let appId = data.appId;
      if (!appId) {
        const generateResult = await ApplicationService.generateAppId();
        if (!generateResult.success) {
          throw new Error("Failed to generate appId");
        }
        appId = generateResult.data.appId;
        console.log("[DEBUG] Generated new appId:", appId);
      } else {
        console.log("[DEBUG] Using provided appId:", appId);
      }

      // Set default values for optional fields
      const applicationData = {
        bg: data.bg || "#3B82F6",
        description: data.description || "",
        name: data.name, // Required field
        link: data.link || "",
        stacks: data.stacks || "",
        onGoing: data.onGoing !== undefined ? data.onGoing : true,
        appId: appId,
        status: data.status || "running",
        uptime: data.uptime || 0,
        downtime: data.downtime || 0,
        lastChecked: data.lastChecked || new Date(),
        githubUrl: data.githubUrl || "",
        frontendUrl: data.frontendUrl || "",
        backendUrl: data.backendUrl || "",
        images: data.images || { small: [], large: [] },
      };

      // Handle image uploads if provided
      const uploadedImages: { small: string[]; large: string[] } = {
        small: [],
        large: [],
      };

      // Process small images
      if (data.smallImages && Array.isArray(data.smallImages)) {
        for (const imageFile of data.smallImages) {
          if (imageFile && (imageFile.name || imageFile.originalname)) {
            try {
              const uploadResult = await ApplicationService.uploadAndSaveImage({
                file: imageFile.buffer || imageFile, // Handle both file buffer and file object
                fileName: imageFile.originalname || imageFile.name,
                applicationId: null, // Will be set after creation
                imageType: "small",
              });

              if (uploadResult.success) {
                uploadedImages.small.push(uploadResult.data.url);
              }
            } catch (error) {
              console.log(
                `[WARNING] Failed to upload small image ${
                  imageFile.originalname || imageFile.name
                }:`,
                error
              );
            }
          }
        }
      }

      // Process large images
      if (data.largeImages && Array.isArray(data.largeImages)) {
        for (const imageFile of data.largeImages) {
          if (imageFile && (imageFile.name || imageFile.originalname)) {
            try {
              const uploadResult = await ApplicationService.uploadAndSaveImage({
                file: imageFile.buffer || imageFile, // Handle both file buffer and file object
                fileName: imageFile.originalname || imageFile.name,
                applicationId: null, // Will be set after creation
                imageType: "large",
              });

              if (uploadResult.success) {
                uploadedImages.large.push(uploadResult.data.url);
              }
            } catch (error) {
              console.log(
                `[WARNING] Failed to upload large image ${
                  imageFile.originalname || imageFile.name
                }:`,
                error
              );
            }
          }
        }
      }

      // Combine uploaded images with any existing images data
      const existingSmallImages = Array.isArray(data.images?.small)
        ? data.images.small
        : [];
      const existingLargeImages = Array.isArray(data.images?.large)
        ? data.images.large
        : [];

      const finalImages = {
        small: [...existingSmallImages, ...uploadedImages.small],
        large: [...existingLargeImages, ...uploadedImages.large],
      };

      // Update applicationData with final images
      applicationData.images = finalImages;

      // Handle stacks format
      if (Array.isArray(applicationData.stacks)) {
        applicationData.stacks = applicationData.stacks.join(", ");
      }

      // Create application
      const application = await Application.create(applicationData);

      console.log(`[INFO] Created application ${appId} with:`, {
        smallImagesUploaded: uploadedImages.small.length,
        largeImagesUploaded: uploadedImages.large.length,
        totalImages: finalImages.small.length + finalImages.large.length,
      });

      return {
        success: true,
        message: "Application created successfully",
        data: parseApplicationImages(application),
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.add]", err);
      throw err;
    }
  },

  get: async (appId: string) => {
    try {
      const application = await Application.findOne({
        where: { appId: appId },
      });

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      // Fetch latest 5 logs, tasks, and reviews using services
      const [logsResult, tasksResult, reviewsResult] = await Promise.all([
        LogService.getByAppId(appId, 5),
        TaskService.getByAppId(appId, 5),
        ReviewService.getByAppId(appId, 5),
      ]);

      // Get total counts using services
      const [logsCountResult, tasksCountResult, reviewsCountResult] =
        await Promise.all([
          LogService.countByAppId(appId),
          TaskService.countByAppId(appId),
          ReviewService.countByAppId(appId),
        ]);

      // Extract data from service results
      const logs = logsResult.success ? logsResult.data : [];
      const tasks = tasksResult.success ? tasksResult.data : [];
      const reviews = reviewsResult.success ? reviewsResult.data : [];

      const logsCount = logsCountResult.success
        ? logsCountResult.data.count
        : 0;
      const tasksCount = tasksCountResult.success
        ? tasksCountResult.data.count
        : 0;
      const reviewsCount = reviewsCountResult.success
        ? reviewsCountResult.data.count
        : 0;

      // Parse application images and prepare response data
      const applicationData = parseApplicationImages(application);

      console.log(`[INFO] Retrieved application ${appId} with:`, {
        logsCount,
        tasksCount,
        reviewsCount,
        recentLogs: logs.length,
        recentTasks: tasks.length,
        recentReviews: reviews.length,
      });

      return {
        success: true,
        message: "Application retrieved successfully",
        data: {
          ...applicationData,
          logs: {
            items: logs,
            total: logsCount,
          },
          tasks: {
            items: tasks,
            total: tasksCount,
          },
          reviews: {
            items: reviews,
            total: reviewsCount,
          },
        },
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.get]", err);
      throw err;
    }
  },

  getAll: async () => {
    try {
      const applications = await Application.findAll({
        order: [["createdAt", "DESC"]],
      });

      return {
        success: true,
        message: "All applications retrieved successfully",
        data: applications.map((app) => parseApplicationImages(app)),
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.getAll]", err);
      throw err;
    }
  },

  update: async (appId: string, data: any) => {
    try {
      // Debug logging
      console.log("[DEBUG - ApplicationService.update] Received data:", {
        appId,
        dataType: typeof data,
        dataKeys: data ? Object.keys(data) : "data is null/undefined",
        data: data,
      });

      if (!data) {
        return {
          success: false,
          message: "No data provided for update",
        };
      }

      const application = await Application.findOne({
        where: { appId: appId },
      });

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      // Prepare update data - handle all updatable fields
      const updateData: any = {};
      
      // Basic info fields
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.bg !== undefined) updateData.bg = data.bg;
      if (data.link !== undefined) updateData.link = data.link;
      
      // Stack handling - convert array to string if needed
      if (data.stacks !== undefined) {
        updateData.stacks = Array.isArray(data.stacks)
          ? data.stacks.join(", ")
          : data.stacks;
      }
      
      // Boolean and status fields
      if (data.onGoing !== undefined) updateData.onGoing = data.onGoing;
      if (data.status !== undefined) updateData.status = data.status;
      
      // Numeric fields
      if (data.uptime !== undefined) updateData.uptime = data.uptime;
      if (data.downtime !== undefined) updateData.downtime = data.downtime;
      
      // Date fields
      if (data.lastChecked !== undefined) {
        updateData.lastChecked = new Date(data.lastChecked);
      }
      
      // URL fields - all three URL types
      if (data.link !== undefined) updateData.link = data.link; // This might be legacy, keeping for compatibility
      if (data.frontendUrl !== undefined) updateData.frontendUrl = data.frontendUrl;
      if (data.backendUrl !== undefined) updateData.backendUrl = data.backendUrl;
      if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
      
      // Image data
      if (data.images !== undefined) {
        updateData.images = data.images;
      }
      
      // Note: appId is intentionally excluded from updates to maintain unique identifier integrity

      await application.update(updateData);

      return {
        success: true,
        message: "Application updated successfully",
        data: parseApplicationImages(application),
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.update]", err);
      throw err;
    }
  },

  delete: async (appId: string) => {
    try {
      const application = await Application.findOne({
        where: { appId: appId },
      });

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      await application.destroy();

      return {
        success: true,
        message: "Application deleted successfully",
        data: parseApplicationImages(application),
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.delete]", err);
      throw err;
    }
  },

  entry: async (data: any) => {
    try {
      return { success: true, message: "Welcome to Application entry!" };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.entry]", err);
      throw err;
    }
  },

  checkExisting: async (data: any) => {
    try {
      const { name, id } = data;

      // Build where conditions for name and id
      const whereConditions = [];
      if (name) {
        whereConditions.push({ name: name });
      }
      if (id) {
        whereConditions.push({ id: id });
      }

      if (whereConditions.length === 0) {
        return {
          success: false,
          message: "Either name or id must be provided for checking",
          exists: false,
        };
      }

      // Check for existing application by name or id
      const existingApplication = await Application.findOne({
        where: {
          [Op.or]: whereConditions,
        },
      });

      if (existingApplication) {
        const field = existingApplication.name === name ? "name" : "id";
        return {
          success: false,
          message: `Application with this ${field} already exists`,
          exists: true,
          field: field,
        };
      }

      return {
        success: true,
        message: "Application does not exist, can proceed with creation",
        exists: false,
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.checkExisting]", err);
      throw err;
    }
  },

  generateAppId: async () => {
    try {
      // Generate a unique appId with 6 alphanumeric characters
      let appId;
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!isUnique && attempts < maxAttempts) {
        // Generate random 6-character alphanumeric string (letters and numbers)
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        appId = "";
        for (let i = 0; i < 6; i++) {
          appId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Check if this appId already exists
        const existingApp = await Application.findOne({
          where: { appId: appId },
        });

        if (!existingApp) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        throw new Error(
          "Unable to generate unique appId after maximum attempts"
        );
      }

      return {
        success: true,
        message: "AppId generated successfully",
        data: { appId },
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.generateAppId]", err);
      throw err;
    }
  },

  uploadAndSaveImage: async (data: any) => {
    try {
      const { file, fileName, applicationId, imageType = "large" } = data;

      if (!file || !fileName) {
        return {
          success: false,
          message: "File and fileName are required",
        };
      }

      const uploadResult = await uploadImage(file, fileName);

      if (!uploadResult.success) {
        return {
          success: false,
          message: "Image upload failed",
          error: uploadResult.error,
        };
      }

      // If applicationId is provided, update the application's images
      if (applicationId) {
        const application = await Application.findByPk(applicationId);
        if (application) {
          // Parse the images if it's a string (for compatibility)
          let currentImages = application.images;
          if (typeof currentImages === "string") {
            try {
              currentImages = JSON.parse(currentImages);
            } catch {
              currentImages = { small: [], large: [] };
            }
          }

          // Ensure the structure exists
          if (!currentImages || typeof currentImages !== "object") {
            currentImages = { small: [], large: [] };
          }
          if (!currentImages.small) currentImages.small = [];
          if (!currentImages.large) currentImages.large = [];

          // Add the new image URL to the appropriate array
          if (imageType === "small") {
            currentImages.small.push(uploadResult.data.url);
          } else {
            currentImages.large.push(uploadResult.data.url);
          }

          await application.update({ images: currentImages });
        }
      }

      return {
        success: true,
        message: "Image uploaded and saved successfully",
        data: uploadResult.data,
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.uploadAndSaveImage]", err);
      throw err;
    }
  },

  createSampleData: async (appId: string) => {
    try {
      // Import models directly for sample data creation
      const { Log } = await import("../models/log");
      const { Task } = await import("../models/task");
      const { Review } = await import("../models/review");

      const application = await Application.findOne({
        where: { appId: appId },
      });

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      // Sample Logs Data
      const sampleLogs = [
        {
          appId: appId,
          appName: application.name,
          logType: "success" as const,
          message: "User authentication successful",
          statusCode: 200,
          responseTime: 145,
          endpoint: "/api/auth/login",
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          ip: "192.168.1.100",
          method: "POST" as const,
        },
        {
          appId: appId,
          appName: application.name,
          logType: "error" as const,
          message: "Database connection failed",
          statusCode: 500,
          responseTime: 5000,
          endpoint: "/api/users",
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          ip: "192.168.1.101",
          method: "GET" as const,
        },
        {
          appId: appId,
          appName: application.name,
          logType: "info" as const,
          message: "New user registered successfully",
          statusCode: 201,
          responseTime: 230,
          endpoint: "/api/users/register",
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
          ip: "192.168.1.102",
          method: "POST" as const,
        },
      ];

      // Sample Tasks Data
      const sampleTasks = [
        {
          appId: appId,
          description: "Update API documentation for authentication endpoints",
          status: "pending" as const,
          dateToFinish: new Date("2025-09-15"),
        },
        {
          appId: appId,
          description: "Fix database connection timeout issues",
          status: "inprogress" as const,
          dateToFinish: new Date("2025-09-10"),
        },
        {
          appId: appId,
          description: "Implement user profile image upload feature",
          status: "done" as const,
          dateToFinish: new Date("2025-08-25"),
        },
      ];

      // Sample Reviews Data
      const sampleReviews = [
        {
          appId: appId,
          rating: 5,
          comment:
            "Excellent application! Very user-friendly and fast performance.",
          reviewer: "John Doe",
          date: new Date("2025-08-30"),
        },
        {
          appId: appId,
          rating: 4,
          comment: "Great app overall, but could use some UI improvements.",
          reviewer: "Jane Smith",
          date: new Date("2025-08-28"),
        },
        {
          appId: appId,
          rating: 5,
          comment:
            "Love the new features! The authentication system is robust.",
          reviewer: "Mike Johnson",
          date: new Date("2025-08-25"),
        },
      ];

      // Create sample data
      const [createdLogs, createdTasks, createdReviews] = await Promise.all([
        Log.bulkCreate(sampleLogs),
        Task.bulkCreate(sampleTasks),
        Review.bulkCreate(sampleReviews),
      ]);

      return {
        success: true,
        message: "Sample data created successfully",
        data: {
          logs: createdLogs.length,
          tasks: createdTasks.length,
          reviews: createdReviews.length,
          details: {
            logs: createdLogs,
            tasks: createdTasks,
            reviews: createdReviews,
          },
        },
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.createSampleData]", err);
      throw err;
    }
  },

  updateStatus: async (
    appId: string,
    status: "running" | "stopped" | "maintenance"
  ) => {
    try {
      // Check if application exists
      const application = await Application.findOne({
        where: { appId: appId },
      });

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      // Update the status
      await application.update({ status: status });

      // Get the updated application
      const updatedApplication = await Application.findOne({
        where: { appId: appId },
      });

      return {
        success: true,
        message: "Application status updated successfully",
        data: parseApplicationImages(updatedApplication),
      };
    } catch (err: any) {
      console.log("[ERROR - ApplicationService.updateStatus]", err);
      throw err;
    }
  },
};

export { ApplicationService };
