import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconPhone, IconMap, IconArrow, IconCheck, IconStar, IconTruck, IconClock } from '../components/Icons';
import MenuCard from '../components/MenuCard';
import { getFeaturedItems } from '../services/api';

const WHY_US = [
  { title: '100% Halal', desc: 'Every ingredient sourced and prepared under strict halal standards. Certified and verified.', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80' },
  { title: 'Authentic Somali', desc: 'Traditional recipes passed through generations — Bariis, Suqaar, Hilib, Canjeero made the right way.', img: '/pic2.png' },
  { title: 'Halal Pizza', desc: 'Fresh dough, premium halal toppings, wood-fired flavour. From classic to Somali-inspired creations.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' },
  { title: 'Fast & Fresh', desc: 'Every order made to order. Dine-in, takeout, delivery and catering — we come to you.', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' },
];

const SERVICES = [
  { label: 'Dine-In', desc: 'Warm, welcoming atmosphere', icon: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="1" y="1" width="34" height="34" rx="8" stroke="#C9A84C" strokeWidth="1.5"/><path d="M11 10v16M11 18h8M19 10v16M26 10c0 0 1 4 1 8s-1 8-1 8" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  )},
  { label: 'Takeout', desc: 'Ready in 20 minutes', icon: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="1" y="1" width="34" height="34" rx="8" stroke="#C9A84C" strokeWidth="1.5"/><path d="M10 14h16l-2 10H12L10 14z" stroke="#C9A84C" strokeWidth="1.6" strokeLinejoin="round"/><path d="M14 14l1-4h6l1 4" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  )},
  { label: 'Delivery', desc: 'To your door', icon: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="1" y="1" width="34" height="34" rx="8" stroke="#C9A84C" strokeWidth="1.5"/><rect x="6" y="13" width="16" height="10" rx="1" stroke="#C9A84C" strokeWidth="1.6"/><path d="M22 16h5l3 5v3h-8V16z" stroke="#C9A84C" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="11" cy="25" r="2" stroke="#C9A84C" strokeWidth="1.5"/><circle cx="27" cy="25" r="2" stroke="#C9A84C" strokeWidth="1.5"/></svg>
  )},
  { label: 'Catering', desc: 'Events & parties', icon: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="1" y="1" width="34" height="34" rx="8" stroke="#C9A84C" strokeWidth="1.5"/><path d="M9 22c0-5 3.6-9 9-9s9 4 9 9" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/><line x1="7" y1="22" x2="29" y2="22" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/><line x1="18" y1="10" x2="18" y2="13" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/></svg>
  )},
];

const MENU_CATS = [
  { label: 'Somali Plates', slug: 'somali-plates', img: '/pic1.png', count: 'Bariis, Suqaar & more' },
  { label: 'Pizza', slug: 'pizza', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', count: 'Halal toppings' },
  { label: 'Pasta', slug: 'pasta', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80', count: 'Fresh & hearty' },
  { label: 'Ugali & Fufu', slug: 'ugali-fufu', img: '/pic3.png', count: 'African staples' },
  { label: 'Drinks', slug: 'drinks', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', count: 'Somali tea & more' },
  { label: 'Kids Menu', slug: 'kids-menu', img: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600&q=80', count: 'For the little ones' },
];

const REVIEWS = [
  { name: 'Amina H.', stars: 5, text: 'Best Somali food I have had outside of East Africa. The Bariis & Suqaar is absolutely incredible. Authentic flavours!' },
  { name: 'James T.', stars: 5, text: 'Came for the pizza, stayed for the Sambusa. Everything is fresh and the staff are so welcoming. My new favourite spot.' },
  { name: 'Fatima A.', stars: 5, text: 'So happy to have halal food in New Minas! The Canjeero with tea is perfect. We come every week now.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedItems().then(r => setFeatured(r.data)).catch(() => {});
  }, []);

  return (
    <div className="home-page pt-nav">
      <style>{`
        /* ── Hero ── */
        .hero {
          min-height:100vh; position:relative; display:flex; align-items:center;
          background: var(--green);
          overflow:hidden;
        }
        .hero-bg {
          position:absolute;inset:0;
          background-image:url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80');
          background-size:cover;background-position:center;
          opacity:0.18;
        }
        .hero-overlay { position:absolute;inset:0;background:linear-gradient(100deg,rgba(14,40,24,0.97) 48%,rgba(14,40,24,0.55)); }
        .hero-inner { position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;padding:7rem 0 5rem; }
        .hero-badge { display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border:1px solid var(--border-s);border-radius:50px;font-size:0.72rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem; }
        .hero h1 { font-family:var(--ff-display);font-size:clamp(2.6rem,5vw,4rem);font-weight:700;color:var(--cream);line-height:1.07;margin-bottom:1.25rem; }
        .hero h1 em { font-style:italic;color:var(--gold); }
        .hero-sub { font-size:1.05rem;color:rgba(250,246,238,0.68);line-height:1.75;margin-bottom:2rem;max-width:480px; }
        .hero-ctas { display:flex;flex-wrap:wrap;gap:12px;margin-bottom:3rem; }
        .hero-info { display:flex;flex-direction:column;gap:10px; }
        .hero-info-row { display:flex;align-items:center;gap:10px;font-size:0.875rem;color:rgba(250,246,238,0.6); }
        .hero-info-row svg { color:var(--gold);flex-shrink:0; }
        /* Hero right — food grid */
        .hero-visual { display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:12px; }
        .hero-img-main { grid-column:1/3;border-radius:var(--r-lg);overflow:hidden;height:220px; }
        .hero-img-sm { border-radius:var(--r-lg);overflow:hidden;height:150px; }
        .hero-img-main img,.hero-img-sm img { width:100%;height:100%;object-fit:cover; }
        .hero-img-label { position:absolute;bottom:10px;left:12px;font-family:var(--ff-display);font-size:0.95rem;font-weight:600;color:white;text-shadow:0 1px 6px rgba(0,0,0,0.5); }
        .hero-img-wrap { position:relative; }
        /* Grand Opening ribbon */
        .grand-open {
          background:var(--gold);color:var(--green);text-align:center;padding:10px 16px;
          font-weight:700;font-size:0.85rem;letter-spacing:0.06em;
        }
        /* Services strip */
        .services-strip { background:var(--ink-soft);padding:48px 0; }
        .services-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:0; }
        .service-item { text-align:center;padding:28px 20px;border-right:1px solid rgba(201,168,76,0.1); }
        .service-item:last-child { border-right:none; }
        .service-item svg { margin:0 auto 14px; }
        .service-item .s-label { font-family:var(--ff-display);font-size:1.05rem;font-weight:600;color:var(--cream);margin-bottom:4px; }
        .service-item .s-desc { font-size:0.78rem;color:rgba(250,246,238,0.45); }
        /* Why us */
        .why-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--cream-dk);border-radius:var(--r-xl);overflow:hidden; }
        .why-card { background:var(--white);padding:0; overflow:hidden; }
        .why-card-img { height:220px;overflow:hidden; }
        .why-card-img img { width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease; }
        .why-card:hover .why-card-img img { transform:scale(1.06); }
        .why-card-body { padding:1.5rem 1.75rem; }
        .why-card-body h3 { font-family:var(--ff-display);font-size:1.35rem;font-weight:700;color:var(--green);margin-bottom:8px; }
        .why-card-body p { font-size:0.875rem;color:var(--muted);line-height:1.75; }
        /* Categories */
        .cat-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:20px; }
        .cat-card { position:relative;border-radius:var(--r-lg);overflow:hidden;height:200px;cursor:pointer;text-decoration:none; }
        .cat-card img { width:100%;height:100%;object-fit:cover;transition:transform 0.45s ease; }
        .cat-card:hover img { transform:scale(1.08); }
        .cat-card-overlay { position:absolute;inset:0;background:linear-gradient(0deg,rgba(14,40,24,0.85) 0%,rgba(14,40,24,0.1) 60%); }
        .cat-card-text { position:absolute;bottom:16px;left:16px;right:16px; }
        .cat-card-text h3 { font-family:var(--ff-display);font-size:1.2rem;font-weight:700;color:white;margin-bottom:2px; }
        .cat-card-text span { font-size:0.75rem;color:rgba(255,255,255,0.65); }
        /* Featured */
        .featured-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:24px; }
        /* Story / About */
        .story-grid { display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center; }
        .story-img-stack { position:relative;height:480px; }
        .story-img-main { position:absolute;top:0;left:0;right:60px;bottom:60px;border-radius:var(--r-xl);overflow:hidden; }
        .story-img-main img { width:100%;height:100%;object-fit:cover; }
        .story-img-accent { position:absolute;bottom:0;right:0;width:55%;border-radius:var(--r-lg);overflow:hidden;border:4px solid var(--cream);box-shadow:var(--sh-md); }
        .story-img-accent img { width:100%;aspect-ratio:4/3;object-fit:cover; }
        .story-text .section-label { margin-bottom:16px; }
        .story-text h2 { font-family:var(--ff-display);font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:700;color:var(--green);line-height:1.18;margin-bottom:1.25rem; }
        .story-text h2 em { font-style:italic;color:var(--gold-dk); }
        .story-text p { font-size:0.925rem;color:var(--muted);line-height:1.85;margin-bottom:1rem; }
        .story-checks { display:flex;flex-direction:column;gap:10px;margin:1.5rem 0; }
        .story-check { display:flex;align-items:center;gap:10px;font-size:0.875rem;font-weight:500;color:var(--ink-soft); }
        .story-check svg { color:var(--green-lt);flex-shrink:0; }
        .story-stats { display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem;padding-top:2rem;border-top:1px solid var(--cream-dk); }
        .story-stat .num { font-family:var(--ff-display);font-size:2.2rem;font-weight:700;color:var(--gold-dk);line-height:1; }
        .story-stat .lbl { font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-top:4px; }
        /* Reviews */
        .review-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:24px; }
        .review-card { background:var(--white);border-radius:var(--r-lg);padding:1.75rem;border:1px solid var(--border);box-shadow:var(--sh-sm); }
        .review-stars { display:flex;gap:3px;margin-bottom:12px; }
        .review-stars svg { fill:var(--gold);stroke:none; }
        .review-text { font-size:0.895rem;color:var(--muted);line-height:1.75;margin-bottom:14px;font-style:italic; }
        .review-name { font-weight:700;font-size:0.82rem;color:var(--green); }
        /* Google profile CTA */
        .google-cta { background:var(--ink-soft);border-radius:var(--r-xl);padding:3rem;display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:center; }
        .google-cta h3 { font-family:var(--ff-display);font-size:1.5rem;color:var(--cream);margin-bottom:8px; }
        .google-cta p { font-size:0.875rem;color:rgba(250,246,238,0.55); }
        /* CTA Section */
        .cta-section { background:linear-gradient(135deg,var(--green) 0%,var(--green-md) 100%);position:relative;overflow:hidden; }
        .cta-section::before { content:'';position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=60') center/cover;opacity:0.07; }
        .cta-inner { position:relative;z-index:1;text-align:center;padding:5rem 0; }
        .cta-inner h2 { font-family:var(--ff-display);font-size:clamp(2rem,4vw,3rem);color:white;margin-bottom:1rem; }
        .cta-inner h2 em { color:var(--gold);font-style:italic; }
        .cta-inner p { font-size:1rem;color:rgba(255,255,255,0.65);margin-bottom:2.5rem;max-width:520px;margin-left:auto;margin-right:auto; }
        .cta-btns { display:flex;gap:14px;justify-content:center;flex-wrap:wrap; }
        /* Responsive */
        @media(max-width:960px){
          .hero-inner{grid-template-columns:1fr;padding:5rem 0 3rem;}
          .hero-visual{display:none;}
          .services-grid{grid-template-columns:repeat(2,1fr);}
          .service-item{border-right:none;border-bottom:1px solid rgba(201,168,76,0.1);}
          .why-grid{grid-template-columns:1fr;}
          .cat-grid{grid-template-columns:repeat(2,1fr);}
          .featured-grid{grid-template-columns:repeat(2,1fr);}
          .story-grid{grid-template-columns:1fr;}
          .story-img-stack{display:none;}
          .review-grid{grid-template-columns:1fr;}
          .google-cta{grid-template-columns:1fr;}
        }
        @media(max-width:640px){
          .cat-grid{grid-template-columns:1fr;}
          .featured-grid{grid-template-columns:1fr;}
          .services-grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* Grand Opening Banner */}
      <div className="grand-open">
        Grand Opening — Now Open in New Minas, Nova Scotia &nbsp;|&nbsp; Call: 902-3657-777
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-overlay"/>
        <div className="container" style={{ width:'100%' }}>
          <div className="hero-inner">
            <div className="hero-content anim-fade-up">
              <div className="hero-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="#C9A84C"/>
                  <text x="6" y="8.5" textAnchor="middle" fontSize="4" fill="#C9A84C" fontFamily="serif">ح</text>
                </svg>
                Grand Opening · New Minas, Nova Scotia
              </div>
              <h1>
                Authentic <em>Somali Food</em><br/>& Halal Pizza
              </h1>
              <p className="hero-sub">
                Experience the rich, aromatic flavours of Somalia — from fragrant Bariis and tender Suqaar to crispy Sambusa and freshly made halal pizza. Everything 100% halal, made with love.
              </p>
              <div className="hero-ctas">
                <Link to="/order?type=pickup" className="btn btn-gold btn-lg">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  Order Pickup
                </Link>
                <Link to="/order?type=delivery" className="btn btn-outline-white btn-lg">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  Order Delivery
                </Link>
                <a href="tel:9022929852" className="btn btn-outline-white btn-lg">
                  <IconPhone size={16}/> Call Now
                </a>
              </div>
              <div className="hero-info">
                <div className="hero-info-row"><IconMap size={15}/> 9005 Commercial Street, New Minas, Nova Scotia</div>
                <div className="hero-info-row"><IconPhone size={15}/> 902-292-9852</div>
                <div className="hero-info-row"><IconClock size={15}/> Monday – Sunday: 11:00 AM – 10:00 PM</div>
              </div>
            </div>

            {/* Hero Visual Grid */}
            <div className="hero-visual anim-fade-up-3">
              <div className="hero-img-main hero-img-wrap">
                <img src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80" alt="Bariis & Suqaar"/>
                <span className="hero-img-label">Bariis &amp; Suqaar</span>
              </div>
              <div className="hero-img-sm hero-img-wrap">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" alt="Halal Pizza"/>
                <span className="hero-img-label">Halal Pizza</span>
              </div>
              <div className="hero-img-sm hero-img-wrap">
                <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80" alt="Sambusa"/>
                <span className="hero-img-label">Sambusa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES STRIP ── */}
      <section className="services-strip">
        <div className="container">
          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.label} className="service-item">
                {s.icon}
                <div className="s-label">{s.label}</div>
                <div className="s-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="section-label centered">Why Choose Us</div>
            <h2 className="display-lg" style={{ color:'var(--green)', marginTop:'12px' }}>The Bariis &amp; Pizza Difference</h2>
          </div>
          <div className="why-grid">
            {WHY_US.map(w => (
              <div key={w.title} className="why-card">
                <div className="why-card-img">
                  <img src={w.img} alt={w.title} loading="lazy"/>
                </div>
                <div className="why-card-body">
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU CATEGORIES ── */}
      <section className="section section-cream">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="section-label centered">Our Menu</div>
            <h2 className="display-lg" style={{ color:'var(--green)', marginTop:'12px' }}>Explore What We Offer</h2>
            <p style={{ color:'var(--muted)', marginTop:'10px', fontSize:'0.95rem' }}>
              Every dish crafted from authentic Somali recipes — 100% Halal, always fresh
            </p>
          </div>
          <div className="cat-grid">
            {MENU_CATS.map(c => (
              <Link to={`/menu?cat=${c.slug}`} key={c.slug} className="cat-card">
                <img src={c.img} alt={c.label} loading="lazy"/>
                <div className="cat-card-overlay"/>
                <div className="cat-card-text">
                  <h3>{c.label}</h3>
                  <span>{c.count}</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
            <Link to="/menu" className="btn btn-gold">
              View Full Menu <IconArrow size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED DISHES ── */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <div className="section-label centered">Today's Picks</div>
              <h2 className="display-lg" style={{ color:'var(--green)', marginTop:'12px' }}>Featured Dishes</h2>
            </div>
            <div className="featured-grid">
              {featured.slice(0, 6).map(item => <MenuCard key={item._id} item={item}/>)}
            </div>
            <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
              <Link to="/menu" className="btn btn-gold">See All Menu Items <IconArrow size={16}/></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── OUR STORY ── */}
      <section className="section section-cream">
        <div className="container">
          <div className="story-grid">
            <div className="story-img-stack">
              <div className="story-img-main">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" alt="Somali cuisine spread"/>
              </div>
              <div className="story-img-accent">
                <img src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80" alt="Somali tea"/>
              </div>
            </div>
            <div className="story-text">
              <div className="section-label">Our Story</div>
              <h2>African Love,<br/><em>Somali Soul</em></h2>
              <p>
                Bariis & Pizza House was founded on a simple belief — that everyone deserves access to delicious, authentic, and truly halal food. We brought the rich culinary traditions of Somalia to the heart of Nova Scotia's Annapolis Valley.
              </p>
              <p>
                Our kitchen is where heritage meets creativity. Every pot of Bariis is seasoned the way grandmothers in Mogadishu would, every Sambusa is filled and fried with pride, and every pizza is topped with care under halal standards.
              </p>
              <div className="story-checks">
                {['100% Halal certified — every single ingredient', 'Authentic Somali recipes, made fresh daily', 'Warm, welcoming space for the whole family', 'Proudly serving New Minas & Annapolis Valley'].map(t => (
                  <div key={t} className="story-check"><IconCheck size={16}/> {t}</div>
                ))}
              </div>
              <div className="story-stats">
                <div className="story-stat"><div className="num">100%</div><div className="lbl">Halal</div></div>
                <div className="story-stat"><div className="num">7</div><div className="lbl">Days / Week</div></div>
                <div className="story-stat"><div className="num">20+</div><div className="lbl">Menu Items</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="section-label centered">Reviews</div>
            <h2 className="display-lg" style={{ color:'var(--green)', marginTop:'12px' }}>What Our Customers Say</h2>
          </div>
          <div className="review-grid">
            {REVIEWS.map(r => (
              <div key={r.name} className="review-card">
                <div className="review-stars">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <svg key={i} width="15" height="15" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-name">— {r.name}</div>
              </div>
            ))}
          </div>
          {/* Google profile link */}
          <div className="google-cta" style={{ marginTop:'2.5rem' }}>
            <div>
              <h3>Enjoyed your meal? Leave us a Google review!</h3>
              <p>Your feedback helps us serve the community better and helps others find us.</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', flexShrink:0 }}>
              <a href="https://maps.google.com/?q=9005+Commercial+Street+New+Minas+Nova+Scotia" target="_blank" rel="noreferrer" className="btn btn-gold">
                Rate us on Google <IconArrow size={15}/>
              </a>
              <a href="https://maps.google.com/?q=9005+Commercial+Street+New+Minas+Nova+Scotia" target="_blank" rel="noreferrer" className="btn btn-outline-gold btn-sm" style={{ textAlign:'center' }}>
                Google Business Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIND US / MAP ── */}
      <section className="section section-cream">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div className="section-label centered">Visit Us</div>
            <h2 className="display-lg" style={{ color:'var(--green)', marginTop:'12px' }}>Find Us in New Minas</h2>
            <p style={{ color:'var(--muted)', marginTop:'10px', fontSize:'0.95rem' }}>
              9005 Commercial Street, New Minas, Nova Scotia &nbsp;·&nbsp; 902-292-9852
            </p>
          </div>
          <div style={{ borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--sh-md)', border:'1px solid var(--cream-dk)' }}>
            <iframe
              title="Bariis & Pizza House"
              src="https://maps.google.com/maps?q=9005+Commercial+Street+New+Minas+Nova+Scotia+Canada&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="360"
              style={{ border:'none', display:'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{ background:'var(--white)', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
              <p style={{ fontSize:'0.875rem', color:'var(--muted)' }}>9005 Commercial Street, New Minas, NS · Mon–Sun 11:00 AM – 10:00 PM</p>
              <a href="https://maps.google.com/?q=9005+Commercial+Street+New+Minas+Nova+Scotia" target="_blank" rel="noreferrer" className="btn btn-gold btn-sm">
                <IconMap size={13}/> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="section-label centered" style={{ marginBottom:'16px' }}>Ready to Eat?</div>
            <h2>Order Now or <em>Visit Us Today</em></h2>
            <p>9005 Commercial Street, New Minas, Nova Scotia &nbsp;·&nbsp; Open 7 days a week, 11 AM – 10 PM</p>
            <div className="cta-btns">
              <Link to="/order" className="btn btn-gold btn-lg">Order Online</Link>
              <a href="tel:9022929852" className="btn btn-outline-white btn-lg"><IconPhone size={16}/> 902-292-9852</a>
              <a href="https://maps.google.com/?q=9005+Commercial+Street+New+Minas+Nova+Scotia" target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg">
                <IconMap size={16}/> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
