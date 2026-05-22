import { useState } from 'react';
import styles from './FloatingWhatsApp.module.css';

function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '573238151791'; // Sin espacios ni caracteres especiales
  const message = 'Hola amiga, me gustaría más información sobre tus productos.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener');
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${isOpen ? styles.buttonOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp"
        title="Contactar por WhatsApp"
      >
        💬
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <p className={styles.text}>¿Necesitas ayuda? Contáctanos por WhatsApp</p>
          <button className={styles.contactBtn} onClick={handleOpenWhatsApp}>
            Abrir WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}

export default FloatingWhatsApp;
