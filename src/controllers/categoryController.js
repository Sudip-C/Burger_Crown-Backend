const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.getAllCategories = async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
  };