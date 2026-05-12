import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import OrderPage from './pages/Order';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop:'40vh' }}/>;
  if (!user) return <Navigate to="/admin/login" replace/>;
  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar/>
    <main>{children}</main>
    <Footer/>
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<PublicLayout><Home/></PublicLayout>}/>
      <Route path="/menu"    element={<PublicLayout><MenuPage/></PublicLayout>}/>
      <Route path="/order"   element={<PublicLayout><OrderPage/></PublicLayout>}/>
      <Route path="/gallery" element={<PublicLayout><Gallery/></PublicLayout>}/>
      <Route path="/contact" element={<PublicLayout><Contact/></PublicLayout>}/>
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/admin"   element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
      <Route path="*"        element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes/>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.88rem',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
              success: { style: { background:'#0E2818', color:'#E2C47A', border:'1px solid #96741E' } },
              error:   { style: { background:'#fff', color:'#B83232', border:'1px solid #B83232' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
