import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import { Item } from './item.js';
import { Cart } from './cart.js';

export const CartItem = sequelize.define('CartItem', {
    cartId: {
        type: DataTypes.INTEGER,
        references: {
          model: Cart, // 'Movies' would also work
          key: 'id'
        }
      },
      itemId: {
        type: DataTypes.INTEGER,
        references: {
          model: Item, // 'Actors' would also work
          key: 'id'
        }
      }
    });

export default CartItem;
