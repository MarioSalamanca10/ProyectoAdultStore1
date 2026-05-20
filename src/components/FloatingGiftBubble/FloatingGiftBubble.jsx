import { useState, useRef, useEffect } from 'react';
import { useGiftList } from '../../hooks/useGiftList';
import { useCartContext } from '../../App';
import styles from './FloatingGiftBubble.module.css';

function FloatingGiftBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef(null);
  const handleRef = useRef(null);

  const {
    giftLists,
    currentListId,
    setCurrentListId,
    createList,
    addItemToList,
    removeItemFromList,
    getCurrentList,
    getPromotionsForList,
  } = useGiftList();

  const { addToCart } = useCartContext();

  const currentList = getCurrentList();
  const availablePromos = currentList ? getPromotionsForList(currentList.id) : [];

  // Drag del bubble
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Solo click izquierdo
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Drag and drop de productos
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const data = e.dataTransfer.getData('application/json');
      if (data && currentList) {
        const product = JSON.parse(data);
        addItemToList(currentList.id, product);
      }
    } catch (error) {
      console.error('Error al procesar drop:', error);
    }
  };

  const handleAddAllToCart = () => {
    if (currentList && currentList.items.length > 0) {
      currentList.items.forEach(item => {
        addToCart(item);
      });
    }
  };

  const calculateTotal = () => {
    if (!currentList) return 0;
    return currentList.items.reduce((sum, item) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + price;
    }, 0);
  };

  const total = calculateTotal();
  const discount = currentList ? total * (currentList.discountPercentage / 100) : 0;
  const finalTotal = total - discount;

  return (
    <div
      ref={bubbleRef}
      className={`${styles.bubble} ${isOpen ? styles.open : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Header/Barra para arrastrar */}
      <div
        ref={handleRef}
        className={styles.handle}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
      >
        <span className={styles.icon}>🎁</span>
        <span className={styles.title}>Mi Lista de Deseos</span>
        <button
          className={styles.toggleBtn}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? '▼' : '▶'}
        </button>
      </div>

      {/* Contenido expandido */}
      {isOpen && (
        <div className={styles.content}>
          {/* Selector de Listas */}
          <div className={styles.listsSelector}>
            <select
              value={currentListId || ''}
              onChange={(e) => {
                const id = e.target.value ? parseInt(e.target.value) : null;
                setCurrentListId(id);
              }}
              className={styles.select}
            >
              <option value="">Seleccionar lista...</option>
              {giftLists.map(list => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.items.length})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const name = prompt('Nombre de la lista:');
                if (name?.trim()) {
                  createList(name);
                }
              }}
              className={styles.createListBtn}
              title="Nueva lista"
            >
              ➕
            </button>
          </div>

          {currentList ? (
            <>
              {/* Zona de Drop */}
              <div
                className={styles.dropZone}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {currentList.items.length === 0 ? (
                  <div className={styles.emptyZone}>
                    <span className={styles.emptyIcon}>📦</span>
                    <p>Arrastra aquí</p>
                  </div>
                ) : (
                  <div className={styles.itemsList}>
                    {currentList.items.map(item => (
                      <div key={item.id} className={styles.itemRow}>
                        <img src={item.image} alt={item.name} />
                        <div className={styles.itemDetails}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemPrice}>
                            ${(item.discount
                              ? item.price * (1 - item.discount / 100)
                              : item.price
                            ).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItemFromList(currentList.id, item.id)}
                          className={styles.removeItemBtn}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumen */}
              {currentList.items.length > 0 && (
                <>
                  <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    {currentList.discountPercentage > 0 && (
                      <div className={styles.summaryRow}>
                        <span>Descuento:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className={styles.summaryRow + ' ' + styles.total}>
                      <span>Total:</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Promos */}
                  {availablePromos.length > 0 && (
                    <div className={styles.promosCompact}>
                      <div className={styles.promosTitle}>🎉 Promos</div>
                      {availablePromos.map(promo => (
                        <div key={promo.id} className={styles.promoCompact}>
                          <span>{promo.name}</span>
                          <span className={styles.promoDiscount}>{promo.discount}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Botón de carrito */}
                  <button
                    onClick={handleAddAllToCart}
                    className={styles.cartBtn}
                  >
                    🛒 Al Carrito ({currentList.items.length})
                  </button>
                </>
              )}
            </>
          ) : (
            <div className={styles.noList}>
              <p>Crea una lista para empezar</p>
            </div>
          )}
        </div>
      )}

      {/* Badge con cantidad */}
      {!isOpen && currentList && currentList.items.length > 0 && (
        <div className={styles.badge}>{currentList.items.length}</div>
      )}
    </div>
  );
}

export default FloatingGiftBubble;
