import express, { response } from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sequelize } from './database.js';
import { User, Cart, Item } from './models/index.js';
import bodyParser from 'body-parser';
import getAuthenticationHeader from './authenticatonHeader.js';
import userRoutes from './routes/users.js';
import SequelizeStoreInit from 'connect-session-sequelize';
import { body, validationResult } from 'express-validator';
import multer from 'multer';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const setupMiddleware = () => {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  app.use(express.json());
  app.use(morgan('dev'))
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  const SequelizeStore = SequelizeStoreInit(session.Store);
  const sessionStore = new SequelizeStore({
    db: sequelize
  });
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        sameSite: false,
        secure: false,
        expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000))
      }
    })
  );
  sessionStore.sync();

  app.use('/images', express.static(path.join(__dirname, 'images')));

};

const setupServer = () => {
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

}

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
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 10 },
});

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const validateItem = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('price').isFloat().withMessage('Price must be a valid float'),
  body('description').notEmpty().withMessage('Description is required'),
  body('color').notEmpty().withMessage('Color is required'),
];
const createItem = async (req, res) => {
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
    const createdItem = await Item.create(newItem);
    res.status(201).json(createdItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not add item' });
  }
};

// Global Varibales
const public_key = "498434c2db635071ca71487eef08a26e";
const secret_key = "df14d2ab37150fcd9570a50e45daebcc";
const headers = getAuthenticationHeader(public_key, secret_key);

const uploadGarment = async (req, res) => {
  const url = "https://api.revery.ai/console/v1/process_new_garment";
  const garmentData = JSON.stringify({
    "category": "bottoms",
    "bottom_sub_category": "pants",
    "gender": "male",
    "garment_img_url": "https://revery-integration-tools.s3.us-east-2.amazonaws.com/API_website/bottoms.jpeg"
  });
  try {
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: garmentData
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          const formattedGarments = data.garments.map(garment => ({
            id: garment.id,
            gender: garment.gender,
            image_urls: { product_image: garment.image_urls.product_image },
            tryon: { category: garment.tryon.category, bottoms_sub_category: garment.tryon.bottom_sub_category, enabled: true, open_outerwear: false }
          }));
          res.json(formattedGarments);
        } else {
          console.error('Error uploading garment:', data);
          res.status(200).json({ messsage: 'Error uploading garment' })
        }
      })
      .catch(error => {
        console.error('Error uploading garment:', error);
        res.status(200).json({ message: 'Error uploading garment' });
      });
  } catch (error) {
    console.error('Error uploading garment:', error);
    res.status(200).json({ message: 'Error uploading garment' });
  }
};

const fetchProcessedGarments = async (req, res) => {
  const { gender, category } = req.query;
  let url = `https://api.revery.ai/console/v1/get_filtered_garments?gender=${gender}`;

  if (category && category !== "all") {
    url += `&category=${category}`;
  }

  try {
    fetch(url, {
      method: 'GET',
      headers: headers,
    })

      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          res.json(data);
        } else {
          console.error('Error uploading garment:', data);
          res.status(200).json({ messsage: 'Error uploading garment' })
        }
      })
      .catch(error => {
        console.error('Error uploading garment:', error);
        res.status(200).json({ message: 'Error uploading garment' });
      });
  } catch (error) {
    console.error('Error uploading garments:', error);
    res.status(200).json({ message: 'Error fetching processed garments' });
  }
};

const fetchSpecificGarment = async (req, res) => {
  const { garment_id } = req.params;
  try {
    const specificGarment = { id: garment_id, name: "Sample Garment", category: "Tops", gender: "male" };
    res.json(specificGarment);
  } catch (error) {
    console.error('Error fetching specific garment:', error);
    res.status(200).json({ message: 'Error fetching specific garment' });
  }
};

const getModels = async (req, res) => {
  const { gender } = req.query;
  const url = `https://api.revery.ai/console/v1/get_model_list?gender=${gender}`;
  try {
    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          res.json(data);
        } else {
          console.error("Error fetching models.");
          res.status(200).json({ message: "Error fetching models" });
        }
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
        res.status(200).json({ message: "Error fetching models" });
      });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(200).json({ message: 'Error fetching models' });
  }
};

const getSelectedShoes = async (req, res) => {
  const { gender } = req.query;
  const url = `https://api.revery.ai/console/v1/get_selected_shoes?gender=${gender}`;
  try {
    fetch(`${url}`, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          res.json(data);
        } else {
          console.error('Error fetching selected shoes:', data);
          res.status(200).json({ message: 'Error fetching selected shoes' });
        }
      }).catch(error => {
        console.error("Error fetching shoes:", error);
        res.status(200).json({ message: "Error fetching shoes" });
      });
  } catch (error) {
    console.error('Error fetching selected shoes:', error);
    res.status(200).json({ message: 'Error fetching selected shoes' });
  }
};

const getSelectedFaces = async (req, res) => {
  const { gender } = req.query;
  const url = `https://api.revery.ai/console/v1/get_selected_faces?gender=${gender}`;
  try {
    fetch(`${url}`, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          res.json(data);
        } else {
          console.error('Error fetching selected faces:', data);
          res.status(200).json({ message: 'Error fetching selected faces' });
        }
      })
      .catch(error => {
        console.error("Error fetching faces:", error);
        res.status(200).json({ message: "Error fetching faces" });
      });
  } catch (error) {
    console.error('Error fetching selected faces:', error);
    res.status(200).json({ message: 'Error fetching selected faces' });
  }
};

const requestTryOn = async (req, res) => {
  const url = "https://api.revery.ai/console/v1/request_tryon";
  const { garments, model_id } = req.body;

  const requestData = JSON.stringify({
    garments: {
      tops: garments.tops,
      bottoms: garments.bottoms,
      outerwear: garments.outerwear,
    },
    model_id,
    "background": "studio",
  });
  try {
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: requestData
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          res.json(data);
        } else {
          console.error('Error requesting try-on:', data);
          res.status(200).json({ message: 'Error requesting try-on' });
        }
      })
      .catch(error => {
        console.error("Error requesting try-on:", error);
        res.status(200).json({ message: "Error requesting try-on" });
      });
  } catch (error) {
    console.error('Error requesting try-on:', error);
    res.status(200).json({ message: 'Error requesting try-on' });
  }
};

const getCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setupRoutes = () => {
  app.use(userRoutes);

  app.get('/users', getUsers);
  app.get('/items', getItems);
  app.post('/items', upload.single('image'), validateItem, createItem);
  app.post('/uploadGarment', uploadGarment);
  app.get('/fetchProcessedGarments', fetchProcessedGarments);
  app.get('/fetchProcessedGarments/:garment_id', fetchSpecificGarment);
  app.get('/getModels', getModels);
  app.get('/getSelectedShoes', getSelectedShoes);
  app.get('/getSelectedFaces', getSelectedFaces);
  app.post('/requestTryOn', requestTryOn);
  app.get('/carts', getCarts);
};

const startApp = () => {
  setupMiddleware();
  setupRoutes();
  setupServer();
};

startApp();
