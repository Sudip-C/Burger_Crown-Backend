const Order = require("../models/Order");
const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
  };
  
  // Update user role
  exports.updateUserRole = async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated', user });
  };
  
  // Soft-delete user
  exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    user.isDeleted = true;
    await user.save();
    res.json({ message: 'User soft-deleted' });
  };

  
  // View all orders
exports.getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('user products.product');
    res.json(orders);
  };
  
  // Update order status
  exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
  
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  };
  
  // Assign delivery partner
  exports.assignDelivery = async (req, res) => {
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

  
  exports.analytics = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const ordersToday = await Order.find({ createdAt: { $gte: today } });
    const totalRevenue = ordersToday.reduce((sum, o) => sum + o.total, 0);
    const orderCount = ordersToday.length;
  
    // Top 5 most ordered products
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          count: { $sum: "$products.quantity" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          count: 1
        }
      }
    ]);
  
    res.json({ orderCount, totalRevenue, topProducts });
  };
  