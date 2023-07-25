import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sequelize } from './database.js';
import { User, Cart, Item, CartItem } from './models/index.js';
// import recommendationRoutes from './routes/recommendations.js';
import userRoutes from './routes/users.js';
import SequelizeStoreInit from 'connect-session-sequelize';
import { body, validationResult } from 'express-validator';
import multer from 'multer';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'))

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 10 },
});

app.use('/images', express.static(path.join(__dirname, 'images')));

// Session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: false,
      secure: false,
      expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)) // 1 year in milliseconds
    }
  })
);
sessionStore.sync();

app.use(userRoutes);
// app.use(recommendationRoutes);

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Route to get all Items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post('/items', upload.single('image'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('price').isFloat().withMessage('Price must be a valid float'),
  body('description').notEmpty().withMessage('Description is required'),
  body('color').notEmpty().withMessage('Color is required'),
], async (req, res) => {
  req.body.category = req.body.category.toString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newItem = {
      name: req.body.name,
      category: req.body.category,
      gender: req.body.gender,
      brand: req.body.brand,
      image: req.file.filename,
      price: req.body.price,
      description: req.body.description,
      color: req.body.color
    };
    // console.log("newiTEM:",newItem)
    const createdItem = await Item.create(newItem);
    // await createdItem.update({ UserId: req.session.user.id });

    res.status(201).json(createdItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not add item' });
  }
}); 




//Route to get all Cart
app.get('/carts', async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

sequelize.sync({ alter: true })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
