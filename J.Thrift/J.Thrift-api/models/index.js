// models/index.js
import { User } from './user.js';
import CartItem from './cartItem.js';
import { Item } from './item.js';
import { Cart } from './cart.js';
import { sequelize } from '../database.js';

User.hasOne(Cart, { as: 'carts', foreignKey: 'userId' });
Cart.belongsTo(User, { as: 'user', foreignKey: 'userId' });
// association for the cart and items
Cart.belongsToMany(Item, { through: CartItem});
Item.belongsToMany(Cart, { through: CartItem});

// // Sync models with the database
// sequelize.sync().then(() => {
//     console.log('Database synchronized');
//   }).catch(err => {
//     console.error('Error synchronizing database:', err);
//   });
  

// Cart.hasMany(Item, {as: 'items', foreignKey: 'cartId'});
// Item.belongsTo(Cart, { as: 'cart', foreignKey: 'cartId' });

// Cart.belongsTo(User, { as: 'users', foreignKey: 'userId' });
// Item.belongsTo(Cart)

export { User,Item, Cart, CartItem };