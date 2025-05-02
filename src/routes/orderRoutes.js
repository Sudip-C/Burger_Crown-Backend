const express = require('express');
const router = express.Router();
const order = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/authMiddleware');

// Customer Routes
router.post('/', protect, order.placeOrder);
router.get('/my-orders', protect, order.getMyOrders);

// Admin or delivery partner
router.patch('/:id/status', protect, order.updateOrderStatus);

// Admin only
router.patch('/:id/assign', protect, adminOnly, order.assignDeliveryPartner);

module.exports = router;
