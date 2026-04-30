import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCartContext } from '../../App';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Header.module.css';

function Header() {
  const { itemCount } = useCartContext();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/sobre-nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ];

  const handleSearch = (query) => {
    if (query) {
      window.location.href = `/productos?search=${encodeURIComponent(query)}`;
    }
  };

  const handleAdminAccess = () => {
    window.open('/admin', '_blank', 'noopener');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌹</span>
          <span className={styles.logoText}>Adulto <span className={styles.logoAccent}>Store</span></span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={() => setMenuOpen(false)}
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => setSearchOpen(p => !p)}
            aria-label="Buscar"
          >
            🔍
          </button>

          <Link to="/carrito" className={styles.cartBtn} aria-label="Carrito">
            🛒
            {itemCount > 0 && (
              <span className={styles.badge}>{itemCount}</span>
            )}
          </Link>

          {isAuthenticated && isAdmin && (
            <>
              <button
                className={styles.adminBtn}
                onClick={handleAdminAccess}
                aria-label="Panel Admin"
                title="Panel de Administración"
              >
                ⚙️
              </button>
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                🚪
              </button>
            </>
          )}

          {!isAuthenticated && !isAdmin && (
            <Link
              to="/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.loginLink}
              aria-label="Acceso Admin"
            >
              Acceso Admin
            </Link>
          )}

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Menú"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className={styles.searchBar}>
          <div className={styles.container}>
            <SearchBar onSearch={handleSearch} placeholder="Buscar productos..." />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
