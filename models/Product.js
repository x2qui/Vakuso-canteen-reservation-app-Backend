const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  availability: String,
  price: Number,
  category: String,
  pictures: [{ url: String, public_id: String }],
 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
