// seed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Item, Cart, CartItem } from './models/index.js';
import { sequelize } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/users.json'), 'utf8'));
const itemData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/items.json'), 'utf8'));
const cartData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/carts.json'), 'utf8'));


const seedDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    await User.bulkCreate(userData);
    console.log('User data has been seeded!');

    await Item.bulkCreate(itemData);
    console.log('Item data has been seeded!');

    await Cart.bulkCreate(cartData);
    console.log(' Cart data has been seeded!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();