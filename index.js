const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
require('dotenv').config()
const http = require('http')
const bcrypt = require('bcrypt')






const Studentuser = require('./models/Studentuser')

const Product = require('./models/Product')

const Orders = require('./models/Orders')



app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(bodyParser.json());




cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })


app.delete('/:public_id', async(req, res)=> {
    const {public_id} = req.params;
    try {
        await cloudinary.uploader.destroy(public_id);
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e.message)
    }
  })

  
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

  // get category
  
app.get('/products/category/:category', async (req, res) => {
    const { category } = req.params;

    try {
        const products = await Product.find({ category });
        res.status(200).json(products);
    } catch (error) {
        console.error('unable to fetch product category', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/admin', async (req, res) => {
   
    try {
      const orders = await Orders.find();
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
});

  app.post('/admin', async (req, res) => {
    try {
      const { productName, price, availability, customerName, pickupTime } = req.body;
      const order = await Orders.create({ productName, price, availability, customerName, pickupTime });
      res.status(201).json(order);
    } catch (error) {
      console.error('Error adding order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// products analysis stats for admin page

  app.get('/products/stats', async (req, res) => {
    try {
      const sumProducts = await Product.countDocuments();
      const sumPriceResult = await Product.aggregate([{ $group: { _id: null, total: { $sum: '$price' } } },]);
      const sumCategories = await Product.distinct('category');
  
      const sumPrice = sumPriceResult.length > 0 ? sumPriceResult[0].total : 0;
  
      res.json({ sumProducts, sumPrice, sumCategories: sumCategories.length });
    } catch (error) {
      console.error('Error fetching product statistics:', error);
      res.status(500).json({ error: 'Error fetching product statistics' });
    }
  });

 // get product to display front end

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product details:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// student Login



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await Studentuser.findOne({ email });

      if (user) {
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
              res.json({ status: 'success', isAdmin: user.isAdmin });
          } else {
              res.json({ status: 'Password is incorrect' });
          }
      } else {
          res.json({ status: 'No record found' });
      }
  } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ status: 'Error during login' });
  }
});



// account sign up


app.post('/signup', (req, res) => {
    Studentuser.create(req.body)
    .then(studentuser => res.json(studentuser))
    .catch (err => res.json(err))
}) 
app.listen(4000, ()=> {
    console.log('server running at port', 4000)
  })
  
