import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.email || !form.password) return toast.error('Email and password are required');
    if (mode === 'register' && !form.name) return toast.error('Name is required');
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--green)' }}>
      <style>{`
        .al-left {
          flex:1; display:flex; align-items:center; justify-content:center;
          padding:3rem 2rem; position:relative; overflow:hidden;
        }
        .al-left::before {
          content:''; position:absolute; inset:0;
          background:url('https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200&q=60') center/cover;
          opacity:0.12;
        }
        .al-left-content { position:relative; z-index:1; max-width:420px; color:var(--cream); }
        .al-logo { display:flex; align-items:center; gap:14px; margin-bottom:2.5rem; }
        .al-logo-text .name { font-family:var(--ff-display); font-size:1.5rem; color:var(--gold); display:block; }
        .al-logo-text .sub { font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; color:rgba(226,196,122,0.55); display:block; margin-top:2px; }
        .al-headline { font-family:var(--ff-display); font-size:2.5rem; font-weight:700; line-height:1.15; margin-bottom:1.25rem; }
        .al-headline em { font-style:italic; color:var(--gold); }
        .al-desc { font-size:0.9rem; color:rgba(250,246,238,0.6); line-height:1.8; margin-bottom:2rem; }
        .al-features { display:flex; flex-direction:column; gap:12px; }
        .al-feature { display:flex; align-items:center; gap:12px; font-size:0.875rem; color:rgba(250,246,238,0.75); }
        .al-feature-dot { width:8px; height:8px; border-radius:50%; background:var(--gold); flex-shrink:0; }
        /* Right panel */
        .al-right {
          width:480px; background:var(--cream); display:flex; align-items:center; justify-content:center;
          padding:3rem 2.5rem;
        }
        .al-card { width:100%; max-width:400px; }
        .al-card-header { margin-bottom:2rem; }
        .al-card-header h2 { font-family:var(--ff-display); font-size:1.8rem; font-weight:700; color:var(--green); margin-bottom:4px; }
        .al-card-header p { font-size:0.875rem; color:var(--muted); }
        /* Tabs */
        .al-tabs { display:flex; background:var(--cream-dk); border-radius:50px; padding:3px; margin-bottom:1.75rem; }
        .al-tab { flex:1; padding:9px; text-align:center; border-radius:50px; font-size:0.85rem; font-weight:600; cursor:pointer; transition:all 0.2s; color:var(--muted); background:none; border:none; font-family:var(--ff-body); }
        .al-tab.active { background:var(--green); color:var(--gold-lt); box-shadow:0 2px 8px rgba(0,0,0,0.15); }
        /* Form */
        .al-fg { margin-bottom:1rem; }
        .al-fg label { display:block; font-size:0.78rem; font-weight:600; color:var(--ink-soft); margin-bottom:5px; letter-spacing:0.02em; }
        .al-fg-wrap { position:relative; }
        .al-fg input {
          width:100%; padding:11px 14px; border:1.5px solid var(--cream-dk);
          border-radius:var(--r); font-size:0.9rem; font-family:var(--ff-body);
          outline:none; transition:border-color 0.2s; background:var(--white); color:var(--ink);
        }
        .al-fg input:focus { border-color:var(--gold); }
        .al-pass-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); cursor:pointer; color:var(--muted); background:none; border:none; display:flex; align-items:center; }
        .al-submit { width:100%; padding:13px; border-radius:50px; font-size:0.9rem; font-weight:700; font-family:var(--ff-body); cursor:pointer; transition:all 0.2s; background:linear-gradient(135deg,var(--gold-dk),var(--gold)); color:var(--green); border:none; margin-top:6px; }
        .al-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:var(--sh-gold); }
        .al-submit:disabled { opacity:0.65; cursor:not-allowed; }
        .al-back { text-align:center; margin-top:1.5rem; font-size:0.82rem; color:var(--muted); }
        .al-back a { color:var(--green-lt); font-weight:600; }
        /* Mobile */
        @media(max-width:860px){ .al-left{display:none;} .al-right{width:100%;} }
        @media(max-width:480px){ .al-right{padding:2rem 1.25rem;} }
      `}</style>

      {/* Left branding panel */}
      <div className="al-left">
        <div className="al-left-content">
          <div className="al-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22.5" stroke="#C9A84C" strokeWidth="1.5"/>
              <path d="M24 8C17 8 12.5 12.5 12.5 18C12.5 21.5 14.2 24.5 17 26C14.2 27.5 12.5 30.5 12.5 34C12.5 40 17 44 24 44" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M24 8C31 8 35.5 12.5 35.5 18C35.5 21.5 33.8 24.5 31 26" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <line x1="17" y1="26" x2="31" y2="26" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
              <text x="24" y="42" textAnchor="middle" fontSize="7" fill="#C9A84C" fontFamily="serif" fontWeight="bold">حلال</text>
            </svg>
            <div className="al-logo-text">
              <span className="name">Bariis &amp; Pizza House</span>
              <span className="sub">Restaurant Management</span>
            </div>
          </div>
          <h2 className="al-headline">
            Manage Your<br/><em>Restaurant</em><br/>with Ease
          </h2>
          <p className="al-desc">
            Control your full menu, manage orders in real-time, update business settings, and track your restaurant performance — all from one dashboard.
          </p>
          <div className="al-features">
            {['Full menu management with image upload', 'Real-time order tracking & status updates', 'Business settings — hours, delivery links, social media', 'Customer order history and revenue stats'].map(f => (
              <div key={f} className="al-feature">
                <span className="al-feature-dot"/>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="al-right">
        <div className="al-card">
          <div className="al-card-header">
            <h2>{mode === 'login' ? 'Welcome Back' : 'First Time Setup'}</h2>
            <p>{mode === 'login' ? 'Sign in to your admin panel' : 'Create your admin account'}</p>
          </div>

          <div className="al-tabs">
            <button className={`al-tab${mode === 'login' ? ' active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
            <button className={`al-tab${mode === 'register' ? ' active' : ''}`} onClick={() => setMode('register')}>First Setup</button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="al-fg">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Admin name" autoComplete="name"/>
              </div>
            )}

            <div className="al-fg">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@bariisandpizzahouse.ca" autoComplete="email"/>
            </div>

            <div className="al-fg">
              <label>Password</label>
              <div className="al-fg-wrap">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingRight:'42px' }}
                />
                <button type="button" className="al-pass-toggle" onClick={() => setShowPass(p => !p)}>
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Admin Panel' : 'Create Admin Account'}
            </button>
          </form>

          <div className="al-back">
            <a href="/">Back to Website</a>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <a href="tel:9022929852">902-292-9852</a>
          </div>
        </div>
      </div>
    </div>
  );
}
