const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/authMiddleware');
const admin = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

// Users
router.get('/users', admin.getAllUsers);
router.patch('/users/:id/role', admin.updateUserRole);
router.delete('/users/:id', admin.deleteUser);

// Orders
router.get('/orders', admin.getAllOrders);
router.patch('/orders/:id/status', admin.updateOrderStatus);
router.patch('/orders/:id/assign', admin.assignDelivery);

// Analytics
router.get('/analytics', admin.analytics);

module.exports = router;
