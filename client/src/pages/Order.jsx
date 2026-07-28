import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  IconTrash,
  IconPlus,
  IconMinus,
  IconTruck,
  IconPackage,
  IconCheck,
  IconArrow
} from '../components/Icons';

import { useCart } from '../context/CartContext';
import { placeOrder, getSettings } from '../services/api';
import toast from 'react-hot-toast';

export default function OrderPage() {
  const { cart, removeItem, updateQty, clearCart, total, itemCount } = useCart();
  const [searchParams] = useSearchParams();

  const [settings, setSettings] = useState(null);

  const [step, setStep] = useState('cart');
  const [orderType, setOrderType] = useState(searchParams.get('type') === 'delivery' ? 'delivery' : 'pickup');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getSettings();
        setSettings(res.data);
      } catch (err) {
        console.log('Settings load error:', err);
      }
    };

    loadSettings();
  }, []);

  const PLATFORMS = [
    {
      name: 'DoorDash',
      color: '#FF3008',
      url: settings?.deliveryLinks?.doordash || '#'
    },
    {
      name: 'Uber Eats',
      color: '#06C167',
      url: settings?.deliveryLinks?.ubereats || '#'
    },
    {
      name: 'Skip The Dishes',
      color: '#FF6900',
      url: settings?.deliveryLinks?.skipthedishes || '#'
    }
  ];

  const phoneNumber = settings?.phone || '902-292-9852';

  const handleChange = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlace = async () => {
    if (!form.name.trim()) {
      return toast.error('Please enter your name');
    }

    if (!form.phone.trim()) {
      return toast.error('Please enter your phone number');
    }

    if (orderType === 'delivery' && !form.address.trim()) {
      return toast.error('Delivery address is required');
    }

    setPlacing(true);

    try {
      const res = await placeOrder({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        orderType,
        deliveryAddress: form.address,
        specialInstructions: form.notes,

        items: cart.items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size || ''
        })),

        totalAmount: total,
        paymentMethod: 'cash'
      });

      setOrderId(res.data._id);

      clearCart();

      setStep('confirm');
    } catch (err) {
      console.log(err);
      toast.error(`Could not place order. Please call us directly at ${phoneNumber}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="order-page pt-nav">
      <style>{`
        .order-page {
          min-height:100vh;
          background:var(--cream);
        }

        .order-hero {
          position:relative;
          height:260px;
          display:flex;
          align-items:flex-end;
          overflow:hidden;
        }

        .order-hero img.bg {
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .order-hero-overlay {
          position:absolute;
          inset:0;
          background:linear-gradient(
            0deg,
            rgba(14,40,24,0.92),
            rgba(14,40,24,0.35)
          );
        }

        .order-hero-text {
          position:relative;
          z-index:2;
          padding:2.5rem;
        }

        .order-hero-text h1 {
          font-family:var(--ff-display);
          font-size:clamp(1.8rem,3.5vw,2.8rem);
          font-weight:700;
          color:white;
        }

        .order-hero-text p {
          color:rgba(255,255,255,0.6);
          margin-top:6px;
          font-size:0.9rem;
        }

        .order-layout {
          max-width:1100px;
          margin:0 auto;
          padding:2.5rem 24px 5rem;
          display:grid;
          grid-template-columns:1fr 360px;
          gap:2rem;
          align-items:start;
        }

        .platforms-card,
        .cart-card,
        .checkout-card,
        .summary-card,
        .confirm-card {
          background:var(--white);
          border-radius:var(--r-lg);
          box-shadow:var(--sh-sm);
        }

        .platforms-card,
        .cart-card,
        .checkout-card {
          padding:1.75rem;
          margin-bottom:1.5rem;
        }

        .platforms-card h2,
        .cart-card h2,
        .checkout-card h2 {
          font-family:var(--ff-display);
          font-size:1.3rem;
          font-weight:700;
          color:var(--green);
          margin-bottom:6px;
        }

        .platforms-card p {
          font-size:0.83rem;
          color:var(--muted);
          margin-bottom:1.25rem;
        }

        .platform-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:10px;
        }

        .platform-btn {
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:8px;
          padding:14px 10px;
          border-radius:var(--r);
          border:1.5px solid var(--cream-dk);
          text-decoration:none;
          transition:all 0.2s;
          text-align:center;
        }

        .platform-btn:hover {
          border-color:var(--gold);
          transform:translateY(-2px);
          box-shadow:var(--sh-sm);
        }

        .p-name {
          font-weight:700;
          font-size:0.8rem;
          color:var(--ink-soft);
        }

        .p-arrow {
          font-size:0.7rem;
          color:var(--muted);
        }

        .divider-or {
          display:flex;
          align-items:center;
          gap:12px;
          margin:1.5rem 0;
          color:var(--muted);
          font-size:0.82rem;
          font-weight:500;
        }

        .divider-or::before,
        .divider-or::after {
          content:'';
          flex:1;
          height:1px;
          background:var(--cream-dk);
        }

        .cart-empty {
          text-align:center;
          padding:3rem 1rem;
        }

        .cart-item {
          display:flex;
          align-items:center;
          gap:14px;
          padding:12px 0;
          border-bottom:1px solid var(--cream-dk);
        }

        .cart-item:last-child {
          border-bottom:none;
        }

        .ci-thumb {
          width:54px;
          height:54px;
          border-radius:var(--r);
          overflow:hidden;
          flex-shrink:0;
          background:var(--cream-dk);
        }

        .ci-info {
          flex:1;
          min-width:0;
        }

        .ci-name {
          font-weight:600;
          font-size:0.9rem;
          color:var(--ink);
        }

        .ci-size {
          font-size:0.75rem;
          color:var(--muted);
          margin-top:2px;
        }

        .ci-price {
          font-weight:700;
          font-size:0.95rem;
          color:var(--green);
          min-width:60px;
          text-align:right;
          font-family:var(--ff-display);
        }

        .qty-ctrl {
          display:flex;
          align-items:center;
          gap:6px;
        }

        .qty-btn {
          width:26px;
          height:26px;
          border-radius:50%;
          border:1.5px solid var(--border-s);
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition:all 0.2s;
          color:var(--green);
          background:none;
        }

        .qty-btn:hover {
          background:var(--green);
          color:white;
          border-color:var(--green);
        }

        .qty-num {
          font-weight:700;
          font-size:0.9rem;
          min-width:20px;
          text-align:center;
        }

        .rm-btn {
          padding:4px;
          color:var(--cream-dk);
          transition:color 0.2s;
          cursor:pointer;
          background:none;
          border:none;
        }

        .rm-btn:hover {
          color:var(--red);
        }

        .cart-total {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 0 0;
          font-family:var(--ff-display);
          font-size:1.3rem;
          font-weight:700;
          color:var(--green);
          border-top:2px solid var(--cream-dk);
          margin-top:8px;
        }

        .cart-actions {
          display:flex;
          gap:10px;
          margin-top:1.25rem;
          justify-content:flex-end;
          flex-wrap:wrap;
        }

        .order-type-tabs {
          display:flex;
          gap:8px;
          margin-bottom:1.5rem;
        }

        .ot-btn {
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:7px;
          padding:11px;
          border-radius:var(--r);
          border:2px solid var(--cream-dk);
          font-weight:600;
          font-size:0.85rem;
          cursor:pointer;
          transition:all 0.2s;
          background:none;
        }

        .ot-btn.active {
          border-color:var(--green);
          background:var(--green);
          color:var(--gold-lt);
        }

        .form-row {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
        }

        .fg {
          margin-bottom:1rem;
        }

        .fg label {
          display:block;
          font-weight:600;
          font-size:0.8rem;
          color:var(--ink-soft);
          margin-bottom:5px;
        }

        .fg input,
        .fg textarea {
          width:100%;
          padding:10px 14px;
          border:1.5px solid var(--cream-dk);
          border-radius:var(--r);
          font-size:0.9rem;
          outline:none;
          transition:border-color 0.2s;
          background:var(--white);
        }

        .fg input:focus,
        .fg textarea:focus {
          border-color:var(--gold);
        }

        .required {
          color:var(--red);
        }

        .summary-card {
          padding:1.5rem;
          position:sticky;
          top:calc(var(--nav-h) + 16px);
        }

        .summary-card h3 {
          font-family:var(--ff-display);
          font-size:1.1rem;
          font-weight:700;
          color:var(--green);
          margin-bottom:1rem;
          padding-bottom:10px;
          border-bottom:1px solid var(--cream-dk);
        }

        .sum-row {
          display:flex;
          justify-content:space-between;
          font-size:0.85rem;
          padding:5px 0;
          color:var(--muted);
        }

        .sum-row.total {
          font-weight:700;
          font-size:1.05rem;
          color:var(--green);
          border-top:1px solid var(--cream-dk);
          margin-top:6px;
          padding-top:10px;
        }

        .sum-note {
          font-size:0.75rem;
          color:var(--muted);
          margin-top:10px;
          padding-top:10px;
          border-top:1px solid var(--cream-dk);
          line-height:1.6;
        }

        .confirm-card {
          padding:3rem 2rem;
          text-align:center;
        }

        .confirm-icon {
          width:72px;
          height:72px;
          border-radius:50%;
          background:var(--green);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 1.5rem;
        }

        .order-id-box {
          background:var(--cream);
          border:1px solid var(--cream-dk);
          border-radius:var(--r);
          padding:10px 20px;
          display:inline-block;
          font-family:monospace;
          font-size:0.85rem;
          color:var(--ink-soft);
          margin:1rem 0;
        }

        @media(max-width:900px){
          .order-layout{
            grid-template-columns:1fr;
          }

          .summary-card{
            position:static;
          }
        }

        @media(max-width:480px){
          .platform-grid{
            grid-template-columns:1fr;
          }

          .form-row{
            grid-template-columns:1fr;
          }

          .order-type-tabs{
            flex-direction:column;
          }
        }
      `}</style>

      {/* HERO */}
      <div className="order-hero">
        <img
          className="bg"
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
          alt="Order Online"
        />

        <div className="order-hero-overlay" />

        <div className="order-hero-text">
          <div className="section-label" style={{ marginBottom:'8px' }}>
            Bariis &amp; Pizza House
          </div>

          <h1>Order Online</h1>

          <p>Pickup · Delivery · DoorDash · Uber Eats</p>
        </div>
      </div>

      <div className="order-layout">

        {/* MAIN */}
        <div>

          {/* CART */}
          {step === 'cart' && (
            <div className="cart-card">

              <h2>
                Your Cart {itemCount > 0 && `(${itemCount} items)`}
              </h2>

              {cart.items.length === 0 ? (
                <div className="cart-empty">

                  <h3>Your cart is empty</h3>

                  <p
                    style={{
                      color:'var(--muted)',
                      marginBottom:'1.5rem',
                      fontSize:'0.875rem'
                    }}
                  >
                    Browse our menu and add your favourite dishes
                  </p>

                  <Link to="/menu" className="btn btn-gold">
                    Browse Menu <IconArrow size={15}/>
                  </Link>
                </div>
              ) : (
                <>
                  {cart.items.map((item) => (
                    <div
                      key={`${item._id}-${item.size}`}
                      className="cart-item"
                    >
                      <div className="ci-thumb" />

                      <div className="ci-info">
                        <div className="ci-name">
                          {item.name}
                        </div>

                        {item.size && (
                          <div className="ci-size">
                            Size: {item.size}
                          </div>
                        )}
                      </div>

                      <div className="qty-ctrl">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQty(
                              item._id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                        >
                          <IconMinus size={11}/>
                        </button>

                        <span className="qty-num">
                          {item.quantity}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQty(
                              item._id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                        >
                          <IconPlus size={11}/>
                        </button>
                      </div>

                      <div className="ci-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        className="rm-btn"
                        onClick={() =>
                          removeItem(item._id, item.size)
                        }
                      >
                        <IconTrash size={15}/>
                      </button>
                    </div>
                  ))}

                  <div className="cart-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="cart-actions">

                    <button
                      className="btn"
                      style={{
                        background:'var(--cream-dk)',
                        color:'var(--muted)'
                      }}
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>

                    <Link
                      to="/menu"
                      className="btn btn-outline-gold btn-sm"
                    >
                      Add More Items
                    </Link>

                    <button
                      className="btn btn-gold"
                      onClick={() => setStep('checkout')}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CHECKOUT */}
          {step === 'checkout' && (
            <div className="checkout-card">

              <h2>Your Details</h2>

              <div className="order-type-tabs">

                {[
                  ['pickup','Pickup'],
                  ['delivery','Delivery'],
                  ['dine-in','Dine-In']
                ].map(([v,l]) => (
                  <button
                    key={v}
                    className={`ot-btn${orderType===v ? ' active' : ''}`}
                    onClick={() => setOrderType(v)}
                  >
                    {v === 'pickup' ? (
                      <IconPackage size={15}/>
                    ) : (
                      <IconTruck size={15}/>
                    )}

                    <span>{l}</span>
                  </button>
                ))}
              </div>

              <div className="form-row">

                <div className="fg">
                  <label>
                    Full Name <span className="required">*</span>
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="fg">
                  <label>
                    Phone Number <span className="required">*</span>
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="902-XXX-XXXX"
                  />
                </div>
              </div>

              <div className="fg">
                <label>Email</label>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              {orderType === 'delivery' && (
                <div className="fg">
                  <label>
                    Delivery Address
                  </label>

                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full delivery address"
                  />
                </div>
              )}

              <div className="fg">
                <label>Special Instructions</label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div
                style={{
                  display:'flex',
                  gap:'10px',
                  justifyContent:'flex-end',
                  flexWrap:'wrap'
                }}
              >
                <button
                  className="btn btn-outline-gold btn-sm"
                  onClick={() => setStep('cart')}
                >
                  Back
                </button>

                <button
                  className="btn btn-gold"
                  onClick={handlePlace}
                  disabled={placing}
                >
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}

          {/* CONFIRM */}
          {step === 'confirm' && (
            <div className="confirm-card">

              <div className="confirm-icon">
                <IconCheck size={28} color="var(--gold)"/>
              </div>

              <h2>Order Confirmed!</h2>

              <p>
                Thank you, {form.name}
              </p>

              <div className="order-id-box">
                Order ID: {orderId?.slice(-8).toUpperCase()}
              </div>

              <p>
                We will call you at <strong>{form.phone}</strong>
              </p>

              <div
                style={{
                  display:'flex',
                  gap:'12px',
                  justifyContent:'center',
                  flexWrap:'wrap',
                  marginTop:'2rem'
                }}
              >
                <a
                  href={`tel:${phoneNumber}`}
                  className="btn btn-gold"
                >
                  Call Us
                </a>

                <Link
                  to="/menu"
                  className="btn btn-outline-gold"
                >
                  Order More
                </Link>
              </div>
            </div>
          )}

          {/* DELIVERY APPS */}
          {step !== 'confirm' && (
            <div className="platforms-card">
              <h2>Or Order via Delivery Apps</h2>

              <p>
                Prefer a delivery platform instead? Use one of the options below.
              </p>

              <div className="platform-grid">
                {PLATFORMS.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-btn"
                  >
                    <div
                      style={{
                        width:'44px',
                        height:'44px',
                        borderRadius:'8px',
                        background:p.color,
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center'
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    <span className="p-name">{p.name}</span>

                    <span className="p-arrow">
                      Order here &rarr;
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        {step !== 'confirm' && (
          <div className="summary-card">

            <h3>Order Summary</h3>

            {cart.items.length === 0 ? (
              <p
                style={{
                  fontSize:'0.83rem',
                  color:'var(--muted)'
                }}
              >
                No items in cart yet.
              </p>
            ) : (
              <>
                {cart.items.map((i) => (
                  <div
                    key={`${i._id}-${i.size}`}
                    className="sum-row"
                  >
                    <span>
                      {i.name}
                      {i.size ? ` (${i.size})` : ''}
                      {' '}×{i.quantity}
                    </span>

                    <span>
                      ${(i.price * i.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="sum-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="sum-note">
                  Payment: Cash on pickup/delivery
                </div>
              </>
            )}

            <div
              style={{
                marginTop:'1.25rem',
                padding:'12px',
                background:'var(--cream)',
                borderRadius:'var(--r)',
                fontSize:'0.78rem',
                color:'var(--muted)',
                lineHeight:1.7
              }}
            >
              <strong style={{ color:'var(--green)' }}>
                Questions?
              </strong>

              <br/>

              Call us:{' '}

              <a
                href={`tel:${phoneNumber}`}
                style={{
                  color:'var(--gold-dk)',
                  fontWeight:600
                }}
              >
                {phoneNumber}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}