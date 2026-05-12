import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IconPhone, IconCart, IconMenu, IconX } from './Icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/order', label: 'Order Online' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <style>{`
        .nav-root {
          position:fixed;
          top:0;
          left:0;
          right:0;
          z-index:900;
          height:var(--nav-h);
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 2rem;
          transition:all 0.3s ease;
          background:rgba(14,40,24,0.97);
          backdrop-filter:blur(14px);
          border-bottom:1px solid var(--border);
        }

        .nav-root.scrolled {
          box-shadow:0 4px 24px rgba(0,0,0,0.3);
        }

        .nav-logo {
          display:flex;
          align-items:center;
        }

        .nav-logo img {
          height:58px;
          width:auto;
          object-fit:contain;
        }

        .nav-links {
          display:flex;
          align-items:center;
          gap:2px;
        }

        .nav-links a {
          padding:6px 13px;
          border-radius:6px;
          font-size:0.875rem;
          font-weight:500;
          color:rgba(250,246,238,0.78);
          transition:all 0.2s;
        }

        .nav-links a:hover {
          color:var(--gold);
          background:rgba(201,168,76,0.09);
        }

        .nav-links a.active {
          color:var(--gold);
        }

        .nav-actions {
          display:flex;
          align-items:center;
          gap:10px;
        }

        .nav-call {
          display:flex;
          align-items:center;
          gap:7px;
          padding:8px 18px;
          border-radius:50px;
          background:linear-gradient(135deg,var(--gold-dk),var(--gold));
          color:var(--green);
          font-weight:700;
          font-size:0.82rem;
          transition:all 0.2s;
        }

        .nav-call:hover {
          transform:translateY(-1px);
          box-shadow:var(--sh-gold);
        }

        .nav-cart {
          position:relative;
          padding:8px;
          border:1px solid var(--border-s);
          border-radius:8px;
          color:var(--gold-lt);
          transition:all 0.2s;
          display:flex;
          align-items:center;
        }

        .nav-cart:hover {
          background:rgba(201,168,76,0.1);
        }

        .cart-dot {
          position:absolute;
          top:-6px;
          right:-6px;
          width:18px;
          height:18px;
          border-radius:50%;
          background:var(--red);
          color:#fff;
          font-size:0.63rem;
          font-weight:700;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .nav-burger {
          color:var(--gold-lt);
          padding:6px;
          display:none;
          line-height:0;
        }

        .drawer {
          display:none;
          position:fixed;
          top:var(--nav-h);
          left:0;
          right:0;
          bottom:0;
          background:var(--green);
          z-index:899;
          flex-direction:column;
          padding:2rem 1.5rem;
          overflow-y:auto;
        }

        .drawer.open {
          display:flex;
        }

        .drawer-link {
          display:block;
          padding:14px 0;
          font-size:1.05rem;
          font-weight:500;
          color:rgba(250,246,238,0.85);
          border-bottom:1px solid var(--border);
        }

        .drawer-link:hover,
        .drawer-link.active {
          color:var(--gold);
        }

        .drawer-btns {
          margin-top:2rem;
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .drawer-btns a {
          display:block;
          text-align:center;
          padding:13px;
          border-radius:10px;
          font-weight:700;
          font-size:0.95rem;
        }

        @media(max-width:900px){
          .nav-links{
            display:none;
          }

          .call-txt{
            display:none;
          }

          .nav-burger{
            display:block;
          }

          .nav-logo img{
            height:50px;
          }
        }

        @media(max-width:480px){
          .nav-root{
            padding:0 1rem;
          }

          .nav-call{
            display:none;
          }

          .nav-logo img{
            height:44px;
          }
        }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        
        {/* LOGO */}
        <Link to="/" className="nav-logo">
          <img src="/logo.png" alt="Bariis Pizza House Logo" />
        </Link>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to==='/'}
                className={({isActive}) => isActive ? 'active' : ''}
              >
                {l.label}
              </NavLink>
            </li>
          ))}

          {user && (
            <li>
              <NavLink
                to="/admin"
                className={({isActive}) => isActive ? 'active' : ''}
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          <a href="tel:9022929852" className="nav-call">
            <IconPhone size={15}/>
            <span className="call-txt">902-292-9852</span>
          </a>

          <button
            className="nav-cart"
            onClick={() => navigate('/order')}
          >
            <IconCart size={19}/>
            {itemCount > 0 && (
              <span className="cart-dot">{itemCount}</span>
            )}
          </button>

          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{
                fontSize:'0.78rem',
                color:'rgba(250,246,238,0.45)',
                padding:'4px 8px'
              }}
            >
              Logout
            </button>
          )}

          <button
            className="nav-burger"
            onClick={() => setOpen(o=>!o)}
          >
            {open ? <IconX size={22}/> : <IconMenu size={22}/>}
          </button>
        </div>
      </nav>

      <div className={`drawer${open ? ' open' : ''}`}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to==='/'}
            className={({isActive}) =>
              `drawer-link${isActive ? ' active' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}

        {user && (
          <NavLink
            to="/admin"
            className="drawer-link"
            onClick={() => setOpen(false)}
          >
            Admin Panel
          </NavLink>
        )}

        <div className="drawer-btns">
          <a
            href="tel:9022929852"
            style={{
              background:'linear-gradient(135deg,var(--gold-dk),var(--gold))',
              color:'var(--green)'
            }}
          >
            Call: 902-292-9852
          </a>

          <Link
            to="/order"
            onClick={() => setOpen(false)}
            style={{
              background:'var(--green-md)',
              color:'var(--gold-lt)'
            }}
          >
            Order Online
          </Link>
        </div>
      </div>
    </>
  );
}