# 🍽️ Bariis & Pizza House — Full Stack Website

**African Love, Somali Soul** | Authentic Somali & Halal Cuisine with Pizza

> Full MERN Stack (MongoDB + Express + React + Node.js) restaurant website with Admin Panel

---

## 📁 Project Structure

```
bariis-pizza/
├── client/                  # React Frontend
│   ├── public/
│   │   └── index.html       # SEO-optimized HTML
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx   # Sticky responsive navbar
│       │   ├── Footer.jsx   # Full footer with links
│       │   └── MenuCard.jsx # Food item card with cart
│       ├── context/
│       │   ├── AuthContext.jsx  # Admin authentication
│       │   └── CartContext.jsx  # Shopping cart state
│       ├── pages/
│       │   ├── Home.jsx         # Homepage with hero, features
│       │   ├── Menu.jsx         # Full menu with filters & search
│       │   ├── Order.jsx        # Cart + checkout + delivery links
│       │   ├── Gallery.jsx      # Food photo gallery
│       │   ├── Contact.jsx      # Contact form + map + hours
│       │   ├── AdminLogin.jsx   # Admin login/register
│       │   └── AdminDashboard.jsx # Full admin panel
│       ├── services/
│       │   └── api.js           # All API calls
│       ├── App.jsx              # Routes + providers
│       ├── index.js             # React entry point
│       └── index.css            # Global styles + branding
│
└── server/                  # Node.js Backend
    ├── models/
    │   ├── User.js          # Admin user model
    │   ├── MenuItem.js      # Menu item model
    │   ├── Order.js         # Customer order model
    │   └── Settings.js      # Restaurant settings model
    ├── routes/
    │   ├── auth.js          # Login, register, JWT
    │   ├── menu.js          # CRUD menu items + seed
    │   ├── orders.js        # Place/track/manage orders
    │   └── settings.js      # Restaurant settings CRUD
    ├── middleware/
    │   └── auth.js          # JWT protection middleware
    ├── uploads/             # Uploaded menu images (auto-created)
    ├── index.js             # Express server entry
    ├── .env.example         # Environment variables template
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (free cloud): https://cloud.mongodb.com

---

### Step 1 — Clone & Install

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 2 — Configure Environment

```bash
# In the server folder, create .env file:
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bariis_pizza
JWT_SECRET=your_secret_key_here_change_this
NODE_ENV=development
```

**Using MongoDB Atlas (cloud)?** Replace MONGO_URI with your Atlas connection string:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bariis_pizza
```

---

### Step 3 — Start the Application

**Option A: Run both together (recommended)**
```bash
# From root folder:
npm run dev
```
np ur  ai no   arina aon

**Option B: Run separately**
```bash
# Terminal 1 - Backend:
cd server
npm run dev

# Terminal 2 - Frontend:
cd client
npm start
```

The website will open at: **http://localhost:3000**
The API runs at: **http://localhost:5000/api**

---

### Step 4 — First Time Admin Setup

1. Go to: **http://localhost:3000/admin/login**
2. Click **"First Setup"** tab
3. Create your admin account (name, email, password)
4. You're now logged into the Admin Panel!

---

### Step 5 — Seed the Menu

After logging into admin:
1. Go to **Dashboard** → click **"Seed Default Menu"**
2. OR in Admin Panel → Menu tab → click **"🌱 Seed Defaults"**

This loads all menu items from the PDF (28 items) automatically!

---

## 🌐 Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Hero, features, featured dishes, story |
| Menu | `/menu` | Full menu with search & category filters |
| Order Online | `/order` | Cart, checkout, DoorDash/Uber Eats links |
| Gallery | `/gallery` | Food photo gallery by category |
| Contact | `/contact` | Map, hours, contact form, social links |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Panel | `/admin` | Full restaurant management dashboard |

---

## 🔧 Admin Panel Features

### 📊 Dashboard
- Total orders, today's orders, revenue, pending orders
- Quick action buttons

### 🍽️ Menu Management
- Add / Edit / Delete menu items
- Upload item photos
- Set prices, descriptions, categories
- Toggle available/featured status
- Add pizza sizes (Small/Medium/Large with individual prices)
- Seed default menu from PDF data

### 📦 Order Management
- View all orders in real-time
- Filter by status (pending, confirmed, preparing, ready, delivered)
- Update order status with dropdown
- See customer name, phone, items, total

### ⚙️ Settings
- Update restaurant name, phone, email, address
- Set DoorDash, Uber Eats, Skip The Dishes links
- Update social media links (Facebook, Instagram, TikTok)
- Toggle online ordering on/off
- Set pickup time estimate

---

## 📋 Menu Items (Pre-loaded from PDF)

### 🍚 Somali Rice
- Bariis & Suqaar — $16.99
- Bariis & Hilib — $15.99
- Bariis & Kuku — $14.99
- Bariis & Kalluun — $16.99
- Vegetable Rice — $12.99

### 🥘 Somali Specialties
- Suqaar — $16.99
- Hilib Igu Dheer — $15.99
- Kuku Iskukaris — $14.99
- Canjeero — $7.99
- Lahmoon (Canjeero Kuku) — $10.99
- Somali Spaghetti (Baasto) — $13.99

### 🍕 Pizza (Small / Medium / Large)
- Chicken Pizza — $12.99 / $16.99 / $20.99
- Meat Lovers Pizza — $13.99 / $17.99 / $21.99
- Veggie Pizza — $11.99 / $15.99 / $19.99
- Hawaiian Pizza — $11.99 / $15.99 / $19.99
- Supreme Pizza — $12.99 / $16.99 / $20.99
- BBQ Chicken Pizza — $12.99 / $16.99 / $20.99

### 🥟 Sambusa & Snacks
- Sambusa (3 pcs) — $6.99

### 🥗 Sides
- Chapati (2 pcs) — $2.99
- Maraq (Soup) — $4.99
- Salad — $3.99
- French Fries — $3.49

### 🍵 Drinks
- Somali Tea — $2.99
- Mango Juice — $3.49
- Can Drinks — $1.99
- Water Bottle — $1.50
- Milk Shake — $4.99

### 🎯 Combos
- Combo 1: Bariis & Suqaar + Salad + Drink — $20.99
- Combo 2: Any Pizza + Fries + Drink — $19.99
- Combo 3: Bariis & Hilib + Sambusa + Drink — $19.99

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create admin account |
| POST | `/api/auth/login` | Public | Login, returns JWT token |
| GET | `/api/auth/me` | Admin | Get current user |

### Menu
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/menu` | Public | Get all menu items |
| GET | `/api/menu/featured` | Public | Get featured items |
| GET | `/api/menu/:id` | Public | Get single item |
| POST | `/api/menu` | Admin | Create item (with image upload) |
| PUT | `/api/menu/:id` | Admin | Update item |
| DELETE | `/api/menu/:id` | Admin | Delete item |
| POST | `/api/menu/seed/default` | Admin | Seed default menu |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Public | Place new order |
| GET | `/api/orders/track/:id` | Public | Track order by ID |
| GET | `/api/orders` | Admin | Get all orders (filterable) |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |
| GET | `/api/orders/stats/summary` | Admin | Dashboard stats |

### Settings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/settings` | Public | Get restaurant settings |
| PUT | `/api/settings` | Admin | Update settings |

---

## 🌍 SEO Optimization

The website is optimized for:
- "halal food New Minas"
- "halal pizza New Minas"
- "Somali food Nova Scotia"
- "African restaurant Annapolis Valley"
- "restaurant near Kentville Wolfville"

Includes:
- ✅ Meta title and description
- ✅ Open Graph tags for social sharing
- ✅ Google structured data (JSON-LD Schema)
- ✅ Semantic HTML
- ✅ Mobile-first responsive design
- ✅ Fast loading (lazy images)

---

## 📱 Responsive Design

- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktop (1200px+)
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized menu cards
- ✅ Collapsible navbar on mobile

---

## 🚀 Deployment

### Recommended: Railway.app (Free)

**Backend (Server):**
1. Push code to GitHub
2. Create account on railway.app
3. New Project → Deploy from GitHub → Select `server` folder
4. Add environment variables (MONGO_URI, JWT_SECRET, PORT)
5. Your API URL: `https://your-app.railway.app`

**Frontend (Client):**
1. In `client/.env` set: `REACT_APP_API_URL=https://your-api.railway.app/api`
2. Run `npm run build` in client folder
3. Deploy `build` folder to Netlify or Vercel (free)

### Alternative: Render.com (Free)
- Same process, very straightforward

---

## 📞 Business Information

| Field | Value |
|-------|-------|
| Restaurant | Bariis & Pizza House |
| Phone | 902-292-9852 |
| Address | 9005 Commercial Street, New Minas, Nova Scotia |
| Hours | Monday – Sunday: 11:00 AM – 10:00 PM |
| Cuisine | Somali, Halal, African, Pizza |
| Services | Dine-In, Takeout, Delivery, Catering |
| Tagline | African Love, Somali Soul |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Framer Motion |
| Styling | Custom CSS with CSS Variables |
| Icons | React Icons (Feather Icons) |
| Toast | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| File Upload | Multer |
| Dev Tools | Nodemon, Concurrently |

---

*Built with ❤️ for Bariis & Pizza House — African Love, Somali Soul*

adminn  admin@bariispizza.com
Admin@1234
