const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    customizations: [{
      name: String,
      options: [String], // e.g. ["Small", "Medium", "Large"]
    }],
    inventory: {
      quantity: { type: Number, default: 0 },
      isAvailable: { type: Boolean, default: true },
    },
    isDeleted: { type: Boolean, default: false }
},{timestamps:true})

module.exports = mongoose.model("Products",productSchema)