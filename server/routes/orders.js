const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// ─── Email Notification Helper ───────────────────────────────────────────────
const sendOrderNotification = async (order) => {
  try {
    const {
      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
      NOTIFY_EMAIL
    } = process.env;

    // If SMTP not configured, skip silently (don't crash order placement)
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !NOTIFY_EMAIL) {
      console.log('⚠️  Email notification skipped — SMTP env vars not set.');
      return;
    }

    const transporter = nodemailer.createTransporter({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT) || 587,
      secure: parseInt(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const itemsList = order.items
      .map(i => `• ${i.name}${i.size ? ` (${i.size})` : ''} × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n');

    const emailBody = `
🍽️  NEW ORDER — Bariis Halal & Pizza House
==========================================

Order ID  : ${order._id.toString().slice(-8).toUpperCase()}
Type      : ${order.orderType.toUpperCase()}
Time      : ${new Date(order.createdAt).toLocaleString('en-CA', { timeZone: 'America/Halifax' })}

CUSTOMER
--------
Name      : ${order.customerName}
Phone     : ${order.customerPhone}
${order.customerEmail ? `Email     : ${order.customerEmail}` : ''}
${order.deliveryAddress ? `Address   : ${order.deliveryAddress}` : ''}

ORDER ITEMS
-----------
${itemsList}

TOTAL     : $${order.totalAmount.toFixed(2)}
Payment   : ${order.paymentMethod.toUpperCase()}

${order.specialInstructions ? `SPECIAL INSTRUCTIONS\n--------------------\n${order.specialInstructions}` : ''}

==========================================
Login to admin dashboard to manage this order.
`;

    await transporter.sendMail({
      from: `"Bariis Order System" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `🔔 New ${order.orderType} Order — ${order.customerName} ($${order.totalAmount.toFixed(2)})`,
      text: emailBody,
    });

    console.log(`✅ Order notification email sent to ${NOTIFY_EMAIL}`);
  } catch (err) {
    // Log but never crash order creation
    console.error('❌ Email notification error:', err.message);
  }
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// Public: Place order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    // Fire-and-forget email notification
    sendOrderNotification(order);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Public: Track order
router.get('/track/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all orders
router.get('/', protect, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end   = new Date(date); end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get new order count since timestamp (used for polling)
router.get('/new-since', protect, async (req, res) => {
  try {
    const { since } = req.query;
    if (!since) return res.json({ count: 0, orders: [] });
    const newOrders = await Order.find({
      createdAt: { $gt: new Date(since) },
      status: 'pending'
    }).sort({ createdAt: -1 });
    res.json({ count: newOrders.length, orders: newOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update order status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get stats
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalOrders, todayOrders, revenue, pending] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.countDocuments({ status: 'pending' })
    ]);
    res.json({
      totalOrders,
      todayOrders,
      totalRevenue: revenue[0]?.total || 0,
      pendingOrders: pending
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;