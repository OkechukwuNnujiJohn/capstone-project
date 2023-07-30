import { User } from './user.js';
import CartItem from './cartItem.js';
import { Item } from './item.js';
import { Cart } from './cart.js';
import { sequelize } from '../database.js';

User.hasOne(Cart, { as: 'carts', foreignKey: 'userId' });
Cart.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Cart.belongsToMany(Item, { through: CartItem });
Item.belongsToMany(Cart, { through: CartItem });
User.hasMany(Item);
Item.belongsTo(User);
export { User, Item, Cart, CartItem };