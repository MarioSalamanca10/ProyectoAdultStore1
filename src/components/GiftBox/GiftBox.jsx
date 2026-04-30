import { useState } from 'react';
import styles from './GiftBox.module.css';

function GiftBox({ items, onAddItem, onRemoveItem, onClearList, promoCode, discountPercentage, availablePromos, onApplyPromo }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const product = JSON.parse(data);
        onAddItem(product);
        setDraggedItem(product.id);
        setTimeout(() => setDraggedItem(null), 300);
      }
    } catch (error) {
      console.error('Error al procesar drop:', error);
    }
  };

  const handlePromoClick = (promo) => {
    setSelectedPromo(promo.id);
    onApplyPromo(promo.id, promo.discount);
  };

  const total = items.reduce((sum, item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + price;
  }, 0);

  const discount = total * (discountPercentage / 100);
  const finalTotal = total - discount;

  return (
    <div className={styles.giftBoxContainer}>
      <div 
        className={`${styles.giftBox} ${items.length > 0 ? styles.filled : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.boxTop}>
          <div className={styles.boxLid}>🎁</div>
        </div>
        <div className={styles.boxContent}>
          {items.length === 0 ? (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📦</div>
              <p>Arrastra productos aquí</p>
              <span className={styles.hint}>Crea tu lista de deseos personalizada</span>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.giftItem} ${draggedItem === item.id ? styles.addedAnimation : ''}`}
                >
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p className={styles.price}>
                      {item.discount ? (
                        <>
                          <span className={styles.originalPrice}>${item.price.toFixed(2)}</span>
                          <span className={styles.discountedPrice}>
                            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        `$${item.price.toFixed(2)}`
                      )}
                    </p>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            {discountPercentage > 0 && (
              <div className={styles.summaryRow}>
                <span>Descuento ({discountPercentage}%):</span>
                <span className={styles.discount}>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {availablePromos.length > 0 && (
            <div className={styles.promosSection}>
              <h3>🎉 Promociones Disponibles</h3>
              <div className={styles.promosList}>
                {availablePromos.map((promo) => (
                  <button
                    key={promo.id}
                    className={`${styles.promoCard} ${selectedPromo === promo.id ? styles.promoActive : ''}`}
                    onClick={() => handlePromoClick(promo)}
                  >
                    <div className={styles.promoName}>{promo.name}</div>
                    <div className={styles.promoMessage}>{promo.message}</div>
                    <div className={styles.promoDiscount}>{promo.discount}% OFF</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button 
              className={styles.clearBtn}
              onClick={onClearList}
            >
              🗑️ Limpiar Lista
            </button>
            <button 
              className={styles.addToCartBtn}
              onClick={() => {
                // Esta acción se manejará en el componente padre
                console.log('Agregar a carrito');
              }}
            >
              🛒 Agregar Todos al Carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GiftBox;
