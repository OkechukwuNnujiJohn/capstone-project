// app.js
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './database.js';
import { User, Cart,  Item, CartItem } from './models/index.js';
import userRoutes from './routes/users.js';
import SequelizeStoreInit from 'connect-session-sequelize';


// import { User, Post } from './models/index.js';

const app = express();
// const cors = require('cors');


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan('dev'))

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize
});

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

  //Route to get all Cart
  app.get('/carts', async (req, res) => {
    try {
      const carts = await Cart.findAll();
      res.json(carts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // //Route to get all Cart
  // app.get('/cartItem', async (req, res) => {
  //   try {
  //     const cartItems = await CartItem.findAll();
  //     res.json(cartItems);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // });

//   // Route to get a user by id
// app.get('/users/:id', async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const user = await User.findByPk(userId, {
//       include: [
//         {
//           model: Cart,
//           as: 'carts',
//           include: [
//             {
//               model: Item,
//               through: { attributes: [] } // To exclude the join table attributes from the result
//             }
//           ]
//         }
//       ]
//     });

//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Route to get a user by id
// app.get('/users/:id', async (req, res) => {
//     try {
//       const user = await User.findByPk(req.params.id);
//       if (user) {
//         res.json(user);
//       } else {
//         res.status(404).json({ message: 'User not found' });
//       }
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

// Route to get all posts, with associated users
// app.get('/item', async (req, res) => {
//     try {
//       const items = await Post.findAll({
//         include: [{ model: User, as: 'user' }],
//         order: [['createdAt', 'DESC']]
//       });
//       res.json(posts);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

// Route to create a new post
// app.post('/posts', async (req, res) => {
//     try {
//       const post = await Post.create(req.body);
  
//       const postWithUser = await Post.findOne({
//         where: { id: post.id },
//         include: [{ model: User, as: 'user' }]
//       });
  
//       res.status(201).json(postWithUser);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });
  

// Set up Express, middleware, routes, etc. here

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