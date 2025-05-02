const express = require('express');
const {
  getCart,
  addOrUpdateItem,
  removeItem
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addOrUpdateItem);
router.delete('/:productId', protect, removeItem);

module.exports = router;
