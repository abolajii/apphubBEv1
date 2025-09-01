import { Review } from "../models/review";
import { Application } from "../models/application";
import { Op } from "sequelize";

const ReviewService = {
  add: async (data: any) => {
    try {
      const review = await Review.create({
        appId: data.appId,
        rating: data.rating,
        comment: data.comment,
        reviewer: data.reviewer,
        date: new Date(data.date),
      });

      return {
        success: true,
        message: "Review added successfully",
        data: review,
      };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.add]", err);
      throw err;
    }
  },

  get: async (id: string) => {
    try {
      const review = await Review.findByPk(id, {
        include: [
          {
            model: Application,
            as: "Application",
            attributes: ["name"],
            required: false,
          },
        ],
      });

      if (!review) {
        return {
          success: false,
          message: "Review not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Review retrieved successfully",
        data: review,
      };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.get]", err);
      throw err;
    }
  },

  getAll: async (params?: {
    appId?: string;
    rating?: number;
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    try {
      const { appId, rating, search, limit = 10, page = 1 } = params || {};

      // Build where conditions
      const where: any = {};

      if (appId) {
        where.appId = appId;
      }

      if (rating) {
        where.rating = rating;
      }

      if (search) {
        where[Op.or] = [
          { comment: { [Op.like]: `%${search}%` } },
          { reviewer: { [Op.like]: `%${search}%` } },
        ];
      }

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const totalCount = await Review.count({ where });

      // Get reviews with filters and pagination
      const reviews = await Review.findAll({
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

      // Get rating distribution counts
      const baseWhereForCounts = { ...where };
      delete baseWhereForCounts.rating; // Remove rating filter for counts

      const [
        rating1Count,
        rating2Count,
        rating3Count,
        rating4Count,
        rating5Count,
        allReviews,
      ] = await Promise.all([
        Review.count({ where: { ...baseWhereForCounts, rating: 1 } }),
        Review.count({ where: { ...baseWhereForCounts, rating: 2 } }),
        Review.count({ where: { ...baseWhereForCounts, rating: 3 } }),
        Review.count({ where: { ...baseWhereForCounts, rating: 4 } }),
        Review.count({ where: { ...baseWhereForCounts, rating: 5 } }),
        Review.findAll({
          where: baseWhereForCounts,
          attributes: ["rating"],
          raw: true,
        }),
      ]);

      // Calculate average rating
      const totalRating = allReviews.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
      );
      const averageRating =
        allReviews.length > 0
          ? (totalRating / allReviews.length).toFixed(2)
          : 0;

      // Calculate grouped counts
      const lowRatings = rating1Count + rating2Count; // 1-2 stars
      const highRatings = rating5Count; // 5 stars

      return {
        success: true,
        message: "All reviews retrieved successfully",
        data: reviews,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
        ratingStats: {
          distribution: {
            1: rating1Count,
            2: rating2Count,
            3: rating3Count,
            4: rating4Count,
            5: rating5Count,
          },
          summary: {
            totalReviews: allReviews.length,
            averageRating: parseFloat(averageRating as string),
            fiveStarReviews: rating5Count,
            lowRatings: lowRatings, // 1-2 star reviews
          },
        },
      };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.getAll]", err);
      throw err;
    }
  },

  update: async (id: string, data: any) => {
    try {
      return { success: true, message: "Review updated successfully" };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.update]", err);
      throw err;
    }
  },

  delete: async (id: string) => {
    try {
      return { success: true, message: "Review deleted successfully" };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.delete]", err);
      throw err;
    }
  },

  entry: async (data: any) => {
    try {
      return { success: true, message: "Welcome to Review entry!" };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.entry]", err);
      throw err;
    }
  },

  checkExisting: async (data: any) => {
    try {
      return { success: true, message: "Welcome to Review checkExisting!" };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.checkExisting]", err);
      throw err;
    }
  },

  getByAppId: async (appId: string, limit?: number) => {
    try {
      const reviews = await Review.findAll({
        where: { appId: appId },
        order: [["createdAt", "DESC"]],
        ...(limit && { limit }),
      });

      return {
        success: true,
        message: "Reviews retrieved successfully",
        data: reviews,
      };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.getByAppId]", err);
      throw err;
    }
  },

  countByAppId: async (appId: string) => {
    try {
      const count = await Review.count({ where: { appId: appId } });

      return {
        success: true,
        message: "Reviews count retrieved successfully",
        data: { count },
      };
    } catch (err: any) {
      console.log("[ERROR - ReviewService.countByAppId]", err);
      throw err;
    }
  },
};

export { ReviewService };
