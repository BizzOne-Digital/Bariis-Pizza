const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function fix() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const db = mongoose.connection.db;
  const collection = db.collection('menuitems');

  // Map old categories to new ones
  const mapping = [
    { old: 'somali-rice',        new: 'somali-plates' },
    { old: 'somali-specialties', new: 'somali-plates' },
    { old: 'sambusa-snacks',     new: 'somali-plates' },
    { old: 'sides',              new: 'somali-plates' },
    { old: 'combos',             new: 'somali-plates' },
    { old: 'family-platters',    new: 'somali-plates' },
    { old: 'lunch-specials',     new: 'somali-plates' },
  ];

  for (const map of mapping) {
    const result = await collection.updateMany(
      { category: map.old },
      { $set: { category: map.new } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Updated ${result.modifiedCount} items: ${map.old} → ${map.new}`);
    }
  }

  console.log('✅ All done! Categories fixed in MongoDB.');
  await mongoose.disconnect();
  process.exit(0);
}

fix().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
