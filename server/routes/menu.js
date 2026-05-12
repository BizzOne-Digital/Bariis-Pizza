const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer → Cloudinary storage ────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bariis-pizza/menu',   // images saved under this folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

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
    // Cloudinary returns the full secure URL in req.file.path
    if (req.file) data.image = req.file.path;
    if (data.sizes) data.sizes = JSON.parse(data.sizes);
    if (data.tags)  data.tags  = JSON.parse(data.tags);
    const item = await MenuItem.create(data);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── Admin: Update menu item ────────────────────────────────────────────────
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      const old = await MenuItem.findById(req.params.id);
      if (old?.image && old.image.includes('cloudinary')) {
        const publicId = old.image.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
        await cloudinary.uploader.destroy(publicId).catch(() => {}); // best-effort
      }
      data.image = req.file.path;
    }
    if (data.sizes) data.sizes = JSON.parse(data.sizes);
    if (data.tags)  data.tags  = JSON.parse(data.tags);
    const item = await MenuItem.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── Admin: Delete menu item ────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    // Delete image from Cloudinary
    if (item.image && item.image.includes('cloudinary')) {
      const publicId = item.image.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
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
      // Somali Rice
      { name: 'Bariis & Suqaar', description: 'Aromatic rice cooked with spices, served with tender goat meat and our special red sauce.', price: 16.99, category: 'somali-rice', featured: true, tags: ['halal', 'popular'] },
      { name: 'Bariis & Hilib', description: 'Fragrant rice served with tender beef and savory sauce.', price: 15.99, category: 'somali-rice', tags: ['halal'] },
      { name: 'Bariis & Kuku', description: 'Delicious spiced rice served with grilled chicken.', price: 14.99, category: 'somali-rice', tags: ['halal'] },
      { name: 'Bariis & Kalluun', description: 'Flavorful rice served with seasoned fish.', price: 16.99, category: 'somali-rice', tags: ['halal', 'seafood'] },
      { name: 'Vegetable Rice', description: 'Aromatic rice with mixed vegetables and spices.', price: 12.99, category: 'somali-rice', tags: ['halal', 'vegetarian'] },
      // Somali Specialties
      { name: 'Suqaar', description: 'Tender goat meat sautéed with onions, peppers and spices.', price: 16.99, category: 'somali-specialties', featured: true, tags: ['halal'] },
      { name: 'Hilib Igu Dheer', description: 'Slow cooked beef with traditional Somali spices.', price: 15.99, category: 'somali-specialties', tags: ['halal'] },
      { name: 'Kuku Iskukaris', description: 'Flavorful chicken stew cooked with vegetables.', price: 14.99, category: 'somali-specialties', tags: ['halal'] },
      { name: 'Canjeero', description: 'Somali style thin pancakes served with honey or sugar.', price: 7.99, category: 'somali-specialties', tags: ['halal', 'breakfast'] },
      { name: 'Lahmoon (Canjeero Kuku)', description: 'Canjeero topped with minced meat, onions and spices.', price: 10.99, category: 'somali-specialties', tags: ['halal'] },
      { name: 'Somali Spaghetti (Baasto)', description: 'Spaghetti cooked in a rich tomato sauce with meat and spices.', price: 13.99, category: 'somali-specialties', tags: ['halal'] },
      // Pizza
      { name: 'Chicken Pizza', description: 'Grilled chicken, mozzarella, peppers, onions & special sauce.', price: 16.99, category: 'pizza', featured: true, sizes: [{ label: 'Small', price: 12.99 }, { label: 'Medium', price: 16.99 }, { label: 'Large', price: 20.99 }], tags: ['halal', 'popular'] },
      { name: 'Meat Lovers Pizza', description: 'Beef, chicken, pepperoni, mozzarella cheese.', price: 17.99, category: 'pizza', sizes: [{ label: 'Small', price: 13.99 }, { label: 'Medium', price: 17.99 }, { label: 'Large', price: 21.99 }], tags: ['halal'] },
      { name: 'Veggie Pizza', description: 'Mushrooms, peppers, onions, olives, tomatoes & mozzarella.', price: 15.99, category: 'pizza', sizes: [{ label: 'Small', price: 11.99 }, { label: 'Medium', price: 15.99 }, { label: 'Large', price: 19.99 }], tags: ['halal', 'vegetarian'] },
      { name: 'Hawaiian Pizza', description: 'Chicken, pineapple, mozzarella & pizza sauce.', price: 15.99, category: 'pizza', sizes: [{ label: 'Small', price: 11.99 }, { label: 'Medium', price: 15.99 }, { label: 'Large', price: 19.99 }], tags: ['halal'] },
      { name: 'Supreme Pizza', description: 'Beef, chicken, peppers, onions, olives, mushrooms & mozzarella.', price: 16.99, category: 'pizza', sizes: [{ label: 'Small', price: 12.99 }, { label: 'Medium', price: 16.99 }, { label: 'Large', price: 20.99 }], tags: ['halal'] },
      { name: 'BBQ Chicken Pizza', description: 'BBQ sauce, grilled chicken, onions, cheese.', price: 16.99, category: 'pizza', sizes: [{ label: 'Small', price: 12.99 }, { label: 'Medium', price: 16.99 }, { label: 'Large', price: 20.99 }], tags: ['halal'] },
      // Sambusa & Snacks
      { name: 'Sambusa (3 pcs)', description: 'Crispy pastry filled with seasoned beef or chicken.', price: 6.99, category: 'sambusa-snacks', featured: true, tags: ['halal', 'snack'] },
      // Sides
      { name: 'Chapati (2 pcs)', description: 'Fresh homemade flatbread.', price: 2.99, category: 'sides', tags: ['halal'] },
      { name: 'Maraq (Soup)', description: 'Traditional Somali bone broth soup.', price: 4.99, category: 'sides', tags: ['halal'] },
      { name: 'Salad', description: 'Fresh garden salad.', price: 3.99, category: 'sides', tags: ['vegetarian'] },
      { name: 'French Fries', description: 'Crispy golden fries.', price: 3.49, category: 'sides', tags: [] },
      // Drinks
      { name: 'Somali Tea', description: 'Traditional spiced Somali tea.', price: 2.99, category: 'drinks', tags: ['popular'] },
      { name: 'Mango Juice', description: 'Fresh mango juice.', price: 3.49, category: 'drinks' },
      { name: 'Can Drinks', description: 'Pepsi, 7UP, Sprite, and more.', price: 1.99, category: 'drinks' },
      { name: 'Water Bottle', description: 'Bottled water.', price: 1.50, category: 'drinks' },
      { name: 'Milk Shake', description: 'Creamy milkshake — assorted flavors.', price: 4.99, category: 'drinks' },
      // Combos / Lunch Specials
      { name: 'Combo 1 — Bariis & Suqaar', description: 'Bariis & Suqaar + Salad + Drink. Best value!', price: 20.99, category: 'combos', featured: true, tags: ['deal', 'popular', 'halal'] },
      { name: 'Combo 2 — Pizza Deal', description: 'Any Pizza + Fries + Drink.', price: 19.99, category: 'combos', tags: ['deal', 'halal'] },
      { name: 'Combo 3 — Bariis & Hilib', description: 'Bariis & Hilib + Sambusa (3pcs) + Drink.', price: 19.99, category: 'combos', tags: ['deal', 'halal'] },
      { name: 'Lunch Special — Bariis & Drink', description: 'Any Bariis dish with a can drink. Available 11 AM – 3 PM, Monday to Friday.', price: 13.99, category: 'combos', tags: ['halal', 'lunch', 'deal'] },
      { name: 'Lunch Special — Pizza Slice & Drink', description: 'Two pizza slices with a can drink. Quick and filling. Available 11 AM – 3 PM.', price: 10.99, category: 'combos', tags: ['halal', 'lunch', 'deal'] },
      // Family Platters
      { name: 'Family Bariis Platter', description: 'Large platter of fragrant Somali rice with a choice of goat, beef or chicken — serves 4–5 people.', price: 59.99, category: 'family-platters', tags: ['halal', 'family', 'large'] },
      { name: 'Mixed Grill Family Platter', description: 'A generous spread of Suqaar, grilled Kuku, Sambusa and Chapati — perfect for the whole family.', price: 69.99, category: 'family-platters', tags: ['halal', 'family', 'sharing'] },
      { name: 'Pizza Family Deal', description: '2 Large pizzas of your choice with fries and 4 drinks — the ideal family night.', price: 54.99, category: 'family-platters', tags: ['halal', 'family', 'pizza'] },
      { name: 'Catering Platter — Bariis & Suqaar', description: 'Large catering tray of Bariis & Suqaar — ideal for weddings, birthdays and events. Serves 8–10.', price: 99.99, category: 'family-platters', tags: ['halal', 'catering', 'events'] }
    ];
    await MenuItem.insertMany(defaults);
    res.json({ message: `Seeded ${defaults.length} items` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;