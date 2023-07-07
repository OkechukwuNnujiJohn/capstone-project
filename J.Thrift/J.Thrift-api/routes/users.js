import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Op } from 'sequelize';

const router = express.Router();

// Route for user registration
router.post('/users/signup', async (req, res) => {
  const { first_name,last_name, email,gender,  password,favoriteColors:[], favoriteBrands:[]} = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.eq]: [{ email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ first_name, last_name, email,gender, password: hashedPassword,favoriteColors:[], favoriteBrands:[] });

    // Set the user in the session
    req.session.user = newUser;

    // Return the user data in the response
    res.json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route for user login
router.post('/users', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Set the user in the session
    req.session.user = user;

    // Return the user data in the response
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;