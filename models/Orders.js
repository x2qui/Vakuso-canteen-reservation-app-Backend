const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    availability: String,
    customerName: String,
    pickupTime: String,
  });

  const Orders = mongoose.model('Order', orderSchema);
  module.exports = Orders;