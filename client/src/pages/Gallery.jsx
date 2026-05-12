import React, { useState } from 'react';

const GALLERY_SECTIONS = [
  {
    key: 'bariis', label: 'Bariis',
    desc: 'Fragrant Somali rice — the heart of every meal',
    hero: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200&q=80',
    items: [
      { title: 'Bariis & Suqaar', sub: 'Rice with spiced goat', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80' },
      { title: 'Bariis & Hilib', sub: 'Rice with seasoned beef', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80' },
      { title: 'Bariis & Kuku', sub: 'Rice with grilled chicken', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80' },
      { title: 'Bariis & Kalluun', sub: 'Rice with seasoned fish', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80' },
      { title: 'Vegetable Rice', sub: 'Aromatic rice with vegetables', img: 'https://images.unsplash.com/photo-1664717698774-84f62382613b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { title: 'Somali Spaghetti (Baasto)', sub: 'Rich tomato sauce, Somali style', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80' },
    ]
  },
  {
    key: 'suqaar', label: 'Suqaar & Meat',
    desc: 'Tender halal meat dishes seasoned with traditional Somali spices',
    hero: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
    items: [
      { title: 'Suqaar', sub: 'Sautéed goat with peppers', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80' },
      { title: 'Hilib Igu Dheer', sub: 'Slow cooked beef in spices', img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80' },
      { title: 'Kuku Iskukaris', sub: 'Chicken stew with vegetables', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80' },
      { title: 'Lahmoon', sub: 'Canjeero topped with minced meat', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80' },
    ]
  },
  {
    key: 'pizza', label: 'Halal Pizza',
    desc: 'Fresh dough, premium halal toppings — available in Small, Medium & Large',
    hero: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
    items: [
      { title: 'Chicken Pizza', sub: 'Grilled chicken, mozzarella, peppers', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' },
      { title: 'Meat Lovers Pizza', sub: 'Beef, chicken, pepperoni', img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80' },
      { title: 'Veggie Pizza', sub: 'Mushrooms, peppers, olives, tomatoes', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80' },
      { title: 'Hawaiian Pizza', sub: 'Chicken, pineapple, mozzarella', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80' },
      { title: 'Supreme Pizza', sub: 'Beef, chicken, peppers, olives, mushrooms', img: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600&q=80' },
      { title: 'BBQ Chicken Pizza', sub: 'BBQ sauce, grilled chicken, cheese', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80' },
    ]
  },
  {
    key: 'sambusa', label: 'Sambusa',
    desc: 'Crispy golden pastry filled with spiced halal beef or vegetables',
    hero: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80',
    items: [
      { title: 'Sambusa (3 pcs)', sub: 'Crispy beef or vegetable filling', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80' },
      { title: 'Canjeero', sub: 'Somali thin pancakes with honey', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80' },
      { title: 'Chapati', sub: 'Fresh homemade flatbread', img: 'https://images.unsplash.com/photo-1633442496018-6872fbfbbcc7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  {
    key: 'tea', label: 'Somali Tea',
    desc: 'Authentic spiced tea and refreshing drinks to complete your meal',
    hero: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80',
    items: [
      { title: 'Somali Tea', sub: 'Traditional spiced chai', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80' },
      { title: 'Mango Juice', sub: 'Fresh mango blend', img: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80' },
      { title: 'Milk Shake', sub: 'Creamy shake, assorted flavours', img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&q=80' },
      { title: 'Cold Drinks', sub: 'Pepsi, 7UP, Sprite & more', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80' },
    ]
  },
];

export default function Gallery() {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const sections = active === 'all' ? GALLERY_SECTIONS : GALLERY_SECTIONS.filter(s => s.key === active);

  return (
    <div className="gallery-page pt-nav">
      <style>{`
        .gallery-page { min-height:100vh;background:var(--cream); }
        /* Hero */
        .gallery-hero { position:relative;height:300px;display:flex;align-items:flex-end;overflow:hidden; }
        .gallery-hero img.bg { position:absolute;inset:0;width:100%;height:100%;object-fit:cover; }
        .gallery-hero-overlay { position:absolute;inset:0;background:linear-gradient(0deg,rgba(14,40,24,0.92),rgba(14,40,24,0.3)); }
        .gallery-hero-text { position:relative;z-index:2;padding:2.5rem; }
        .gallery-hero-text h1 { font-family:var(--ff-display);font-size:clamp(2rem,4vw,3rem);font-weight:700;color:white; }
        .gallery-hero-text p { color:rgba(255,255,255,0.6);margin-top:6px; }
        /* Filter tabs */
        .gallery-filters { background:var(--white);border-bottom:1px solid rgba(0,0,0,0.07);position:sticky;top:var(--nav-h);z-index:100;padding:0 12px; }
        .filter-tabs { display:flex;overflow-x:auto;scrollbar-width:none;gap:0; }
        .filter-tabs::-webkit-scrollbar { display:none; }
        .filter-tab { flex-shrink:0;padding:14px 20px;font-size:0.84rem;font-weight:600;color:var(--muted);border-bottom:2px solid transparent;transition:all 0.2s;cursor:pointer;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--ff-body);white-space:nowrap; }
        .filter-tab:hover { color:var(--green); }
        .filter-tab.active { color:var(--green);border-bottom-color:var(--gold); }
        /* Body */
        .gallery-body { max-width:1180px;margin:0 auto;padding:3rem 24px 5rem; }
        /* Section */
        .gallery-section { margin-bottom:4.5rem; }
        /* Section banner */
        .gsec-banner { position:relative;border-radius:var(--r-xl);overflow:hidden;height:180px;margin-bottom:1.5rem; }
        .gsec-banner img { width:100%;height:100%;object-fit:cover; }
        .gsec-banner-overlay { position:absolute;inset:0;background:linear-gradient(100deg,rgba(14,40,24,0.9),rgba(14,40,24,0.2)); }
        .gsec-banner-text { position:absolute;inset:0;display:flex;align-items:center;padding:0 2.5rem;gap:1.5rem; }
        .gsec-banner-text h2 { font-family:var(--ff-display);font-size:2rem;font-weight:700;color:white; }
        .gsec-banner-text p { color:rgba(255,255,255,0.65);font-size:0.875rem;margin-top:4px;max-width:400px; }
        /* Photo grid */
        .photo-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px; }
        .photo-item { border-radius:var(--r-lg);overflow:hidden;position:relative;cursor:pointer;aspect-ratio:4/3;background:var(--cream-dk); }
        .photo-item img { width:100%;height:100%;object-fit:cover;transition:transform 0.45s ease; }
        .photo-item:hover img { transform:scale(1.07); }
        .photo-item-overlay { position:absolute;inset:0;background:linear-gradient(0deg,rgba(14,40,24,0.75) 0%,transparent 55%);opacity:0;transition:opacity 0.3s; }
        .photo-item:hover .photo-item-overlay { opacity:1; }
        .photo-item-text { position:absolute;bottom:0;left:0;right:0;padding:14px;transform:translateY(4px);transition:transform 0.3s;opacity:0; }
        .photo-item:hover .photo-item-text { transform:translateY(0);opacity:1; }
        .photo-item-text h4 { font-family:var(--ff-display);font-size:1rem;font-weight:700;color:white; }
        .photo-item-text p { font-size:0.75rem;color:rgba(255,255,255,0.7);margin-top:2px; }
        .halal-pill { position:absolute;top:10px;left:10px; }
        /* Lightbox */
        .lightbox { position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:2rem; }
        .lightbox-close { position:absolute;top:20px;right:20px;color:white;cursor:pointer;padding:8px;border-radius:8px;background:rgba(255,255,255,0.1); }
        .lightbox-close:hover { background:rgba(255,255,255,0.2); }
        .lightbox img { max-width:90vw;max-height:80vh;border-radius:var(--r-lg);object-fit:contain; }
        .lightbox-caption { position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);text-align:center;color:white; }
        .lightbox-caption h3 { font-family:var(--ff-display);font-size:1.3rem; }
        .lightbox-caption p { font-size:0.82rem;color:rgba(255,255,255,0.6);margin-top:4px; }
        /* CTA */
        .gallery-cta { background:var(--ink-soft);border-radius:var(--r-xl);padding:3rem 2rem;text-align:center;margin-top:2rem; }
        .gallery-cta h2 { font-family:var(--ff-display);font-size:1.8rem;color:var(--cream);margin-bottom:10px; }
        .gallery-cta p { color:rgba(250,246,238,0.55);margin-bottom:1.75rem;font-size:0.9rem; }
        .gallery-cta-btns { display:flex;gap:12px;justify-content:center;flex-wrap:wrap; }
        @media(max-width:640px){ .gsec-banner-text{flex-direction:column;align-items:flex-start;padding:1.5rem;} .gsec-banner-text h2{font-size:1.4rem;} }
      `}</style>

      {/* Hero */}
      <div className="gallery-hero">
        <img className="bg" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80" alt="Gallery"/>
        <div className="gallery-hero-overlay"/>
        <div className="gallery-hero-text">
          <div className="section-label" style={{ marginBottom:'10px' }}>Photo Gallery</div>
          <h1>Our Food Gallery</h1>
          <p>A visual feast — authentic Somali cuisine and halal pizza</p>
        </div>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        <div className="filter-tabs">
          {[{ key:'all', label:'All Sections' }, ...GALLERY_SECTIONS].map(s => (
            <button key={s.key} className={`filter-tab${active === s.key ? ' active' : ''}`} onClick={() => setActive(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="gallery-body">
        {sections.map(sec => (
          <div key={sec.key} className="gallery-section">
            {/* Section Banner with image */}
            <div className="gsec-banner">
              <img src={sec.hero} alt={sec.label} loading="lazy"/>
              <div className="gsec-banner-overlay"/>
              <div className="gsec-banner-text">
                <div>
                  <h2>{sec.label}</h2>
                  <p>{sec.desc}</p>
                </div>
              </div>
            </div>

            {/* Photo grid */}
            <div className="photo-grid">
              {sec.items.map(item => (
                <div key={item.title} className="photo-item" onClick={() => setLightbox(item)}>
                  <img src={item.img} alt={item.title} loading="lazy"/>
                  <div className="photo-item-overlay"/>
                  <div className="halal-pill">
                    <span className="badge badge-halal" style={{ fontSize:'0.65rem' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="#C9A84C"/><text x="4" y="6" textAnchor="middle" fontSize="3" fill="#C9A84C" fontFamily="serif">ح</text></svg>
                      Halal
                    </span>
                  </div>
                  <div className="photo-item-text">
                    <h4>{item.title}</h4>
                    <p>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Social / Photo CTA */}
        <div className="gallery-cta">
          <h2>Share Your Meal With Us</h2>
          <p>Tag us on Instagram and Facebook — we love seeing your photos!</p>
          <div className="gallery-cta-btns">
            <a href="#" target="_blank" rel="noreferrer" className="btn btn-gold">Follow on Instagram</a>
            <a href="#" target="_blank" rel="noreferrer" className="btn btn-outline-gold">Like on Facebook</a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={lightbox.img} alt={lightbox.title} onClick={e => e.stopPropagation()}/>
          <div className="lightbox-caption">
            <h3>{lightbox.title}</h3>
            <p>{lightbox.sub}</p>
          </div>
        </div>
      )}
    </div>
  );
}