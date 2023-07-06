import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
});

export default CartItem;
