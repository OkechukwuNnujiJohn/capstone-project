// models/post.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';


export const Cart = sequelize.define('Cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

});
