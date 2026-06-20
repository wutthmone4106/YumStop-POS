const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { 
    type: String, 
    required: [true, 'A table label is required'], 
    unique: true,
    trim: true 
  },

  capacity: { 
    type: Number, 
    required: [true, 'Define seating load allocation thresholds'] 
  },

  initials: { type: String, default: "" },

  status: { 
    type: String, 
    enum: ['Available', 'Booked'],
    default: 'Available' 
  },

  activeOrderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order" 
  }

}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
