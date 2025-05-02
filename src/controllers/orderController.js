const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require('../models/Product');
const notifyUser = require("../utils/notifyUser");

exports.placeOrder = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });
  
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(i => ({ product: i.product._id, quantity: i.quantity })),
      total
    });
  
    await Cart.findOneAndDelete({ user: req.user._id });
  
    res.status(201).json({ message: 'Order placed', order });
  };
  
  // Get user's orders
  exports.getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  };
  
  // Update order status (admin or delivery)
  exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
  
    if (!order) return res.status(404).json({ message: 'Order not found' });
  
    order.status = status;
    await order.save();
    await notifyUser(order.user, `Your order is now ${status}`);
    res.json({ message: 'Order status updated', order });
  };
  
  // Assign delivery partner (admin only)
  exports.assignDeliveryPartner = async (req, res) => {
    const { partnerId } = req.body;
    const order = await Order.findById(req.params.id);
    const partner = await User.findById(partnerId);
  
    if (!order || !partner || partner.role !== 'DeliveryPartner') {
      return res.status(400).json({ message: 'Invalid assignment' });
    }
  
    order.deliveryPartner = partnerId;
    await order.save();
  
    res.json({ message: 'Delivery partner assigned', order });
  };