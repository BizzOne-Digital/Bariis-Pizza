import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  IconPhone,
  IconMap,
  IconClock,
  IconMail,
  IconFacebook,
  IconInstagram,
  IconTiktok,
  IconGoogle
} from './Icons';

import { getSettings } from '../services/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);

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

  return (
    <footer>
      <style>{`
        footer {
          background: var(--ink-soft);
          color: rgba(250,246,238,0.7);
          border-top: 1px solid rgba(201,168,76,0.15);
        }

        .footer-top {
          padding: 72px 0 56px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.4fr;
          gap: 3rem;
        }

        .f-brand h2 {
          font-family: var(--ff-display);
          font-size: 1.45rem;
          color: var(--gold);
          margin-bottom: 6px;
        }

        .f-brand .tagline {
          font-size: 0.82rem;
          color: rgba(250,246,238,0.45);
          margin-bottom: 1.25rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .f-brand p {
          font-size: 0.875rem;
          line-height: 1.8;
          max-width: 280px;
          margin-bottom: 1.5rem;
        }

        .f-halal-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border: 1px solid var(--border-s);
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gold);
          letter-spacing: 0.05em;
        }

        .f-col h3 {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.25rem;
        }

        .f-col ul {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .f-col li {
          font-size: 0.875rem;
        }

        .f-col a:hover {
          color: var(--gold-lt);
        }

        .f-contact li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .f-contact li svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--gold);
        }

        .social-row {
          display: flex;
          gap: 10px;
          margin-top: 1.25rem;
        }

        .social-ico {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border);
          color: rgba(250,246,238,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .social-ico:hover {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(201,168,76,0.08);
        }

        .g-review-box {
          margin-top: 1.25rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
        }

        .g-review-box .stars {
          display: flex;
          gap: 3px;
          margin-bottom: 6px;
        }

        .g-review-box p {
          font-size: 0.78rem;
          color: rgba(250,246,238,0.55);
        }

        .g-review-box a {
          font-size: 0.78rem;
          color: var(--gold-lt);
          display: block;
          margin-top: 6px;
        }

        .footer-bot {
          border-top: 1px solid rgba(201,168,76,0.1);
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-bot p {
          font-size: 0.78rem;
          color: rgba(250,246,238,0.35);
        }

        .footer-bot-links {
          display: flex;
          gap: 20px;
        }

        .footer-bot-links a {
          font-size: 0.78rem;
          color: rgba(250,246,238,0.35);
        }

        .footer-bot-links a:hover {
          color: var(--gold);
        }

        @media(max-width:960px){
          .footer-grid{
            grid-template-columns:1fr 1fr;
            gap:2rem;
          }
        }

        @media(max-width:580px){
          .footer-grid{
            grid-template-columns:1fr;
          }

          .footer-bot{
            flex-direction:column;
            text-align:center;
          }
        }
      `}</style>

      <div className="footer-top">
        <div className="container">

          <div className="footer-grid">

            {/* Brand */}
            <div className="f-brand">

              <h2>Bariis &amp; Pizza House</h2>

              <p className="tagline">
                African Love · Somali Soul
              </p>

              <p>
                Authentic Somali cuisine and halal pizza, crafted fresh daily
                in the heart of New Minas, Nova Scotia. Dine-in, takeout,
                delivery and catering available.
              </p>

              <div className="f-halal-badge">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#C9A84C"/>
                  <text
                    x="7"
                    y="10.5"
                    textAnchor="middle"
                    fontSize="5"
                    fill="#C9A84C"
                    fontFamily="serif"
                  >
                    حلال
                  </text>
                </svg>

                100% Halal Certified
              </div>

              <div className="social-row">

                <a
                  href={settings?.socialMedia?.facebook || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="social-ico"
                  aria-label="Facebook"
                >
                  <IconFacebook size={16}/>
                </a>

                <a
                  href={settings?.socialMedia?.instagram || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="social-ico"
                  aria-label="Instagram"
                >
                  <IconInstagram size={16}/>
                </a>

                <a
                  href={settings?.socialMedia?.tiktok || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="social-ico"
                  aria-label="TikTok"
                >
                  <IconTiktok size={16}/>
                </a>

                <a
                  href={settings?.socialMedia?.google || 'https://g.page/r/'}
                  target="_blank"
                  rel="noreferrer"
                  className="social-ico"
                  aria-label="Google"
                >
                  <IconGoogle size={16}/>
                </a>

              </div>
            </div>

            {/* Quick links */}
            <div className="f-col">

              <h3>Navigate</h3>

              <ul>
                {[
                  ['/', 'Home'],
                  ['/menu', 'Our Menu'],
                  ['/order', 'Order Online'],
                  ['/gallery', 'Gallery'],
                  ['/contact', 'Contact Us']
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>

            </div>

            {/* Order links */}
            <div className="f-col">

              <h3>Order Via</h3>

              <ul>

                <li>
                  <a href="tel:9022929852">
                    Call to Order
                  </a>
                </li>

                <li>
                  <a
                    href={settings?.deliveryLinks?.doordash || '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    DoorDash
                  </a>
                </li>

                <li>
                  <a
                    href={settings?.deliveryLinks?.ubereats || '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Uber Eats
                  </a>
                </li>

                <li>
                  <a
                    href={settings?.deliveryLinks?.skipthedishes || '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Skip The Dishes
                  </a>
                </li>

              </ul>

              <div
                style={{
                  marginTop:'1rem',
                  fontSize:'0.78rem',
                  color:'rgba(250,246,238,0.35)',
                  lineHeight:1.7
                }}
              >
                Dine-In · Takeout
                <br />
                Delivery · Catering
              </div>

            </div>

            {/* Contact */}
            <div className="f-col f-contact">

              <h3>Find Us</h3>

              <ul>

                <li>
                  <IconMap size={14}/>
                  <span>
                    9005 Commercial Street, New Minas, Nova Scotia
                  </span>
                </li>

                <li>
                  <IconPhone size={14}/>
                  <a href="tel:9022929852">
                    902-292-9852
                  </a>
                </li>

                <li>
                  <IconMail size={14}/>
                  <span>
                    info@bariisandpizzahouse.ca
                  </span>
                </li>

                <li>
                  <IconClock size={14}/>
                  <span>
                    Mon – Sun: 11:00 AM – 10:00 PM
                  </span>
                </li>

              </ul>

              <div className="g-review-box">

                <div className="stars">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24">
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        fill="#FBBC05"
                      />
                    </svg>
                  ))}
                </div>

                <p>Leave us a Google review</p>

                <a
                  href={settings?.socialMedia?.google || 'https://maps.google.com/?q=9005+Commercial+Street+New+Minas+Nova+Scotia'}
                  target="_blank"
                  rel="noreferrer"
                >
                  Rate us on Google →
                </a>

              </div>

            </div>

          </div>

        </div>
      </div>

      <div className="container">

        <div className="footer-bot">

          <p>
            © {new Date().getFullYear()} Bariis &amp; Pizza House.
            All rights reserved.
          </p>

          <div className="footer-bot-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <Link to="/admin/login">Admin Login</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}