require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const MenuItem = require('../models/MenuItem');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_DIR = path.join(__dirname, '..', '..', 'images');

// filename -> MenuItem _id
const MATCHES = {
  '0b48e6bf-2fab-4c63-aa5c-5924d232f452.jpeg': '6a28a3e2d5af7a7a998c84d6', // Chicken Stir-Fry
  '1880b261-fa8b-4b6a-be4c-33908516205f.jpeg': '6a28a3e2d5af7a7a998c84e2', // Soup
  '18feac66-74c5-451f-ab16-30d38bec09a4.jpeg': '6a28a3e2d5af7a7a998c84df', // Sambusa 3pcs
  '2bf95e9a-1dcd-4256-a6bb-eca42a4415a2.jpeg': '6a28a3e2d5af7a7a998c84f1', // Ugali with Beef Stew
  '3a4200c4-c898-4ed6-a3b3-e971d8e5e421.jpeg': '6a28a3e2d5af7a7a998c84ec', // Meat Lovers Pizza
  '4b11bbc0-068c-4657-8da9-c336d784b708.jpeg': '6a28a3e2d5af7a7a998c84f2', // Ugali with Chicken Stew
  '526b7970-7664-4958-a592-49e980ba6d14.jpeg': '6a28a3e2d5af7a7a998c84f0', // Spaghetti with Meat Sauce
  '5684935f-ef07-4cd4-a881-40aec2456e91.jpeg': '6a28a3e2d5af7a7a998c84e5', // Halwo
  '5d5fd955-91a3-41f2-a47a-ab37275a090f.jpeg': '6a28a3e2d5af7a7a998c84f9', // Coffee
  '6c7dfff4-f5da-4f01-a10e-5ce6bb20cb69.jpeg': '6a28a3e2d5af7a7a998c84e7', // Family Rice & Meat Tray
  '763b8bca-5970-42a8-b36b-1a635fe96859.jpeg': '6a28a3e2d5af7a7a998c84da', // Goat Meat Plate
  '848ba336-88de-4450-8b41-6ba0e00b23f3.jpeg': '6a28a3e2d5af7a7a998c84eb', // Chicken Pizza
  'c58471e3-a9b4-4159-afad-f0994a5d5056.jpeg': '6a28a3e2d5af7a7a998c84e0', // Crispy French Fries
  'c719bd05-229d-43f3-a3b7-fc0185523c09.jpeg': '6a28a3e2d5af7a7a998c84e1', // Soft Flatbread (Chapati)
  'c82eb5c4-dc26-4d29-8f9c-537b992407ce.jpeg': '6a28a3e2d5af7a7a998c84ea', // Pepperoni Pizza
  'img1.jpeg': '6a28a3e2d5af7a7a998c84e3' // Fresh Garden Salad
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  for (const [filename, menuItemId] of Object.entries(MATCHES)) {
    const filePath = path.join(IMAGES_DIR, filename);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'bariis-pizza-menu',
        public_id: menuItemId
      });

      const item = await MenuItem.findByIdAndUpdate(
        menuItemId,
        { image: result.secure_url },
        { new: true }
      );

      console.log(`✅ ${item ? item.name : menuItemId} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed for ${filename}:`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
})();
