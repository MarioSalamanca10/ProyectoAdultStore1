import { useState } from 'react';
import styles from './SidebarMenu.module.css';

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const phoneNumber = '573238151791';
    const message = 'Hola, me gustaría más información sobre tus productos.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener');
    setIsOpen(false);
  };

  const handleScrollToWishlist = () => {
    // Buscar el bubble de deseados y hacer scroll hacia él
    const bubble = document.querySelector('[data-gift-bubble]');
    if (bubble) {
      bubble.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú lateral"
        title="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú lateral */}
      <nav className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
        <div className={styles.menuHeader}>
          <h2>Menú</h2>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <ul className={styles.menuList}>
          <li>
            <button
              className={styles.menuItem}
              onClick={handleWhatsApp}
            >
              <span className={styles.icon}>💬</span>
              <span className={styles.label}>Contactar por WhatsApp</span>
            </button>
          </li>
          <li>
            <button
              className={styles.menuItem}
              onClick={handleScrollToWishlist}
            >
              <span className={styles.icon}>📦</span>
              <span className={styles.label}>Ver Deseados</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default SidebarMenu;
