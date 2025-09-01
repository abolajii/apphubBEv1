import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface LogAttributes {
  id: number;
  appId: string;
  appName: string;
  logType: "success" | "error" | "info" | "warning";
  message: string;
  statusCode: number;
  responseTime: number;
  endpoint: string;
  userAgent: string;
  ip: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
  additionalData?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LogCreationAttributes
  extends Optional<LogAttributes, "id" | "createdAt" | "updatedAt"> {}

class Log
  extends Model<LogAttributes, LogCreationAttributes>
  implements LogAttributes
{
  public id!: number;
  public appId!: string;
  public appName!: string;
  public logType!: "success" | "error" | "info" | "warning";
  public message!: string;
  public statusCode!: number;
  public responseTime!: number;
  public endpoint!: string;
  public userAgent!: string;
  public ip!: string;
  public method!: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
  public additionalData?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Log.init(
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
      allowNull: false,
    },
    logType: {
      type: DataTypes.ENUM("success", "error", "info", "warning"),
      allowNull: false,
      defaultValue: "success",
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responseTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"),
      allowNull: false,
      defaultValue: "GET",
    },
    additionalData: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      get() {
        const rawValue = this.getDataValue("additionalData");
        if (typeof rawValue === "string") {
          try {
            return JSON.parse(rawValue);
          } catch (error) {
            return rawValue;
          }
        }
        return rawValue;
      },
    },
  },
  {
    sequelize,
    tableName: "logs",
    timestamps: true,
    underscored: true,
  }
);

export { Log, LogAttributes, LogCreationAttributes };
