const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user cart with total
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) return res.json({ items: [], total: 0 });

  const total = cart.items.reduce((sum, item) =>
    sum + item.product.price * item.quantity, 0);

  res.json({ items: cart.items, total });
};

// Add or update item
exports.addOrUpdateItem = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }]
    });
  } else {
    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity; // update
    } else {
      cart.items.push({ product: productId, quantity }); // add
    }
    await cart.save();
  }

  res.status(200).json({ message: 'Cart updated', cart });
};

// Remove item
exports.removeItem = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();

  res.status(200).json({ message: 'Item removed', cart });
};
