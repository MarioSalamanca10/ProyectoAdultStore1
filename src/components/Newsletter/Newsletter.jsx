import { useState } from 'react';
import styles from './Newsletter.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Ingresa un email válido');
      return;
    }
    setError('');
    setSuccess(true);
    setEmail('');
  };

  if (success) {
    return (
      <div className={styles.success}>
        <span>✅</span>
        <p>¡Gracias por suscribirte! Recibirás nuestras mejores ofertas.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.inputGroup}>
        <input
          type="email"
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          placeholder="Tu email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          aria-label="Email para newsletter"
        />
        <button type="submit" className={styles.btn}>
          Suscribirme
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default Newsletter;
