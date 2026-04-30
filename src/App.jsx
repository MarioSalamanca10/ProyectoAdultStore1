import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Cart from './pages/Cart/Cart';
import Login from './components/Login/Login';
import AdminPanel from './components/Admin/AdminPanel';
import AgeVerification from './components/AgeVerification/AgeVerification';
import { useCart } from './hooks/useCart';
import { usePersistentStorage } from './hooks/usePersistentStorage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import styles from './App.module.css';

export const CartContext = createContext(null);
export const FavoritesContext = createContext(null);

export function useCartContext() {
  return useContext(CartContext);
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}

// Componente para proteger rutas de administración
function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

function AppContent() {
  const cart = useCart();
  const favorites = usePersistentStorage();
  const { isAuthenticated, isAdmin } = useAuth();

  // Si está en login de admin, no mostrar header/footer
  if (isAuthenticated && isAdmin) {
    return (
      <div className={styles.app}>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    );
  }

  // Mostrar login si intenta acceder al admin sin autenticarse
  if (window.location.pathname.startsWith('/admin')) {
    return (
      <div className={styles.app}>
        <Login />
      </div>
    );
  }

  // Aplicación normal
  return (
    <CartContext.Provider value={cart}>
      <FavoritesContext.Provider value={favorites}>
        <div className={styles.app}>
          <Header />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/sobre-nosotros" element={<About />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/admin/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </FavoritesContext.Provider>
    </CartContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <AgeVerification />
          <AppContent />
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
