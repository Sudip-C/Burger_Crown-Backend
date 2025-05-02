const express = require("express");
const { upload } = require('../utils/cloudinary');
const {
  createCategory,
  getAllCategories,
} = require("../controllers/categoryController");
const {
  createProduct,
  getAllProducts,
  getProductById,
  toggleAvailability,
  softDeleteProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Category
router.post("/categories", protect, adminOnly, createCategory);
router.get("/categories", getAllCategories);

// Product
router.post("/products", protect, adminOnly,upload.array('images'), createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.patch('/products/:id/availability', protect, adminOnly, toggleAvailability);
router.delete('/products/:id', protect, adminOnly, softDeleteProduct);


module.exports = router;
