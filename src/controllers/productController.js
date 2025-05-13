const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path)||[];
    const product = await Product.create({
      ...req.body,
      images: imageUrls,
    });
    res.status(201).json({message:'Product created successfully.',product});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    const products = await Product.find({...query,isDeleted:false}).populate("category");
    res.status(201).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.toggleAvailability = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
  
    product.inventory.isAvailable = !product.inventory.isAvailable;
    await product.save();
  
    res.json({ message: 'Availability toggled', product });
  };
  
  exports.softDeleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
  
    product.isDeleted = true;
    await product.save();
  
    res.json({ message: 'Product deleted (soft)' });
  };