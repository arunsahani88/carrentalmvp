import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface UserAttributes {
  id: number;
  name: string;
  driving_license_valid_until: Date;
  driving_license_number: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public driving_license_valid_until!: Date;
  public driving_license_number!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driving_license_valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    driving_license_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
