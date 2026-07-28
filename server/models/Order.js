const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  orderType: { type: String, enum: ['pickup', 'delivery', 'dine-in'], required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    quantity: { type: Number, required: true },
    size: String,
    specialInstructions: String
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'online', 'card'], default: 'cash' },
  deliveryAddress: { type: String },
  specialInstructions: { type: String },
  estimatedTime: { type: Number, default: 30 }, // minutes
  cloverOrderId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
