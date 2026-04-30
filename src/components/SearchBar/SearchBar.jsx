import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './SearchBar.module.css';

function SearchBar({ onSearch, placeholder = 'Buscar productos...' }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [value, onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label="Buscar"
      />
      {value && (
        <button className={styles.clear} onClick={handleClear} aria-label="Limpiar búsqueda">
          ✕
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
