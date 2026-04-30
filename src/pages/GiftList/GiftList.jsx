import { useState } from 'react';
import { products } from '../../data/products';
import { useGiftList } from '../../hooks/useGiftList';
import { useCartContext } from '../../App';
import GiftBox from '../../components/GiftBox/GiftBox';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './GiftList.module.css';

function GiftListPage() {
  const {
    giftLists,
    currentListId,
    setCurrentListId,
    createList,
    deleteList,
    renameList,
    addItemToList,
    removeItemFromList,
    clearList,
    applyPromotion,
    getCurrentList,
    getPromotionsForList,
  } = useGiftList();

  const { addToCart } = useCartContext();
  const [newListName, setNewListName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showProductSelector, setShowProductSelector] = useState(false);

  const currentList = getCurrentList();
  const availablePromos = currentList ? getPromotionsForList(currentList.id) : [];

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName);
      setNewListName('');
    }
  };

  const handleRenameList = (id) => {
    if (editingName.trim()) {
      renameList(id, editingName);
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleAddAllToCart = () => {
    if (currentList && currentList.items.length > 0) {
      currentList.items.forEach(item => {
        addToCart(item);
      });
      alert('✅ Todos los productos se han agregado al carrito!');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>🎁 Mi Lista de Deseos</h1>
        <p>Crea tus listas personalizadas y arrastra productos para recibir promociones especiales</p>
      </div>

      <div className={styles.content}>
        {/* Panel Izquierdo: Listas */}
        <aside className={styles.sidebar}>
          <div className={styles.listsSection}>
            <h2>Mis Listas</h2>
            
            <div className={styles.createListForm}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nombre de la lista..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreateList();
                }}
                className={styles.input}
              />
              <button onClick={handleCreateList} className={styles.createBtn}>
                ➕ Crear
              </button>
            </div>

            <div className={styles.listItems}>
              {giftLists.length === 0 ? (
                <p className={styles.emptyMessage}>Sin listas aún</p>
              ) : (
                giftLists.map(list => (
                  <div
                    key={list.id}
                    className={`${styles.listItem} ${currentListId === list.id ? styles.active : ''}`}
                  >
                    <div className={styles.listItemContent}>
                      {editingId === list.id ? (
                        <div className={styles.editForm}>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleRenameList(list.id);
                            }}
                            className={styles.editInput}
                          />
                          <button
                            onClick={() => handleRenameList(list.id)}
                            className={styles.saveBtn}
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <button
                          className={styles.listButton}
                          onClick={() => setCurrentListId(list.id)}
                        >
                          <span className={styles.listName}>{list.name}</span>
                          <span className={styles.itemCount}>{list.items.length} items</span>
                        </button>
                      )}
                    </div>

                    <div className={styles.listActions}>
                      {editingId !== list.id && (
                        <>
                          <button
                            className={styles.editListBtn}
                            onClick={() => {
                              setEditingId(list.id);
                              setEditingName(list.name);
                            }}
                            title="Renombrar"
                          >
                            ✏️
                          </button>
                          <button
                            className={styles.deleteListBtn}
                            onClick={() => {
                              if (confirm(`¿Eliminar "${list.name}"?`)) {
                                deleteList(list.id);
                              }
                            }}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Panel Derecho: Caja de Regalos y Productos */}
        <main className={styles.mainContent}>
          {currentList ? (
            <>
              {/* Caja de Regalos */}
              <div className={styles.giftBoxSection}>
                <GiftBox
                  items={currentList.items}
                  onAddItem={(product) => addItemToList(currentList.id, product)}
                  onRemoveItem={(productId) => removeItemFromList(currentList.id, productId)}
                  onClearList={() => clearList(currentList.id)}
                  promoCode={currentList.promoCode}
                  discountPercentage={currentList.discountPercentage}
                  availablePromos={availablePromos}
                  onApplyPromo={(promoId, discount) =>
                    applyPromotion(currentList.id, promoId, discount)
                  }
                />

                {currentList.items.length > 0 && (
                  <button
                    onClick={handleAddAllToCart}
                    className={styles.finalAddToCartBtn}
                  >
                    🛒 Agregar Toda la Lista al Carrito
                  </button>
                )}
              </div>

              {/* Productos Disponibles */}
              <div className={styles.productsSection}>
                <div className={styles.productsHeader}>
                  <h2>📦 Arrastra productos a tu caja</h2>
                  <button
                    className={`${styles.toggleBtn} ${showProductSelector ? styles.open : ''}`}
                    onClick={() => setShowProductSelector(!showProductSelector)}
                  >
                    {showProductSelector ? '▼ Ocultar' : '▶ Mostrar'}
                  </button>
                </div>

                {showProductSelector && (
                  <div className={styles.productsGrid}>
                    {products.map(product => (
                      <div key={product.id} className={styles.draggableProduct}>
                        <ProductCard product={product} dragData={product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.noListMessage}>
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📋</span>
                <h2>Crea tu primera lista</h2>
                <p>Para comenzar, crea una nueva lista en el panel izquierdo</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default GiftListPage;
