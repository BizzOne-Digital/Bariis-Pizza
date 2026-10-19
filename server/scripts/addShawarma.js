// Adds shawarma items (featured) and un-features pizza while it is "Coming Soon".
// Usage: node server/scripts/addShawarma.js
// PRICES / OPTIONS ARE PLACEHOLDERS — confirm with the client before running against production.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const SHAWARMA = [
  {
    name: 'Chicken Shawarma Wrap',
    description: 'Marinated halal chicken shawarma wrapped with garlic sauce, pickles and fresh vegetables.',
    price: 12.99,
    sizes: [{ label: 'Wrap', price: 12.99 }, { label: 'Wrap + Fries', price: 15.99 }],
    tags: ['halal', 'popular', 'new'],
  },
  {
    name: 'Beef Shawarma Wrap',
    description: 'Seasoned halal beef shawarma wrapped with tahini, onions, tomatoes and fresh vegetables.',
    price: 13.99,
    sizes: [{ label: 'Wrap', price: 13.99 }, { label: 'Wrap + Fries', price: 16.99 }],
    tags: ['halal', 'new'],
  },
  {
    name: 'Shawarma Plate (Chicken or Beef)',
    description: 'Shawarma served over seasoned rice with salad, garlic sauce and house sauce.',
    price: 17.99,
    sizes: [{ label: 'Chicken', price: 17.99 }, { label: 'Beef', price: 18.99 }],
    tags: ['halal', 'new'],
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

  for (const item of SHAWARMA) {
    await MenuItem.findOneAndUpdate(
      { name: item.name },
      { ...item, category: 'shawarma', featured: true, available: true, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    console.log('Upserted:', item.name);
  }

  const res = await MenuItem.updateMany({ category: 'pizza' }, { featured: false });
  console.log('Pizza items un-featured:', res.modifiedCount);

  await mongoose.disconnect();
})().catch(err => { console.error(err); process.exit(1); });
