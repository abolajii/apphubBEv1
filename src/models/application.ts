import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ApplicationImages {
  small: string[];
  large: string[];
}

interface ApplicationAttributes {
  id: number;
  bg: string;
  description: string;
  name: string;
  link: string;
  stacks: string;
  onGoing: boolean;
  appId: string;
  status: "running" | "stopped" | "maintenance";
  uptime: number;
  downtime: number;
  lastChecked: Date;
  backendUrl: string;
  frontendUrl: string;
  githubUrl: string;
  images: ApplicationImages;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApplicationCreationAttributes
  extends Optional<ApplicationAttributes, "id" | "createdAt" | "updatedAt"> {}

class Application
  extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public id!: number;
  public bg!: string;
  public description!: string;
  public name!: string;
  public link!: string;
  public stacks!: string;
  public onGoing!: boolean;
  public appId!: string;
  public status!: "running" | "stopped" | "maintenance";
  public uptime!: number;
  public downtime!: number;
  public lastChecked!: Date;
  public frontendUrl!: string;
  public backendUrl!: string;
  public githubUrl!: string;
  public images!: ApplicationImages;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bg: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stacks: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    onGoing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    appId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("running", "stopped", "maintenance"),
      allowNull: false,
      defaultValue: "running",
    },
    uptime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    downtime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastChecked: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    githubUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    frontendUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    backendUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { small: [], large: [] },
    },
  },
  {
    sequelize,
    tableName: "applications",
    timestamps: true,
    underscored: true,
  }
);

export {
  Application,
  ApplicationAttributes,
  ApplicationCreationAttributes,
  ApplicationImages,
};
