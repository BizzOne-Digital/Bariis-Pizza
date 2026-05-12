import React, { useState } from 'react';
import { IconPlus, IconStar } from './Icons';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Real Unsplash food images by category (used as fallback)
const FALLBACKS = {
  'somali-rice':       'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&q=80',
  'somali-specialties':'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
  'pizza':             'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
  'sambusa-snacks':    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
  'sides':             'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
  'drinks':            'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
  'combos':            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80',
  'family-platters':   'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
};

export default function MenuCard({ item }) {
  if (!item) return null;
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(item.sizes?.length ? item.sizes[0] : null);

  const price = selectedSize ? selectedSize.price : item.price;

  // Only use image if it's a valid Cloudinary/external HTTPS URL
  // Localhost URLs are ignored — they don't work on Vercel
  const isValidImage = item.image &&
    item.image.startsWith('https') &&
    !item.image.includes('localhost');
  const imgSrc = isValidImage
    ? item.image
    : (FALLBACKS[item.category] || FALLBACKS['somali-rice']);

  const handleAdd = () => {
    addItem({ _id: item._id, name: item.name, price, image: item.image, size: selectedSize?.label || null });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <article className="menu-card">
      <style>{`
        .menu-card { background:var(--white);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--sh-sm);border:1px solid rgba(0,0,0,0.05);display:flex;flex-direction:column;transition:all var(--dur) var(--ease); }
        .menu-card:hover { transform:translateY(-5px);box-shadow:var(--sh-md); }
        .mc-img { position:relative;height:190px;overflow:hidden;background:#f0ece4; }
        .mc-img img { width:100%;height:100%;object-fit:cover;transition:transform 0.45s ease; }
        .menu-card:hover .mc-img img { transform:scale(1.06); }
        .mc-badges { position:absolute;top:10px;left:10px;display:flex;gap:6px;flex-wrap:wrap; }
        .mc-body { padding:1rem 1.1rem 1.1rem;flex:1;display:flex;flex-direction:column; }
        .mc-name { font-family:var(--ff-display);font-size:1.1rem;font-weight:700;color:var(--ink);margin-bottom:4px;line-height:1.25; }
        .mc-desc { font-size:0.82rem;color:var(--muted);line-height:1.6;flex:1; }
        .mc-sizes { display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 0; }
        .size-pill { padding:4px 10px;border-radius:20px;border:1.5px solid var(--border-s);font-size:0.73rem;font-weight:600;color:var(--ink-soft);cursor:pointer;transition:all 0.2s;background:none; }
        .size-pill.active { background:var(--green);color:var(--gold);border-color:var(--green); }
        .mc-footer { display:flex;align-items:center;justify-content:space-between;margin-top:14px; }
        .mc-price { font-family:var(--ff-display);font-size:1.35rem;font-weight:700;color:var(--green); }
        .mc-add { display:flex;align-items:center;gap:5px;padding:8px 16px;border-radius:50px;background:linear-gradient(135deg,var(--gold-dk),var(--gold));color:var(--green);font-weight:700;font-size:0.8rem;transition:all 0.2s;cursor:pointer;border:none;font-family:var(--ff-body); }
        .mc-add:hover { transform:scale(1.05);box-shadow:var(--sh-gold); }
        .mc-unavail { font-size:0.78rem;color:var(--muted);padding:6px 12px;border:1px solid #ddd;border-radius:20px; }
      `}</style>

      <div className="mc-img">
        <img src={imgSrc} alt={item.name} loading="lazy"/>
        <div className="mc-badges">
          <span className="badge badge-halal">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <circle cx="4.5" cy="4.5" r="4" stroke="#C9A84C"/>
              <text x="4.5" y="7" textAnchor="middle" fontSize="3.5" fill="#C9A84C" fontFamily="serif">ح</text>
            </svg>
            Halal
          </span>
          {item.featured && (
            <span className="badge badge-new">
              <IconStar size={9} filled color="var(--green)"/> Featured
            </span>
          )}
          {item.tags?.includes('vegetarian') && <span className="badge badge-veg">Vegetarian</span>}
        </div>
      </div>

      <div className="mc-body">
        <div className="mc-name">{item.name}</div>
        <div className="mc-desc">{item.description}</div>

        {item.sizes?.length > 0 && (
          <div className="mc-sizes">
            {item.sizes.map(s => (
              <button
                key={s.label}
                className={`size-pill${selectedSize?.label === s.label ? ' active' : ''}`}
                onClick={() => setSelectedSize(s)}
              >
                {s.label} — ${s.price.toFixed(2)}
              </button>
            ))}
          </div>
        )}

        <div className="mc-footer">
          <span className="mc-price">${price.toFixed(2)}</span>
          {item.available
            ? <button className="mc-add" onClick={handleAdd}><IconPlus size={13}/> Add to Cart</button>
            : <span className="mc-unavail">Currently Unavailable</span>
          }
        </div>
      </div>
    </article>
  );
}