import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import { User } from "./user.model";
import { Car } from "./car.model";

export interface BookingAttributes {
  id: number;
  start_date: Date;
  end_date: Date;
  total_price: number;
  user_id: number;
  car_id: number;
}


interface BookingCreationAttributes extends Optional<BookingAttributes, "id"> {}

export class Booking extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes {
  public id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public total_price!: number;
  public user_id!: number;
  public car_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


Booking.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  car_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'cars', key: 'id' }
  },
}, {
  sequelize,
  tableName: 'bookings',
});


User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Car.hasMany(Booking, { foreignKey: 'car_id' });
Booking.belongsTo(Car, { foreignKey: 'car_id' });
