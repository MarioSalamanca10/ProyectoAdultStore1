import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import ProductForm from './ProductForm';
import styles from './AdminPanel.module.css';

function AdminPanel() {
  const { logout } = useAuth();
  const { products, updateProduct, deleteProduct } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleToggleStock = (id, currentStock) => {
    updateProduct(id, { inStock: !currentStock });
  };

  const handleStockChange = (id, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    updateProduct(id, { stockQuantity: quantity, inStock: quantity > 0 });
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Panel de Administración</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className={styles.container}>
        {showForm ? (
          <div className={styles.formSection}>
            <ProductForm
              product={editingProduct}
              onClose={handleCloseForm}
            />
          </div>
        ) : (
          <>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className={styles.newProductBtn}
              >
                + Nuevo Producto
              </button>
            </div>

            <div className={styles.statsBar}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total de Productos:</span>
                <span className={styles.statValue}>{products.length}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>En Stock:</span>
                <span className={styles.statValue}>
                  {products.filter(p => p.inStock).length}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Fuera de Stock:</span>
                <span className={styles.statValue}>
                  {products.filter(p => !p.inStock).length}
                </span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No hay productos que coincidan con tu búsqueda</p>
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {filteredProducts.map(product => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.imageContainer}>
                      <img src={product.image} alt={product.name} />
                      <div className={styles.imageBadge}>
                        {product.inStock ? (
                          <span className={styles.stockBadgeOn}>En Stock</span>
                        ) : (
                          <span className={styles.stockBadgeOff}>Agotado</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.category}>{product.category}</p>
                      <p className={styles.description}>
                        {product.description.substring(0, 80)}...
                      </p>

                      <div className={styles.price}>${product.price.toFixed(2)}</div>

                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(product)}
                          className={styles.editBtn}
                        >
                          Editar
                        </button>
                        <div className={styles.stockControl}>
                          <label>
                            <input
                              type="checkbox"
                              checked={product.inStock}
                              onChange={() => handleToggleStock(product.id, product.inStock)}
                            />
                            Disponible
                          </label>
                        </div>
                        <div className={styles.stockControl}>
                          <label>Unidades:</label>
                          <input
                            type="number"
                            min="0"
                            value={product.stockQuantity || 0}
                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                            className={styles.stockInput}
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm('¿Eliminar este producto?')) {
                              deleteProduct(product.id);
                            }
                          }}
                          className={styles.deleteBtn}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
