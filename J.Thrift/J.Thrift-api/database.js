// database.js
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('mydatabase', 'nnjohn', 'thor5009', {
  host: 'localhost',
  dialect: 'postgres'
});