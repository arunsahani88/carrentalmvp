import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface CarAttributes {
  id: number;
  brand: string;
  model: string;
  stock: number;
  peak_season_price: number;
  mid_season_price: number;
  off_season_price: number;
}

interface CarCreationAttributes extends Optional<CarAttributes, "id"> {}

export class Car extends Model<CarAttributes, CarCreationAttributes>
  implements CarAttributes {
  public id!: number;
  public brand!: string;
  public model!: string;
  public stock!: number;
  public peak_season_price!: number;
  public mid_season_price!: number;
  public off_season_price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Car.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  brand: { 
    type: DataTypes.STRING,
    allowNull: false 
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  peak_season_price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  mid_season_price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  off_season_price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
}, {
  sequelize,
  tableName: 'cars',
});

