import React, { useState } from 'react';
import { IconPhone, IconMap, IconClock, IconMail, IconFacebook, IconInstagram, IconTiktok, IconGoogle, IconCheck } from '../components/Icons';
import toast from 'react-hot-toast';

const HOURS = [
  ['Monday',    '11:00 AM – 10:00 PM'],
  ['Tuesday',   '11:00 AM – 10:00 PM'],
  ['Wednesday', '11:00 AM – 10:00 PM'],
  ['Thursday',  '11:00 AM – 10:00 PM'],
  ['Friday',    '11:00 AM – 10:00 PM'],
  ['Saturday',  '11:00 AM – 10:00 PM'],
  ['Sunday',    '11:00 AM – 10:00 PM'],
];

const SOCIALS = [
  { label: 'Facebook', icon: <IconFacebook size={18}/>, url: '#', color: '#1877F2' },
  { label: 'Instagram', icon: <IconInstagram size={18}/>, url: '#', color: '#E1306C' },
  { label: 'TikTok', icon: <IconTiktok size={18}/>, url: '#', color: '#000' },
  { label: 'Google', icon: <IconGoogle size={18}/>, url: 'https://g.page/r/', color: '#4285F4' },
];

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return toast.error('Please fill in your name and message');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
    toast.success('Message sent! We will get back to you soon.');
  };

  return (
    <div className="contact-page pt-nav">
      <style>{`
        .contact-page { min-height:100vh;background:var(--cream); }
        /* Hero */
        .contact-hero { position:relative;height:300px;display:flex;align-items:flex-end;overflow:hidden; }
        .contact-hero img.bg { position:absolute;inset:0;width:100%;height:100%;object-fit:cover; }
        .contact-hero-overlay { position:absolute;inset:0;background:linear-gradient(0deg,rgba(14,40,24,0.92),rgba(14,40,24,0.35)); }
        .contact-hero-text { position:relative;z-index:2;padding:2.5rem; }
        .contact-hero-text h1 { font-family:var(--ff-display);font-size:clamp(2rem,4vw,3rem);font-weight:700;color:white; }
        .contact-hero-text p { color:rgba(255,255,255,0.6);margin-top:6px; }
        /* Layout */
        .contact-body { max-width:1180px;margin:0 auto;padding:3rem 24px 5rem;display:grid;grid-template-columns:1fr 1.1fr;gap:2.5rem;align-items:start; }
        /* Info column */
        .info-col { display:flex;flex-direction:column;gap:1.5rem; }
        .info-card { background:var(--white);border-radius:var(--r-lg);padding:1.75rem;box-shadow:var(--sh-sm); }
        .info-card h2 { font-family:var(--ff-display);font-size:1.25rem;font-weight:700;color:var(--green);margin-bottom:1.25rem; }
        /* Contact rows */
        .contact-row { display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid var(--cream-dk); }
        .contact-row:last-child { border-bottom:none; }
        .cr-icon { width:38px;height:38px;border-radius:var(--r);background:rgba(14,40,24,0.07);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .cr-icon svg { color:var(--green); }
        .cr-label { font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:3px; }
        .cr-value { font-size:0.9rem;font-weight:500;color:var(--ink); }
        .cr-value a:hover { color:var(--gold-dk); }
        /* Hours table */
        .hours-table { width:100%; }
        .hours-row { display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--cream-dk);font-size:0.875rem; }
        .hours-row:last-child { border-bottom:none; }
        .hours-row .day { color:var(--ink-soft);font-weight:500; }
        .hours-row .time { color:var(--green-lt);font-weight:600; }
        /* Social links */
        .social-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:10px; }
        .social-link { display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:var(--r);border:1.5px solid var(--cream-dk);font-size:0.85rem;font-weight:600;color:var(--ink-soft);transition:all 0.2s; }
        .social-link:hover { border-color:var(--gold);color:var(--green);transform:translateY(-1px);box-shadow:var(--sh-sm); }
        .social-dot { width:8px;height:8px;border-radius:50%;margin-left:auto; }
        /* Map */
        .map-card { background:var(--white);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--sh-sm); }
        .map-embed { width:100%;height:280px;border:none;display:block; }
        .map-footer { padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--cream-dk); }
        .map-footer p { font-size:0.8rem;color:var(--muted); }
        /* Form column */
        .form-col { display:flex;flex-direction:column;gap:1.5rem; }
        .form-card { background:var(--white);border-radius:var(--r-lg);padding:2rem;box-shadow:var(--sh-sm); }
        .form-card h2 { font-family:var(--ff-display);font-size:1.3rem;font-weight:700;color:var(--green);margin-bottom:6px; }
        .form-card .sub { font-size:0.85rem;color:var(--muted);margin-bottom:1.5rem; }
        .form-row2 { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .fg { margin-bottom:14px; }
        .fg label { display:block;font-weight:600;font-size:0.8rem;color:var(--ink-soft);margin-bottom:5px; }
        .fg input,.fg textarea { width:100%;padding:11px 14px;border:1.5px solid var(--cream-dk);border-radius:var(--r);font-size:0.9rem;font-family:var(--ff-body);outline:none;transition:border-color 0.2s;background:var(--white); }
        .fg input:focus,.fg textarea:focus { border-color:var(--gold); }
        .req { color:var(--red); }
        /* Success state */
        .form-success { text-align:center;padding:3rem 1rem; }
        .success-circle { width:64px;height:64px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem; }
        .form-success h3 { font-family:var(--ff-display);font-size:1.5rem;color:var(--green);margin-bottom:8px; }
        .form-success p { font-size:0.875rem;color:var(--muted); }
        /* Google CTA card */
        .google-card { background:var(--white);border-radius:var(--r-lg);padding:1.75rem;box-shadow:var(--sh-sm);border:1px solid var(--border); }
        .google-card h3 { font-family:var(--ff-display);font-size:1.1rem;color:var(--green);margin-bottom:6px; }
        .google-card p { font-size:0.83rem;color:var(--muted);margin-bottom:1.25rem;line-height:1.7; }
        .stars-row { display:flex;gap:3px;margin-bottom:10px; }
        .stars-row svg { fill:var(--gold);stroke:none; }
        /* Responsive */
        @media(max-width:900px){ .contact-body{grid-template-columns:1fr;} }
        @media(max-width:480px){ .form-row2{grid-template-columns:1fr;} .social-grid{grid-template-columns:1fr;} }
      `}</style>

      {/* Hero */}
      <div className="contact-hero">
        <img className="bg" src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80" alt="Contact Us"/>
        <div className="contact-hero-overlay"/>
        <div className="contact-hero-text">
          <div className="section-label" style={{ marginBottom:'10px' }}>Get In Touch</div>
          <h1>Contact Us</h1>
          <p>Visit us, call us, or send a message — we are here for you</p>
        </div>
      </div>

      <div className="contact-body">
        {/* Left: Info */}
        <div className="info-col">
          {/* Contact details */}
          <div className="info-card">
            <h2>Contact Information</h2>
            {[
              { icon:<IconMap size={18}/>, label:'Address', value:<a href="https://maps.google.com/?q=9005+Commercial+Street+New+Minas+Nova+Scotia" target="_blank" rel="noreferrer">9005 Commercial Street, New Minas, Nova Scotia</a> },
              { icon:<IconPhone size={18}/>, label:'Phone', value:<a href="tel:9022929852">902-292-9852</a> },
              { icon:<IconMail size={18}/>, label:'Email', value:<a href="mailto:info@bariisandpizzahouse.ca">info@bariisandpizzahouse.ca</a> },
            ].map(r => (
              <div key={r.label} className="contact-row">
                <div className="cr-icon">{r.icon}</div>
                <div>
                  <div className="cr-label">{r.label}</div>
                  <div className="cr-value">{r.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Hours */}
          <div className="info-card">
            <h2>
              <span style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <IconClock size={18} color="var(--green)"/> Hours of Operation
              </span>
            </h2>
            <div className="hours-table">
              {HOURS.map(([day, time]) => (
                <div key={day} className="hours-row">
                  <span className="day">{day}</span>
                  <span className="time">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="info-card">
            <h2>Follow Us</h2>
            <div className="social-grid">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="social-link">
                  <span style={{ color:s.color }}>{s.icon}</span>
                  {s.label}
                  <span className="social-dot" style={{ background:s.color }}/>
                </a>
              ))}
            </div>
          </div>

          {/* Embedded Map */}
          <div className="map-card">
            <iframe
              className="map-embed"
              title="Bariis & Pizza House Location"
              src="https://maps.google.com/maps?q=9005+Commercial+Street+New+Minas+Nova+Scotia+Canada&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="map-footer">
              <p>9005 Commercial Street, New Minas, NS</p>
              <a href="https://maps.google.com/?q=9005+Commercial+Street+New+Minas+Nova+Scotia" target="_blank" rel="noreferrer" className="btn btn-gold btn-sm">
                <IconMap size={13}/> Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Right: Form + Google */}
        <div className="form-col">
          <div className="form-card">
            <h2>Send Us a Message</h2>
            <p className="sub">For catering enquiries, feedback, or any questions — we typically respond within a few hours.</p>

            {sent ? (
              <div className="form-success">
                <div className="success-circle"><IconCheck size={28} color="var(--gold)"/></div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We will get back to you shortly.<br/>Or call us directly at <a href="tel:9022929852" style={{ color:'var(--gold-dk)', fontWeight:600 }}>902-292-9852</a></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row2">
                  <div className="fg"><label>Your Name <span className="req">*</span></label><input name="name" value={form.name} onChange={handleChange} placeholder="Full name"/></div>
                  <div className="fg"><label>Phone Number</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="902-XXX-XXXX"/></div>
                </div>
                <div className="fg"><label>Email Address</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com"/></div>
                <div className="fg"><label>Your Message <span className="req">*</span></label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Tell us about your catering needs, leave feedback, or ask a question..." style={{ resize:'vertical' }}/>
                </div>
                <button type="submit" className="btn btn-gold" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Google Reviews / Business Profile */}
          <div className="google-card">
            <div className="stars-row">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
            </div>
            <h3>Love our food? Leave a Google Review!</h3>
            <p>Reviews help our community discover us and help us serve you better. It only takes 30 seconds and means the world to us.</p>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <a href="https://g.page/r/" target="_blank" rel="noreferrer" className="btn btn-gold btn-sm">
                <IconGoogle size={14}/> Write a Review
              </a>
              <a href="https://www.google.com/maps/search/Bariis+Pizza+House+New+Minas" target="_blank" rel="noreferrer" className="btn btn-outline-gold btn-sm">
                View on Google Maps
              </a>
            </div>
          </div>

          {/* Quick call CTA */}
          <div style={{ background:'var(--green)',borderRadius:'var(--r-lg)',padding:'1.75rem',textAlign:'center' }}>
            <h3 style={{ fontFamily:'var(--ff-display)',fontSize:'1.3rem',color:'var(--cream)',marginBottom:'6px' }}>Prefer to Call?</h3>
            <p style={{ color:'rgba(250,246,238,0.6)',fontSize:'0.85rem',marginBottom:'1.25rem' }}>Our team is ready to take your order or answer your questions</p>
            <a href="tel:9022929852" className="btn btn-gold btn-lg" style={{ display:'inline-flex' }}>
              <IconPhone size={17}/> 902-292-9852
            </a>
            <p style={{ color:'rgba(250,246,238,0.45)',fontSize:'0.75rem',marginTop:'10px' }}>Monday – Sunday, 11:00 AM – 10:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
