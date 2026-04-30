import { useState, useEffect } from 'react';
import styles from './AgeVerification.module.css';

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    if (!ageVerified) {
      setShowModal(true);
    }
  }, []);

  const handleAuthorize = () => {
    localStorage.setItem('ageVerified', 'true');
    setShowModal(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!showModal) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <h1 className={styles.title}>Verificación de Edad</h1>
          <p className={styles.message}>
            Este sitio contiene contenido exclusivo para mayores de edad.
          </p>
          <p className={styles.question}>
            ¿Eres mayor de 18 años?
          </p>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${styles.decline}`}
              onClick={handleDecline}
            >
              No Autorizo
            </button>
            <button
              className={`${styles.button} ${styles.authorize}`}
              onClick={handleAuthorize}
            >
              Autorizo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
