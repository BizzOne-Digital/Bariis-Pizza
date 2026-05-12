import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconList, IconPackage, IconSettings, IconLogout, IconPlus,
  IconEdit, IconTrash, IconRefresh, IconDollar, IconUser, IconCheck
} from '../components/Icons';
import {
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, seedMenu,
  getOrders, updateOrderStatus, getOrderStats, getSettings, updateSettings
} from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { key: 'somali-rice',       label: 'Somali Dishes (Rice)' },
  { key: 'somali-specialties',label: 'Somali Specialties' },
  { key: 'pizza',             label: 'Halal Pizza' },
  { key: 'sambusa-snacks',    label: 'Sambusa & Snacks' },
  { key: 'sides',             label: 'Sides' },
  { key: 'drinks',            label: 'Drinks & Tea' },
  { key: 'combos',            label: 'Lunch Specials / Combos' },
  { key: 'family-platters',   label: 'Family Platters' },
];

const STATUS_COLORS = {
  pending:'#E67E22', confirmed:'#3498DB', preparing:'#9B59B6',
  ready:'#27AE60', delivered:'#2ECC71', cancelled:'#E74C3C'
};

const EMPTY_ITEM = { name:'', description:'', price:'', category:'somali-rice', available:true, featured:false, tags:'' };

/* ── Sidebar Nav Item ── */
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    style={{
      display:'flex', alignItems:'center', gap:'10px',
      width:'100%', padding:'11px 16px', borderRadius:'8px',
      background: active ? 'rgba(201,168,76,0.15)' : 'none',
      border: active ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
      color: active ? 'var(--gold)' : 'rgba(250,246,238,0.6)',
      fontSize:'0.875rem', fontWeight:600,
      cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--ff-body)',
      textAlign:'left', marginBottom:'2px', position:'relative'
    }}
  >
    <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
    {label}
    {badge > 0 && (
      <span style={{ marginLeft:'auto', background:'var(--red)', color:'white', fontSize:'0.65rem', fontWeight:700, padding:'2px 7px', borderRadius:'10px' }}>
        {badge}
      </span>
    )}
  </button>
);

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, sub, accent }) => (
  <div style={{ background:'var(--white)', borderRadius:'var(--r-lg)', padding:'1.5rem', boxShadow:'var(--sh-sm)', border:'1px solid rgba(0,0,0,0.04)' }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'12px' }}>
      <div style={{ width:'44px', height:'44px', borderRadius:'10px', background: accent || 'rgba(14,40,24,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {icon}
      </div>
    </div>
    <div style={{ fontFamily:'var(--ff-display)', fontSize:'2rem', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>{value}</div>
    <div style={{ fontSize:'0.82rem', color:'var(--muted)', marginTop:'4px' }}>{label}</div>
    {sub && <div style={{ fontSize:'0.75rem', color:'var(--green-lt)', marginTop:'4px', fontWeight:500 }}>{sub}</div>}
  </div>
);

/* ── Toggle Switch ── */
const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    style={{
      width:'44px', height:'24px', borderRadius:'12px', border:'none',
      background: value ? 'var(--green-lt)' : '#ccc',
      position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0
    }}
  >
    <span style={{
      position:'absolute', top:'3px',
      left: value ? '23px' : '3px',
      width:'18px', height:'18px', borderRadius:'50%',
      background:'white', transition:'left 0.2s',
      boxShadow:'0 1px 4px rgba(0,0,0,0.2)'
    }}/>
  </button>
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [sizes, setSizes] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!user) navigate('/admin/login'); }, [user, navigate]);

  const loadStats   = useCallback(async () => { try { const r = await getOrderStats(); setStats(r.data); } catch {} }, []);
  const loadMenu    = useCallback(async () => { setLoading(true); try { const r = await getMenuItems(); setMenuItems(r.data); } catch {} setLoading(false); }, []);
  const loadOrders  = useCallback(async () => { setLoading(true); try { const r = await getOrders(orderFilter ? { status: orderFilter } : {}); setOrders(r.data); } catch {} setLoading(false); }, [orderFilter]);
  const loadSettings= useCallback(async () => { try { const r = await getSettings(); setSettings(r.data); } catch {} }, []);

  useEffect(() => {
    if (tab === 'dashboard') loadStats();
    if (tab === 'menu')      loadMenu();
    if (tab === 'orders')    loadOrders();
    if (tab === 'settings')  loadSettings();
  }, [tab]);

  useEffect(() => { if (tab === 'orders') loadOrders(); }, [orderFilter]);

  const openNew  = () => { setEditItem(null); setForm(EMPTY_ITEM); setSizes([]); setImgFile(null); setShowForm(true); };
  const openEdit = item => { setEditItem(item); setForm({ ...item, tags: item.tags?.join(', ') || '' }); setSizes(item.sizes || []); setImgFile(null); setShowForm(true); };

  const saveItem = async () => {
    if (!form.name || !form.price) return toast.error('Name and price are required');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (k !== 'sizes' && k !== 'tags' && k !== '_id') fd.append(k, v); });
    fd.append('sizes', JSON.stringify(sizes));
    fd.append('tags', JSON.stringify(form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []));
    if (imgFile) fd.append('image', imgFile);
    try {
      if (editItem) { await updateMenuItem(editItem._id, fd); toast.success('Item updated'); }
      else { await createMenuItem(fd); toast.success('Item created'); }
      setShowForm(false); loadMenu();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
  };

  const delItem = async id => {
    if (!window.confirm('Delete this item?')) return;
    try { await deleteMenuItem(id); toast.success('Deleted'); loadMenu(); } catch { toast.error('Delete failed'); }
  };

  const handleSeed = async () => {
    if (!window.confirm('Replace all menu items with default items from your menu PDF?')) return;
    try { await seedMenu(); toast.success('Menu seeded with all default items'); loadMenu(); } catch { toast.error('Seed failed'); }
  };

  const updateStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); loadOrders(); } catch { toast.error('Update failed'); }
  };

  const saveSettings = async () => {
    try { await updateSettings(settings); toast.success('Settings saved'); } catch { toast.error('Save failed'); }
  };

  const filtered = catFilter === 'all' ? menuItems : menuItems.filter(i => i.category === catFilter);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  const navItems = [
    { key:'dashboard', label:'Dashboard',      icon:<IconDollar size={17}/> },
    { key:'menu',      label:'Menu Items',     icon:<IconList size={17}/> },
    { key:'orders',    label:'Orders',         icon:<IconPackage size={17}/>, badge: pendingCount },
    { key:'settings',  label:'Settings',       icon:<IconSettings size={17}/> },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'var(--ff-body)', background:'#F4F5F7' }}>
      <style>{`
        /* Sidebar */
        .adm-sidebar {
          width:240px; background:var(--ink-soft); display:flex; flex-direction:column;
          position:fixed; top:0; bottom:0; left:0; z-index:500;
          transition:transform 0.3s;
        }
        .adm-sidebar-brand { padding:1.5rem 1.25rem; border-bottom:1px solid rgba(201,168,76,0.12); }
        .adm-sidebar-brand .bname { font-family:var(--ff-display); font-size:1rem; color:var(--gold); display:block; line-height:1.3; }
        .adm-sidebar-brand .btag  { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(226,196,122,0.4); display:block; margin-top:2px; }
        .adm-sidebar-nav { flex:1; padding:1rem 10px; overflow-y:auto; }
        .adm-sidebar-foot { padding:1rem 10px 1.25rem; border-top:1px solid rgba(201,168,76,0.1); }
        .adm-user-row { display:flex; align-items:center; gap:8px; padding:8px 6px; margin-bottom:6px; }
        .adm-user-avatar { width:30px; height:30px; border-radius:50%; background:rgba(201,168,76,0.15); display:flex; align-items:center; justify-content:center; color:var(--gold); flex-shrink:0; }
        .adm-user-info .uname { font-size:0.8rem; font-weight:600; color:rgba(250,246,238,0.8); }
        .adm-user-info .urole { font-size:0.68rem; color:rgba(250,246,238,0.35); }
        .adm-logout { display:flex; align-items:center; gap:8px; width:100%; padding:9px 10px; color:rgba(250,246,238,0.4); font-size:0.8rem; cursor:pointer; border-radius:6px; transition:all 0.2s; border:none; background:none; font-family:var(--ff-body); }
        .adm-logout:hover { color:var(--red); background:rgba(184,50,50,0.08); }
        /* Main */
        .adm-main { margin-left:240px; flex:1; display:flex; flex-direction:column; min-height:100vh; }
        .adm-topbar { background:var(--white); padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(0,0,0,0.07); box-shadow:0 1px 8px rgba(0,0,0,0.05); position:sticky; top:0; z-index:100; }
        .adm-topbar h1 { font-size:1rem; font-weight:700; color:var(--ink-soft); }
        .adm-topbar-right { display:flex; align-items:center; gap:10px; }
        .adm-halal-pill { display:flex; align-items:center; gap:6px; padding:5px 12px; border:1px solid var(--border); border-radius:20px; font-size:0.72rem; font-weight:600; color:var(--green); }
        .adm-content { flex:1; padding:1.75rem 2rem; overflow-y:auto; }
        /* Stats grid */
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:1.75rem; }
        /* Table card */
        .tbl-card { background:var(--white); border-radius:var(--r-lg); box-shadow:var(--sh-sm); overflow:hidden; }
        .tbl-header { padding:1rem 1.5rem; border-bottom:1px solid rgba(0,0,0,0.06); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
        .tbl-header h2 { font-size:0.95rem; font-weight:700; color:var(--ink-soft); }
        .tbl-filters { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
        .flt-btn { padding:6px 14px; border-radius:20px; border:1.5px solid rgba(0,0,0,0.1); background:none; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:var(--ff-body); color:var(--muted); }
        .flt-btn.active { background:var(--green); color:var(--gold-lt); border-color:var(--green); }
        .flt-select { padding:6px 10px; border-radius:8px; border:1.5px solid rgba(0,0,0,0.1); font-size:0.8rem; font-family:var(--ff-body); outline:none; cursor:pointer; }
        /* Table */
        .data-table { width:100%; border-collapse:collapse; }
        .data-table th { padding:10px 16px; text-align:left; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); border-bottom:2px solid rgba(0,0,0,0.06); white-space:nowrap; }
        .data-table td { padding:12px 16px; font-size:0.845rem; border-bottom:1px solid rgba(0,0,0,0.04); color:var(--ink-soft); vertical-align:middle; }
        .data-table tr:hover td { background:rgba(0,0,0,0.01); }
        .data-table tr:last-child td { border-bottom:none; }
        .item-row { display:flex; align-items:center; gap:10px; }
        .item-thumb { width:40px; height:40px; border-radius:8px; overflow:hidden; background:var(--cream-dk); flex-shrink:0; }
        .item-thumb img { width:100%; height:100%; object-fit:cover; }
        .item-name { font-weight:600; font-size:0.875rem; color:var(--ink); }
        .item-desc { font-size:0.75rem; color:var(--muted); margin-top:1px; max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .stat-pill { display:inline-block; padding:3px 9px; border-radius:20px; font-size:0.7rem; font-weight:700; }
        .pill-avail { background:#E8F5E9; color:#2E7D32; }
        .pill-unavail { background:#FFEBEE; color:#C62828; }
        .pill-feat { background:#FFF8E1; color:#F57F17; margin-left:4px; }
        .status-pill { padding:4px 10px; border-radius:20px; font-size:0.7rem; font-weight:700; color:white; text-transform:uppercase; letter-spacing:0.04em; }
        .act-btns { display:flex; gap:4px; }
        .act-btn { width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; border:none; background:none; }
        .act-btn.edit { color:var(--green-lt); } .act-btn.edit:hover { background:rgba(45,106,79,0.1); }
        .act-btn.del  { color:var(--red); }     .act-btn.del:hover  { background:rgba(184,50,50,0.1); }
        .status-sel { padding:5px 8px; border-radius:7px; border:1.5px solid rgba(0,0,0,0.1); font-size:0.78rem; font-family:var(--ff-body); cursor:pointer; outline:none; }
        /* Form Modal */
        .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center; padding:1rem; backdrop-filter:blur(4px); }
        .modal-box { background:var(--white); border-radius:var(--r-xl); width:100%; max-width:560px; max-height:90vh; overflow-y:auto; box-shadow:var(--sh-lg); }
        .modal-head { padding:1.5rem 1.75rem 1rem; border-bottom:1px solid var(--cream-dk); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:white; z-index:1; }
        .modal-head h2 { font-family:var(--ff-display); font-size:1.3rem; color:var(--green); }
        .modal-close { padding:6px; border-radius:8px; cursor:pointer; color:var(--muted); transition:all 0.2s; }
        .modal-close:hover { background:var(--cream-dk); color:var(--ink); }
        .modal-body { padding:1.5rem 1.75rem; }
        .modal-foot { padding:1rem 1.75rem 1.5rem; border-top:1px solid var(--cream-dk); display:flex; gap:10px; justify-content:flex-end; }
        .mfg { margin-bottom:1rem; }
        .mfg label { display:block; font-size:0.78rem; font-weight:600; color:var(--ink-soft); margin-bottom:5px; }
        .mfg input,.mfg textarea,.mfg select { width:100%; padding:10px 13px; border:1.5px solid var(--cream-dk); border-radius:var(--r); font-size:0.875rem; font-family:var(--ff-body); outline:none; transition:border-color 0.2s; background:var(--white); }
        .mfg input:focus,.mfg textarea:focus,.mfg select:focus { border-color:var(--gold); }
        .mfg-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:10px 13px; background:var(--cream); border-radius:var(--r); margin-bottom:8px; }
        .toggle-row label { font-size:0.875rem; font-weight:600; color:var(--ink-soft); }
        .size-row { display:flex; gap:8px; align-items:center; margin-bottom:6px; }
        .size-row input { flex:1; padding:8px 10px; border:1.5px solid var(--cream-dk); border-radius:8px; font-size:0.82rem; font-family:var(--ff-body); outline:none; }
        .size-row input:focus { border-color:var(--gold); }
        .add-size-row { padding:7px 12px; border-radius:8px; background:var(--cream); border:1.5px dashed var(--cream-dk); font-size:0.8rem; font-weight:600; cursor:pointer; color:var(--muted); transition:all 0.2s; width:100%; text-align:left; font-family:var(--ff-body); }
        .add-size-row:hover { border-color:var(--gold); color:var(--green); }
        /* Settings */
        .settings-section { background:var(--white); border-radius:var(--r-lg); padding:1.75rem; box-shadow:var(--sh-sm); margin-bottom:1.5rem; }
        .settings-section h3 { font-family:var(--ff-display); font-size:1.1rem; color:var(--green); margin-bottom:1.25rem; padding-bottom:10px; border-bottom:1px solid var(--cream-dk); }
        .sfg { margin-bottom:1rem; }
        .sfg label { display:block; font-size:0.78rem; font-weight:600; color:var(--ink-soft); margin-bottom:5px; }
        .sfg input { width:100%; padding:10px 13px; border:1.5px solid var(--cream-dk); border-radius:var(--r); font-size:0.875rem; font-family:var(--ff-body); outline:none; transition:border-color 0.2s; }
        .sfg input:focus { border-color:var(--gold); }
        .sfg-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        /* Quick actions */
        .qa-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; margin-top:1.5rem; }
        .qa-card { background:var(--white); border-radius:var(--r-lg); padding:1.25rem; border:1.5px solid var(--cream-dk); cursor:pointer; transition:all 0.2s; text-align:center; }
        .qa-card:hover { border-color:var(--gold); box-shadow:var(--sh-sm); transform:translateY(-2px); }
        .qa-card .qa-icon { width:44px; height:44px; border-radius:10px; background:rgba(14,40,24,0.07); display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
        .qa-card .qa-label { font-weight:600; font-size:0.85rem; color:var(--ink-soft); }
        .qa-card .qa-sub { font-size:0.75rem; color:var(--muted); margin-top:2px; }
        /* Mobile */
        .adm-burger { display:none; }
        @media(max-width:900px) {
          .adm-sidebar { transform:translateX(-100%); }
          .adm-sidebar.open { transform:translateX(0); }
          .adm-main { margin-left:0; }
          .adm-burger { display:flex; align-items:center; color:var(--green); cursor:pointer; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:480px) {
          .stats-grid { grid-template-columns:1fr; }
          .adm-content { padding:1rem; }
          .mfg-row,.sfg-row { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`adm-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="adm-sidebar-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ marginBottom:'8px' }}>
            <circle cx="16" cy="16" r="14.5" stroke="#C9A84C" strokeWidth="1.2"/>
            <path d="M16 5C11 5 8 8 8 12C8 14.5 9.3 16.5 11.5 17.5C9.3 18.5 8 20.5 8 23C8 27.5 11.5 31 16 31" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M16 5C21 5 24 8 24 12C24 14.5 22.7 16.5 20.5 17.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <line x1="11.5" y1="17.5" x2="20.5" y2="17.5" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className="bname">Bariis &amp; Pizza House</span>
          <span className="btag">Admin Dashboard</span>
        </div>
        <nav className="adm-sidebar-nav">
          {navItems.map(n => (
            <NavItem key={n.key} icon={n.icon} label={n.label} active={tab === n.key} badge={n.badge} onClick={() => { setTab(n.key); setSidebarOpen(false); }}/>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <div className="adm-user-row">
            <div className="adm-user-avatar"><IconUser size={14}/></div>
            <div className="adm-user-info">
              <div className="uname">{user?.name}</div>
              <div className="urole">Administrator</div>
            </div>
          </div>
          <button className="adm-logout" onClick={() => { logout(); navigate('/'); }}>
            <IconLogout size={15}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="adm-main">
        {/* Topbar */}
        <div className="adm-topbar">
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <button className="adm-burger" onClick={() => setSidebarOpen(o => !o)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1>
              {tab === 'dashboard' && 'Dashboard Overview'}
              {tab === 'menu'      && 'Menu Management'}
              {tab === 'orders'    && 'Order Management'}
              {tab === 'settings'  && 'Restaurant Settings'}
            </h1>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-halal-pill">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="var(--green)"/><text x="5" y="7.5" textAnchor="middle" fontSize="4" fill="var(--green)" fontFamily="serif">ح</text></svg>
              100% Halal
            </div>
            <a href="/" target="_blank" rel="noreferrer" style={{ fontSize:'0.78rem', color:'var(--muted)', padding:'6px 12px', border:'1px solid var(--cream-dk)', borderRadius:'7px', fontWeight:500 }}>
              View Website
            </a>
          </div>
        </div>

        <div className="adm-content">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <StatCard icon={<IconPackage size={20} color="var(--green)"/>} label="Total Orders" value={stats.totalOrders ?? '—'} accent="rgba(14,40,24,0.1)"/>
                <StatCard icon={<IconPackage size={20} color="#3498DB"/>}   label="Today's Orders" value={stats.todayOrders ?? '—'} accent="rgba(52,152,219,0.1)" sub="Since midnight"/>
                <StatCard icon={<IconDollar size={20} color="var(--gold-dk)"/>} label="Total Revenue" value={stats.totalRevenue != null ? `$${stats.totalRevenue.toFixed(2)}` : '—'} accent="rgba(201,168,76,0.1)"/>
                <StatCard icon={<IconRefresh size={20} color="#E67E22"/>}   label="Pending Orders" value={stats.pendingOrders ?? '—'} accent="rgba(230,126,34,0.1)" sub="Need attention"/>
              </div>

              {/* Quick actions */}
              <div className="tbl-card" style={{ padding:'1.5rem' }}>
                <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'var(--ink-soft)', marginBottom:'4px' }}>Quick Actions</h2>
                <p style={{ fontSize:'0.82rem', color:'var(--muted)', marginBottom:'1.25rem' }}>Manage your restaurant from here</p>
                <div className="qa-grid">
                  {[
                    { label:'Add Menu Item', sub:'Create a new dish', icon:<IconPlus size={20} color="var(--green)"/>, action: () => { setTab('menu'); openNew(); } },
                    { label:'View Orders',   sub:'Check latest orders', icon:<IconPackage size={20} color="#3498DB"/>, action: () => setTab('orders') },
                    { label:'Seed Menu',     sub:'Load default items from PDF', icon:<IconRefresh size={20} color="var(--gold-dk)"/>, action: handleSeed },
                    { label:'Settings',      sub:'Update business info', icon:<IconSettings size={20} color="#9B59B6"/>, action: () => setTab('settings') },
                  ].map(qa => (
                    <div key={qa.label} className="qa-card" onClick={qa.action}>
                      <div className="qa-icon">{qa.icon}</div>
                      <div className="qa-label">{qa.label}</div>
                      <div className="qa-sub">{qa.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── MENU ── */}
          {tab === 'menu' && (
            <div className="tbl-card">
              <div className="tbl-header">
                <h2>Menu Items ({filtered.length})</h2>
                <div className="tbl-filters">
                  <select className="flt-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                  <button className="btn btn-gold btn-sm" onClick={openNew} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <IconPlus size={14}/> Add Item
                  </button>
                  <button className="btn btn-outline-gold btn-sm" onClick={handleSeed} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <IconRefresh size={13}/> Seed Defaults
                  </button>
                  <button className="act-btn edit" onClick={loadMenu} title="Refresh"><IconRefresh size={15}/></button>
                </div>
              </div>
              {loading ? <div className="spinner"/> : (
                <div style={{ overflowX:'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>No items. Click "Seed Defaults" to load your menu.</td></tr>
                      ) : filtered.map(item => (
                        <tr key={item._id}>
                          <td>
                            <div className="item-row">
                              <div className="item-thumb">
                                <img src={item.image || `https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&q=60`} alt={item.name}/>
                              </div>
                              <div>
                                <div className="item-name">{item.name}</div>
                                <div className="item-desc">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize:'0.8rem', color:'var(--muted)', whiteSpace:'nowrap' }}>
                            {CATEGORIES.find(c => c.key === item.category)?.label || item.category}
                          </td>
                          <td style={{ fontWeight:700, fontFamily:'var(--ff-display)', color:'var(--green)', whiteSpace:'nowrap' }}>
                            ${item.price.toFixed(2)}
                          </td>
                          <td>
                            <span className={`stat-pill ${item.available ? 'pill-avail' : 'pill-unavail'}`}>
                              {item.available ? 'Available' : 'Hidden'}
                            </span>
                            {item.featured && <span className="stat-pill pill-feat">Featured</span>}
                          </td>
                          <td>
                            <div className="act-btns">
                              <button className="act-btn edit" onClick={() => openEdit(item)} title="Edit"><IconEdit size={15}/></button>
                              <button className="act-btn del"  onClick={() => delItem(item._id)} title="Delete"><IconTrash size={15}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === 'orders' && (
            <div className="tbl-card">
              <div className="tbl-header">
                <h2>Orders ({orders.length})</h2>
                <div className="tbl-filters">
                  {['', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(s => (
                    <button key={s} className={`flt-btn${orderFilter === s ? ' active' : ''}`} onClick={() => setOrderFilter(s)}>
                      {s || 'All'}
                    </button>
                  ))}
                  <button className="act-btn edit" onClick={loadOrders}><IconRefresh size={15}/></button>
                </div>
              </div>
              {loading ? <div className="spinner"/> : (
                <div style={{ overflowX:'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Customer</th><th>Items</th><th>Total</th><th>Type</th><th>Status</th><th>Time</th><th>Update</th></tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'var(--muted)' }}>No orders found</td></tr>
                      ) : orders.map(order => (
                        <tr key={order._id}>
                          <td>
                            <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{order.customerName}</div>
                            <div style={{ fontSize:'0.75rem', color:'var(--muted)' }}>{order.customerPhone}</div>
                          </td>
                          <td style={{ fontSize:'0.78rem', color:'var(--muted)', maxWidth:'220px' }}>
                            {order.items.map(i => `${i.name}${i.size ? ` (${i.size})` : ''} ×${i.quantity}`).join(', ')}
                          </td>
                          <td style={{ fontWeight:700, fontFamily:'var(--ff-display)', color:'var(--green)', whiteSpace:'nowrap' }}>
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td style={{ fontSize:'0.8rem', textTransform:'capitalize', whiteSpace:'nowrap' }}>{order.orderType}</td>
                          <td>
                            <span className="status-pill" style={{ background: STATUS_COLORS[order.status] || '#999' }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ fontSize:'0.75rem', color:'var(--muted)', whiteSpace:'nowrap' }}>
                            {new Date(order.createdAt).toLocaleString('en-CA', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                          </td>
                          <td>
                            <select className="status-sel" value={order.status} onChange={e => updateStatus(order._id, e.target.value)}>
                              {['pending','confirmed','preparing','ready','delivered','cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && settings && (
            <div>
              <div className="settings-section">
                <h3>Restaurant Information</h3>
                <div className="sfg-row">
                  <div className="sfg"><label>Restaurant Name</label><input value={settings.restaurantName || ''} onChange={e => setSettings({...settings, restaurantName:e.target.value})}/></div>
                  <div className="sfg"><label>Tagline</label><input value={settings.tagline || ''} onChange={e => setSettings({...settings, tagline:e.target.value})}/></div>
                </div>
                <div className="sfg-row">
                  <div className="sfg"><label>Phone Number</label><input value={settings.phone || ''} onChange={e => setSettings({...settings, phone:e.target.value})}/></div>
                  <div className="sfg"><label>Email Address</label><input value={settings.email || ''} onChange={e => setSettings({...settings, email:e.target.value})}/></div>
                </div>
                <div className="sfg"><label>Address</label><input value={settings.address || ''} onChange={e => setSettings({...settings, address:e.target.value})}/></div>
              </div>

              <div className="settings-section">
                <h3>Delivery Platform Links</h3>
                <div className="sfg-row">
                  <div className="sfg"><label>DoorDash URL</label><input value={settings.deliveryLinks?.doordash || ''} onChange={e => setSettings({...settings, deliveryLinks:{...settings.deliveryLinks, doordash:e.target.value}})} placeholder="https://doordash.com/store/..."/></div>
                  <div className="sfg"><label>Uber Eats URL</label><input value={settings.deliveryLinks?.ubereats || ''} onChange={e => setSettings({...settings, deliveryLinks:{...settings.deliveryLinks, ubereats:e.target.value}})} placeholder="https://ubereats.com/store/..."/></div>
                </div>
                <div className="sfg"><label>Skip The Dishes URL</label><input value={settings.deliveryLinks?.skipthedishes || ''} onChange={e => setSettings({...settings, deliveryLinks:{...settings.deliveryLinks, skipthedishes:e.target.value}})} placeholder="https://skipthedishes.com/..."/></div>
              </div>

              <div className="settings-section">
                <h3>Social Media Links</h3>
                <div className="sfg-row">
                  {['facebook','instagram','tiktok','snapchat'].map(s => (
                    <div key={s} className="sfg">
                      <label style={{ textTransform:'capitalize' }}>{s}</label>
                      <input value={settings.socialMedia?.[s] || ''} onChange={e => setSettings({...settings, socialMedia:{...settings.socialMedia, [s]:e.target.value}})} placeholder={`https://${s}.com/...`}/>
                    </div>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <h3>Order Settings</h3>
                <div className="toggle-row" style={{ marginBottom:'12px' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--ink-soft)' }}>Accept Online Orders</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--muted)', marginTop:'2px' }}>Toggle to pause/resume online ordering</div>
                  </div>
                  <Toggle value={settings.isAcceptingOrders ?? true} onChange={v => setSettings({...settings, isAcceptingOrders:v})}/>
                </div>
                <div className="sfg-row">
                  <div className="sfg"><label>Pickup Time (minutes)</label><input type="number" value={settings.estimatedPickupTime || 20} onChange={e => setSettings({...settings, estimatedPickupTime:parseInt(e.target.value)})}/></div>
                  <div className="sfg"><label>Min Order Amount ($)</label><input type="number" step="0.01" value={settings.minimumOrderAmount || 0} onChange={e => setSettings({...settings, minimumOrderAmount:parseFloat(e.target.value)})}/></div>
                </div>
              </div>

              <button className="btn btn-gold" onClick={saveSettings} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <IconCheck size={16}/> Save All Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MENU ITEM FORM MODAL ── */}
      {showForm && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <h2>{editItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="mfg"><label>Item Name</label><input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Bariis & Suqaar"/></div>
              <div className="mfg"><label>Description</label><textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} rows={2} placeholder="Brief description of the dish..." style={{resize:'vertical'}}/></div>
              <div className="mfg-row">
                <div className="mfg"><label>Price ($)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} placeholder="0.00"/></div>
                <div className="mfg"><label>Category</label>
                  <select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="mfg"><label>Tags (comma separated)</label><input value={form.tags} onChange={e => setForm(p=>({...p,tags:e.target.value}))} placeholder="halal, popular, vegetarian, spicy"/></div>
              <div className="toggle-row"><label>Available for Order</label><Toggle value={form.available} onChange={v => setForm(p=>({...p,available:v}))}/></div>
              <div className="toggle-row"><label>Featured on Homepage</label><Toggle value={form.featured} onChange={v => setForm(p=>({...p,featured:v}))}/></div>
              {/* Pizza sizes */}
              <div className="mfg" style={{ marginTop:'4px' }}>
                <label>Pizza Sizes (optional — add if item has multiple sizes)</label>
                {sizes.map((s, i) => (
                  <div key={i} className="size-row">
                    <input value={s.label} onChange={e => { const n=[...sizes]; n[i]={...n[i],label:e.target.value}; setSizes(n); }} placeholder="e.g. Small, Medium, Large"/>
                    <input type="number" step="0.01" value={s.price} onChange={e => { const n=[...sizes]; n[i]={...n[i],price:parseFloat(e.target.value)||0}; setSizes(n); }} placeholder="Price" style={{width:'90px',flex:'none'}}/>
                    <button className="act-btn del" onClick={() => setSizes(sizes.filter((_,j)=>j!==i))}><IconTrash size={14}/></button>
                  </div>
                ))}
                <button className="add-size-row" onClick={() => setSizes([...sizes,{label:'',price:0}])}>
                  + Add a size option
                </button>
              </div>
              <div className="mfg"><label>Item Photo</label><input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])}/></div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-sm" style={{ background:'var(--cream-dk)', color:'var(--muted)' }} onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-gold btn-sm" onClick={saveItem}>
                <IconCheck size={14}/> {editItem ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}