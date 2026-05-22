const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer — memory storage, then stream to Cloudinary ────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'bariis-pizza/menu',
        transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// ── Public: Get all menu items ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Public: Get featured items ─────────────────────────────────────────────
router.get('/featured', async (req, res) => {
  try {
    const items = await MenuItem.find({ featured: true, available: true }).limit(8);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── FORCE RESET — delete this route after use ──────────────────────────────
router.get('/force-reset', async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    const defaults = [
      { name: 'Chicken Stir-Fry (Digaag Suqaar)', description: 'Tender chicken sauteed with peppers & onions. Served with seasoned rice, salad & house sauce.', price: 17.99, category: 'somali-plates', featured: true, available: true, tags: ['halal', 'popular'] },
      { name: 'Beef Stir-Fry (Hilib Loaad Suqaar)', description: 'Seasoned beef sauteed with vegetables. Served with seasoned rice, salad & house sauce.', price: 18.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Grilled Chicken Breast (Digaag Steak)', description: 'Marinated grilled chicken breast. Served with seasoned rice, salad & house sauce.', price: 18.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Grilled Beef Steak (Beef Steak)', description: 'Juicy seasoned beef steak. Served with seasoned rice, salad & house sauce.', price: 19.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Goat Meat Plate (Hilib Ari / Awlal)', description: 'Slow-cooked Somali goat meat. Served with seasoned rice, salad & house sauce.', price: 21.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Grilled Salmon Plate (Salmon Fish)', description: 'Seasoned salmon fillet grilled to perfection. Served with seasoned rice, salad & house sauce.', price: 19.99, category: 'somali-plates', available: true, tags: ['halal', 'seafood'] },
      { name: 'T-Bone Steak (T-Bone Hilib)', description: 'Tasty T-bone steak served with rice & salad.', price: 23.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Lunch Special - Chicken or Beef Rice Plate + Drink', description: 'Chicken or Beef Rice Plate with a drink. Available Mon-Fri 11:00 AM - 2:00 PM only.', price: 14.99, category: 'somali-plates', available: true, tags: ['halal', 'lunch', 'deal'] },
      { name: 'Somali Meat Pastry - 1 pc (Sambusa)', description: 'One crispy Somali meat pastry, fried to golden perfection.', price: 2.50, category: 'somali-plates', available: true, tags: ['halal', 'snack'] },
      { name: 'Somali Meat Pastry - 3 pcs (Sambusa)', description: 'Three crispy Somali meat pastries, fried to golden perfection.', price: 6.99, category: 'somali-plates', available: true, tags: ['halal', 'snack'] },
      { name: 'Crispy French Fries (Baradho Fries)', description: 'Golden crispy French fries.', price: 5.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Soft Flatbread (Chapati)', description: 'Fresh homemade soft flatbread.', price: 2.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Soup (Maraq)', description: 'Traditional Somali bone broth soup.', price: 3.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Fresh Garden Salad', description: 'Fresh garden salad.', price: 4.99, category: 'somali-plates', available: true, tags: ['vegetarian'] },
      { name: 'Malawah (Malawax)', description: 'Somali sweet crepe, soft and delicious.', price: 4.99, category: 'somali-plates', available: true, tags: ['halal', 'dessert'] },
      { name: 'Halwo (Somali Halwa)', description: 'Traditional Somali sweet halwa.', price: 4.99, category: 'somali-plates', available: true, tags: ['halal', 'dessert'] },
      { name: 'Ice Cream', description: 'Creamy ice cream - assorted flavors.', price: 4.99, category: 'somali-plates', available: true, tags: ['dessert'] },
      { name: 'Family Rice & Meat Tray (Saxan Qoys) - Serves 4', description: 'Large family tray of rice and meat - serves 4 people.', price: 49.99, category: 'somali-plates', available: true, tags: ['halal', 'family'] },
      { name: 'Pizza + Sambusa + Drinks Combo (Combo Qoys)', description: 'Pizza with Sambusa and drinks combo for the whole family.', price: 34.99, category: 'somali-plates', available: true, tags: ['halal', 'family', 'deal'] },
      { name: 'Cheese Pizza', description: 'Classic halal cheese pizza with rich tomato sauce and mozzarella.', price: 14.99, category: 'pizza', available: true, tags: ['halal', 'vegetarian'] },
      { name: 'Pepperoni Pizza (Halal Pepperoni)', description: 'Halal pepperoni with mozzarella and tomato sauce.', price: 17.99, category: 'pizza', featured: true, available: true, tags: ['halal', 'popular'] },
      { name: 'Chicken Pizza', description: 'Grilled chicken with mozzarella, peppers, onions & special sauce.', price: 18.99, category: 'pizza', available: true, tags: ['halal'] },
      { name: 'Meat Lovers Pizza (Mixed Meat)', description: 'Loaded with mixed halal meats, mozzarella and tomato sauce.', price: 19.99, category: 'pizza', available: true, tags: ['halal'] },
      { name: 'Veggie Pizza (Vegetarian)', description: 'Mushrooms, peppers, onions, olives, tomatoes & mozzarella.', price: 16.99, category: 'pizza', available: true, tags: ['halal', 'vegetarian'] },
      { name: 'Pasta with Chicken (Baasto Digaag)', description: 'Pasta cooked with tender chicken in a rich sauce.', price: 16.99, category: 'pasta', available: true, tags: ['halal'] },
      { name: 'Pasta with Beef (Baasto Hilib)', description: 'Pasta cooked with seasoned beef in a rich sauce.', price: 17.99, category: 'pasta', available: true, tags: ['halal'] },
      { name: 'Spaghetti with Meat Sauce (Baasto Suugo)', description: 'Spaghetti in a rich Somali-style meat sauce.', price: 15.99, category: 'pasta', available: true, tags: ['halal'] },
      { name: 'Ugali with Beef Stew (Ugali iyo Hilib)', description: 'East African maize ugali served with hearty beef stew.', price: 17.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      { name: 'Ugali with Chicken Stew (Ugali iyo Digaag)', description: 'East African maize ugali served with tender chicken stew.', price: 16.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      { name: 'Fufu with Goat Soup (Fufu iyo Maraq Ari)', description: 'West African fufu served with slow-cooked goat soup.', price: 19.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      { name: 'Fufu with Beef Soup (Fufu iyo Maraq Hilib)', description: 'West African fufu served with rich beef soup.', price: 18.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      { name: 'Somali Spiced Tea (Shaah Somali)', description: 'Traditional Somali spiced tea.', price: 2.99, category: 'drinks', available: true, tags: ['popular'] },
      { name: 'Mango Juice (Casiir Cambe)', description: 'Fresh mango juice.', price: 3.99, category: 'drinks', available: true, tags: [] },
      { name: 'Soft Drinks / Pop (Cabitaan Qabow)', description: 'Pepsi, 7UP, Sprite and more.', price: 2.50, category: 'drinks', available: true, tags: [] },
      { name: 'Water (Biyo)', description: 'Bottled water.', price: 1.99, category: 'drinks', available: true, tags: [] },
      { name: 'Coffee (Qaxwo)', description: 'Hot coffee.', price: 2.99, category: 'drinks', available: true, tags: [] },
      { name: 'Chicken Nuggets & Fries', description: 'Crispy chicken nuggets served with fries. For kids 12 & under.', price: 7.99, category: 'kids-menu', available: true, tags: ['halal', 'kids'] },
      { name: 'Kids Cheese Pizza', description: 'Small cheese pizza. For kids 12 & under.', price: 7.99, category: 'kids-menu', available: true, tags: ['halal', 'kids'] },
      { name: 'Kids Spaghetti (Baasto)', description: 'Spaghetti with tomato meat sauce. For kids 12 & under.', price: 7.99, category: 'kids-menu', available: true, tags: ['halal', 'kids'] },
    ];
    const inserted = await MenuItem.insertMany(defaults);
    res.json({ message: `Done! Deleted old menu and inserted ${inserted.length} new items.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Public: Get single item ────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: Create menu item ────────────────────────────────────────────────
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = await uploadToCloudinary(req.file.buffer);
    }
    if (data.sizes) data.sizes = JSON.parse(data.sizes);
    if (data.tags)  data.tags  = JSON.parse(data.tags);
    const item = await MenuItem.create(data);
    res.status(201).json(item);
  } catch (err) {
    console.error('Create error:', JSON.stringify(err));
    res.status(400).json({ message: err.message || 'Failed to create item' });
  }
});

// ── Admin: Update menu item ────────────────────────────────────────────────
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = await uploadToCloudinary(req.file.buffer);
    }
    if (data.sizes) data.sizes = JSON.parse(data.sizes);
    if (data.tags)  data.tags  = JSON.parse(data.tags);
    const item = await MenuItem.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Update error:', JSON.stringify(err));
    res.status(400).json({ message: err.message || 'Failed to update item' });
  }
});

// ── Admin: Delete menu item ────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: Seed default menu ───────────────────────────────────────────────
router.post('/seed/default', protect, async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    const defaults = [
      // SOMALI PLATES
      { name: 'Chicken Stir-Fry (Digaag Suqaar)', description: 'Tender chicken sauteed with peppers & onions. Served with seasoned rice, salad & house sauce.', price: 17.99, category: 'somali-plates', featured: true, available: true, tags: ['halal', 'popular'] },
      { name: 'Beef Stir-Fry (Hilib Loaad Suqaar)', description: 'Seasoned beef sauteed with vegetables. Served with seasoned rice, salad & house sauce.', price: 18.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Grilled Chicken Breast (Digaag Steak)', description: 'Marinated grilled chicken breast. Served with seasoned rice, salad & house sauce.', price: 18.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Grilled Beef Steak (Beef Steak)', description: 'Juicy seasoned beef steak. Served with seasoned rice, salad & house sauce.', price: 19.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Goat Meat Plate (Hilib Ari / Awlal)', description: 'Slow-cooked Somali goat meat. Served with seasoned rice, salad & house sauce.', price: 21.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Grilled Salmon Plate (Salmon Fish)', description: 'Seasoned salmon fillet grilled to perfection. Served with seasoned rice, salad & house sauce.', price: 19.99, category: 'somali-plates', available: true, tags: ['halal', 'seafood'] },
      { name: 'T-Bone Steak (T-Bone Hilib)', description: 'Tasty T-bone steak served with rice & salad.', price: 23.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Lunch Special - Chicken or Beef Rice Plate + Drink', description: 'Chicken or Beef Rice Plate with a drink. Available Mon-Fri 11:00 AM - 2:00 PM only.', price: 14.99, category: 'somali-plates', available: true, tags: ['halal', 'lunch', 'deal'] },
      { name: 'Somali Meat Pastry - 1 pc (Sambusa)', description: 'One crispy Somali meat pastry, fried to golden perfection.', price: 2.50, category: 'somali-plates', available: true, tags: ['halal', 'snack'] },
      { name: 'Somali Meat Pastry - 3 pcs (Sambusa)', description: 'Three crispy Somali meat pastries, fried to golden perfection.', price: 6.99, category: 'somali-plates', available: true, tags: ['halal', 'snack'] },
      { name: 'Crispy French Fries (Baradho Fries)', description: 'Golden crispy French fries.', price: 5.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Soft Flatbread (Chapati)', description: 'Fresh homemade soft flatbread.', price: 2.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Soup (Maraq)', description: 'Traditional Somali bone broth soup.', price: 3.99, category: 'somali-plates', available: true, tags: ['halal'] },
      { name: 'Fresh Garden Salad', description: 'Fresh garden salad.', price: 4.99, category: 'somali-plates', available: true, tags: ['vegetarian'] },
      { name: 'Malawah (Malawax)', description: 'Somali sweet crepe, soft and delicious.', price: 4.99, category: 'somali-plates', available: true, tags: ['halal', 'dessert', 'sweet'] },
      { name: 'Halwo (Somali Halwa)', description: 'Traditional Somali sweet halwa.', price: 4.99, category: 'somali-plates', available: true, tags: ['halal', 'dessert', 'sweet'] },
      { name: 'Ice Cream', description: 'Creamy ice cream - assorted flavors.', price: 4.99, category: 'somali-plates', available: true, tags: ['dessert'] },
      { name: 'Family Rice & Meat Tray (Saxan Qoys) - Serves 4', description: 'Large family tray of rice and meat - serves 4 people.', price: 49.99, category: 'somali-plates', available: true, tags: ['halal', 'family'] },
      { name: 'Pizza + Sambusa + Drinks Combo (Combo Qoys)', description: 'Pizza with Sambusa and drinks combo for the whole family.', price: 34.99, category: 'somali-plates', available: true, tags: ['halal', 'family', 'deal'] },
      // PIZZA
      { name: 'Cheese Pizza', description: 'Classic halal cheese pizza with rich tomato sauce and mozzarella.', price: 14.99, category: 'pizza', available: true, tags: ['halal', 'vegetarian'] },
      { name: 'Pepperoni Pizza (Halal Pepperoni)', description: 'Halal pepperoni with mozzarella and tomato sauce.', price: 17.99, category: 'pizza', featured: true, available: true, tags: ['halal', 'popular'] },
      { name: 'Chicken Pizza', description: 'Grilled chicken with mozzarella, peppers, onions & special sauce.', price: 18.99, category: 'pizza', available: true, tags: ['halal'] },
      { name: 'Meat Lovers Pizza (Mixed Meat)', description: 'Loaded with mixed halal meats, mozzarella and tomato sauce.', price: 19.99, category: 'pizza', available: true, tags: ['halal'] },
      { name: 'Veggie Pizza (Vegetarian)', description: 'Mushrooms, peppers, onions, olives, tomatoes & mozzarella.', price: 16.99, category: 'pizza', available: true, tags: ['halal', 'vegetarian'] },
      // PASTA
      { name: 'Pasta with Chicken (Baasto Digaag)', description: 'Pasta cooked with tender chicken in a rich sauce.', price: 16.99, category: 'pasta', available: true, tags: ['halal'] },
      { name: 'Pasta with Beef (Baasto Hilib)', description: 'Pasta cooked with seasoned beef in a rich sauce.', price: 17.99, category: 'pasta', available: true, tags: ['halal'] },
      { name: 'Spaghetti with Meat Sauce (Baasto Suugo)', description: 'Spaghetti in a rich Somali-style meat sauce.', price: 15.99, category: 'pasta', available: true, tags: ['halal'] },
      // UGALI & FUFU
      { name: 'Ugali with Beef Stew (Ugali iyo Hilib)', description: 'East African maize ugali served with hearty beef stew.', price: 17.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      { name: 'Ugali with Chicken Stew (Ugali iyo Digaag)', description: 'East African maize ugali served with tender chicken stew.', price: 16.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      { name: 'Fufu with Goat Soup (Fufu iyo Maraq Ari)', description: 'West African fufu served with slow-cooked goat soup.', price: 19.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      { name: 'Fufu with Beef Soup (Fufu iyo Maraq Hilib)', description: 'West African fufu served with rich beef soup.', price: 18.99, category: 'ugali-fufu', available: true, tags: ['halal'] },
      // DRINKS
      { name: 'Somali Spiced Tea (Shaah Somali)', description: 'Traditional Somali spiced tea.', price: 2.99, category: 'drinks', available: true, tags: ['popular'] },
      { name: 'Mango Juice (Casiir Cambe)', description: 'Fresh mango juice.', price: 3.99, category: 'drinks', available: true, tags: [] },
      { name: 'Soft Drinks / Pop (Cabitaan Qabow)', description: 'Pepsi, 7UP, Sprite and more.', price: 2.50, category: 'drinks', available: true, tags: [] },
      { name: 'Water (Biyo)', description: 'Bottled water.', price: 1.99, category: 'drinks', available: true, tags: [] },
      { name: 'Coffee (Qaxwo)', description: 'Hot coffee.', price: 2.99, category: 'drinks', available: true, tags: [] },
      // KIDS MENU
      { name: 'Chicken Nuggets & Fries', description: 'Crispy chicken nuggets served with fries. For kids 12 & under.', price: 7.99, category: 'kids-menu', available: true, tags: ['halal', 'kids'] },
      { name: 'Kids Cheese Pizza', description: 'Small cheese pizza. For kids 12 & under.', price: 7.99, category: 'kids-menu', available: true, tags: ['halal', 'kids'] },
      { name: 'Kids Spaghetti (Baasto)', description: 'Spaghetti with tomato meat sauce. For kids 12 & under.', price: 7.99, category: 'kids-menu', available: true, tags: ['halal', 'kids'] },
    ];
    await MenuItem.insertMany(defaults);
    res.json({ message: `Seeded ${defaults.length} items successfully` });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;