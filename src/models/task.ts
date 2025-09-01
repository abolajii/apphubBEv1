import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface TaskAttributes {
  id: number;
  appId: string;
  description: string;
  status: 'pending' | 'inprogress' | 'done';
  dateToFinish: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public appId!: string;
  public description!: string;
  public status!: 'pending' | 'inprogress' | 'done';
  public dateToFinish!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    appId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'inprogress', 'done'),
      allowNull: false,
      defaultValue: 'pending'
    },
    dateToFinish: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
  }
);

export { Task, TaskAttributes, TaskCreationAttributes };
