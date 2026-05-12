const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'Bariis & Pizza House' },
  tagline: { type: String, default: 'African Love, Somali Soul' },
  phone: { type: String, default: '902-292-9852' },
  email: { type: String, default: '' },
  address: { type: String, default: '9005 Commercial Street, New Minas, Nova Scotia' },
  hours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    tiktok: String,
    snapchat: String,
    google: String
  },
  deliveryLinks: {
    doordash: String,
    ubereats: String,
    skipthedishes: String
  },
  announcements: [{
    text: String,
    active: Boolean,
    type: { type: String, enum: ['info', 'warning', 'success'], default: 'info' }
  }],
  heroImages: [String],
  isAcceptingOrders: { type: Boolean, default: true },
  estimatedPickupTime: { type: Number, default: 20 },
  minimumOrderAmount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Settings', SettingsSchema);
