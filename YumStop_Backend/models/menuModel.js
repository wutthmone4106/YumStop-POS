const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'A menu item must have a name'], 
    trim: true 
  },

  price: { 
    type: Number, 
    required: [true, 'A menu item must have a price'] 
  },

  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: [true, 'A menu item must belong to a category'] 
  },
  
  image: { 
    type: String, 
    required: [true, 'A menu item must have an image display'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);