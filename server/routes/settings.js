const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

const getOrCreate = async () => {
  let s = await Settings.findOne();
  if (!s) {
    s = await Settings.create({
      hours: {
        monday: { open: '11:00 AM', close: '10:00 PM', closed: false },
        tuesday: { open: '11:00 AM', close: '10:00 PM', closed: false },
        wednesday: { open: '11:00 AM', close: '10:00 PM', closed: false },
        thursday: { open: '11:00 AM', close: '10:00 PM', closed: false },
        friday: { open: '11:00 AM', close: '10:00 PM', closed: false },
        saturday: { open: '11:00 AM', close: '10:00 PM', closed: false },
        sunday: { open: '11:00 AM', close: '10:00 PM', closed: false }
      }
    });
  }
  return s;
};

// Public: Get settings
router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreate();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update settings
router.put('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
