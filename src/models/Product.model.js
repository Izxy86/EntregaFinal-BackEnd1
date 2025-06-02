const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, unique: true },
  price: Number,
  stock: Number,
  category: String,
  status: Boolean,
  thumbnails: [String]
});

// Plugin para paginar
productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;

