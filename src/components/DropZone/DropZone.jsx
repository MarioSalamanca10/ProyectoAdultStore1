import { useState, useCallback } from 'react';
import { useFavoritesContext } from '../../App';
import { useAdmin } from '../../contexts/AdminContext';
import styles from './DropZone.module.css';

function DropZone() {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesContext();
  const { products } = useAdmin();
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    let productId = e.dataTransfer.getData('productId') || e.dataTransfer.getData('text/plain');
    if (productId) {
      try {
        const parsed = JSON.parse(productId);
        if (parsed?.id) {
          productId = parsed.id;
        }
      } catch {
        // texto simple, ya está bien
      }

      const id = parseInt(productId, 10);
      if (!Number.isNaN(id)) {
        toggleFavorite(id);
      }
    }
  }, [toggleFavorite]);

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <>
      <div 
        className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => setShowModal(true)}
        title="Arrastra productos aquí para agregar a favoritos"
      >
        <span className={styles.icon}>📦</span>
        <span className={styles.label}>Deseados</span>
        {favorites.length > 0 && (
          <span className={styles.badge}>{favorites.length}</span>
        )}
      </div>

      {/* Modal de favoritos */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            <h2 className={styles.modalTitle}>📦 Mis Deseados</h2>
            
            {favoriteProducts.length === 0 ? (
              <p className={styles.empty}>No tienes productos en deseados aún.</p>
            ) : (
              <div className={styles.productList}>
                {favoriteProducts.map(product => (
                  <div key={product.id} className={styles.productItem}>
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                    <div className={styles.productInfo}>
                      <h4>{product.name}</h4>
                      <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => toggleFavorite(product.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DropZone;