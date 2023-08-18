import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Item } from '../models/item.js';

const router = express.Router();
router.post('/users', async (req, res) => {
  const { first_name, last_name, email, gender, password, favoriteColors, favoriteBrands } = req.body;
  try {
    const existingUser = await User.findOne({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ first_name, last_name, email, gender, password: hashedPassword, favoriteColors: favoriteColors, favoriteBrands: favoriteBrands });
    req.session.user = newUser;
    res.json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    req.session.user = user;
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedFields = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(updatedFields);
    await Item.update({ UserId: user.id }, { where: { UserId: null } });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/recommendations', async (req, res) => {
  const { favoriteColors, favoriteBrands, gender } = req.body;
  try {
    const recommendedItems = await getRecommendedItems(
      favoriteColors,
      favoriteBrands,
      gender
    );
    res.status(200).json(recommendedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
