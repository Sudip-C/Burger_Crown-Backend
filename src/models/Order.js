const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'BUser' },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BUser',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
