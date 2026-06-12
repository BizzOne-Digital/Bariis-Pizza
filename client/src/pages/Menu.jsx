import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconSearch } from '../components/Icons';
import MenuCard from '../components/MenuCard';
import { getMenuItems } from '../services/api';

const SECTIONS = [
  { key: 'all',             label: 'All Items',          img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=70' },
  { key: 'somali-plates',   label: 'Somali Plates',      img: '/pic1.png' },
  { key: 'pizza',           label: 'Pizza',              img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=70' },
  { key: 'pasta',           label: 'Pasta',              img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=70' },
  { key: 'ugali-fufu',      label: 'Ugali & Fufu',       img: '/pic3.png' },
  { key: 'drinks',          label: 'Drinks',             img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70' },
  { key: 'kids-menu',       label: 'Kids Menu',          img: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400&q=70' },
];

const SEC_HEADERS = {
  'somali-plates': { title: 'Somali Plates', sub: 'Authentic Somali rice dishes — Bariis, Suqaar, Hilib & more', img: '/pic1.png' },
  'pizza':         { title: 'Pizza',         sub: 'Fresh dough, premium halal toppings, made to order', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80' },
  'pasta':         { title: 'Pasta',         sub: 'Classic pasta dishes made with fresh ingredients', img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=1200&q=80' },
  'ugali-fufu':    { title: 'Ugali & Fufu',  sub: 'Traditional East & West African staples, made fresh daily', img: '/pic3.png' },
  'drinks':        { title: 'Drinks',        sub: 'Somali spiced tea, fresh juices and cold drinks', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80' },
  'kids-menu':     { title: 'Kids Menu',     sub: 'Smaller portions, big flavours — perfect for little ones', img: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=1200&q=80' },
};

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(params.get('cat') || 'all');
  const sectionRefs = useRef({});

  useEffect(() => {
    getMenuItems({ available: true })
      .then(r => setItems(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Filter
  const filtered = items.filter(item => {
    const matchCat = active === 'all' || item.category === active;
    const matchQ = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const grouped = SECTIONS.filter(s => s.key !== 'all').map(s => ({
    ...s,
    items: filtered.filter(i => i.category === s.key),
  })).filter(g => active === 'all' ? g.items.length > 0 : g.key === active);

  const switchTab = (key) => {
    setActive(key);
    setParams(key !== 'all' ? { cat: key } : {});
    if (key !== 'all') {
      setTimeout(() => {
        sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="menu-page pt-nav">
      <style>{`
        .menu-page { min-height:100vh; }
        /* Hero */
        .menu-hero { position:relative;height:320px;display:flex;align-items:flex-end;overflow:hidden; }
        .menu-hero-bg { position:absolute;inset:0; }
        .menu-hero-bg img { width:100%;height:100%;object-fit:cover; }
        .menu-hero-overlay { position:absolute;inset:0;background:linear-gradient(0deg,rgba(14,40,24,0.92) 0%,rgba(14,40,24,0.4) 100%); }
        .menu-hero-text { position:relative;z-index:2;padding:2.5rem; }
        .menu-hero-text h1 { font-family:var(--ff-display);font-size:clamp(2rem,4vw,3rem);font-weight:700;color:white; }
        .menu-hero-text p { color:rgba(255,255,255,0.65);margin-top:6px; }
        /* Halal bar */
        .halal-bar { background:var(--green);color:var(--gold);text-align:center;padding:10px 16px;font-size:0.8rem;font-weight:600;letter-spacing:0.06em;border-bottom:1px solid var(--border); }
        /* Sticky controls */
        .menu-controls { position:sticky;top:var(--nav-h);z-index:100;background:var(--white);border-bottom:1px solid rgba(0,0,0,0.07);box-shadow:0 2px 16px rgba(0,0,0,0.06); }
        .menu-search { padding:14px 24px;border-bottom:1px solid rgba(0,0,0,0.06); }
        .search-wrap { max-width:480px;margin:0 auto;display:flex;align-items:center;gap:10px;background:var(--cream);border:1.5px solid var(--cream-dk);border-radius:50px;padding:10px 18px;transition:border-color 0.2s; }
        .search-wrap:focus-within { border-color:var(--gold); }
        .search-wrap input { flex:1;border:none;background:none;outline:none;font-size:0.9rem;font-family:var(--ff-body); }
        .search-wrap svg { color:var(--muted); }
        .cat-tabs { display:flex;gap:0;overflow-x:auto;scrollbar-width:none;padding:0 8px; }
        .cat-tabs::-webkit-scrollbar { display:none; }
        .cat-tab { flex-shrink:0;display:flex;align-items:center;gap:8px;padding:14px 18px;font-size:0.84rem;font-weight:600;color:var(--muted);border-bottom:2px solid transparent;transition:all 0.2s;cursor:pointer;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--ff-body);white-space:nowrap; }
        .cat-tab img { width:22px;height:22px;border-radius:4px;object-fit:cover; }
        .cat-tab:hover { color:var(--green); }
        .cat-tab.active { color:var(--green);border-bottom-color:var(--gold); }
        /* Menu body */
        .menu-body { max-width:1180px;margin:0 auto;padding:3rem 24px 5rem; }
        /* Section block */
        .menu-section { margin-bottom:4rem; }
        .section-head { position:relative;border-radius:var(--r-lg);overflow:hidden;height:160px;margin-bottom:1.75rem; }
        .section-head img { width:100%;height:100%;object-fit:cover; }
        .section-head-overlay { position:absolute;inset:0;background:linear-gradient(100deg,rgba(14,40,24,0.88),rgba(14,40,24,0.3)); }
        .section-head-content { position:absolute;inset:0;display:flex;align-items:center;padding:0 2rem;gap:1rem; }
        .section-head-content h2 { font-family:var(--ff-display);font-size:1.8rem;font-weight:700;color:white; }
        .section-head-content p { color:rgba(255,255,255,0.65);font-size:0.85rem;margin-top:3px; }
        .section-item-count { margin-left:auto;background:rgba(201,168,76,0.25);border:1px solid var(--border-s);color:var(--gold-lt);padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;flex-shrink:0; }
        .items-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px; }
        /* Empty */
        .empty-state { text-align:center;padding:5rem 2rem;color:var(--muted); }
        .empty-state svg { margin:0 auto 1.5rem; }
        .empty-state h3 { font-family:var(--ff-display);font-size:1.5rem;color:var(--green);margin-bottom:8px; }
        @media(max-width:640px) { .menu-hero { height:220px; } .section-head { height:120px; } }
      `}</style>

      {/* Hero */}
      <div className="menu-hero">
        <div className="menu-hero-bg">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80" alt="Our Menu"/>
        </div>
        <div className="menu-hero-overlay"/>
        <div className="menu-hero-text">
          <div className="section-label" style={{ marginBottom:'10px' }}>Bariis &amp; Pizza House</div>
          <h1>Our Full Menu</h1>
          <p>100% Halal · Fresh Daily · New Minas, Nova Scotia</p>
        </div>
      </div>

      {/* Halal Notice */}
      <div className="halal-bar">
        Every item on our menu is prepared with 100% Halal certified ingredients — fresh, authentic, made with love
      </div>

      {/* Controls */}
      <div className="menu-controls">
        <div className="menu-search">
          <div className="search-wrap">
            <IconSearch size={16}/>
            <input
              placeholder="Search dishes, e.g. Bariis, Pizza, Sambusa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="cat-tabs">
          {SECTIONS.map(s => (
            <button key={s.key} className={`cat-tab${active === s.key ? ' active' : ''}`} onClick={() => switchTab(s.key)}>
              <img src={s.img} alt={s.label}/>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="menu-body">
        {loading ? (
          <div className="spinner"/>
        ) : grouped.length === 0 ? (
          <div className="empty-state">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="27" stroke="var(--cream-dk)" strokeWidth="2"/><path d="M20 28h16M28 20v16" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"/></svg>
            <h3>No dishes found</h3>
            <p>Try a different search term or category.</p>
          </div>
        ) : grouped.map(group => {
          const hdr = SEC_HEADERS[group.key] || {};
          return (
            <div key={group.key} className="menu-section" ref={el => sectionRefs.current[group.key] = el}>
              {/* Section Header with image */}
              <div className="section-head">
                <img src={hdr.img || group.img} alt={group.label} loading="lazy"/>
                <div className="section-head-overlay"/>
                <div className="section-head-content">
                  <div>
                    <h2>{hdr.title || group.label}</h2>
                    {hdr.sub && <p>{hdr.sub}</p>}
                  </div>
                  <span className="section-item-count">{group.items.length} items</span>
                </div>
              </div>
              <div className="items-grid">
                {group.items.map(item => <MenuCard key={item._id} item={item}/>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
