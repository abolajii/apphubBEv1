import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ReviewAttributes {
  id: number;
  appId: string;
  appName?: string;
  rating: number;
  comment: string;
  reviewer: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, "id" | "createdAt" | "updatedAt"> {}

class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: number;
  public appId!: string;
  public appName?: string;
  public rating!: number;
  public comment!: string;
  public reviewer!: string;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    appId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    appName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reviewer: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "reviews",
    timestamps: true,
    underscored: true,
  }
);

export { Review, ReviewAttributes, ReviewCreationAttributes };
