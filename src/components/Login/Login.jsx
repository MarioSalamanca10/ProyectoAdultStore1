import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulamos un pequeño delay para mejor UX
    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setError(result.error);
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <p className={styles.subtitle}>Acceso Restringido</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Usuario
            </label>
            <input
              id="username"
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div className={styles.hint}>
          <p><strong>Demo:</strong> admin / Tobias2025*!</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
