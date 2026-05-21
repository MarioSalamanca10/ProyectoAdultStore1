import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useFavoritesContext } from '../../App';
import { calculateRating } from '../../utils/ratingCalculator';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductModal from '../../components/ProductModal/ProductModal';
import DropZone from '../../components/DropZone/DropZone';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Products.module.css';

function Products() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { toggleFavorite } = useFavoritesContext();

  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'Todos');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const cat = p.get('category');
    const s = p.get('search');
    if (cat) setCategory(cat);
    if (s) setSearch(s);
  }, [location.search]);

  const { products } = useAdmin();

  const categories = useMemo(() => [
    'Todos',
    ...Array.from(new Set(products.map((product) => product.category))),
  ], [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (category !== 'Todos') {
      result = result.filter(p => p.category === category);
    }

    if (minPrice !== '') {
      result = result.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice !== '') {
      result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => calculateRating(b.likes || 0) - calculateRating(a.likes || 0)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [products, search, category, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setCategory('Todos');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('default');
  };

  const hasFilters = search || category !== 'Todos' || minPrice || maxPrice || sortBy !== 'default';

  // Manejar drag and drop para agregar a favoritos
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    let productId = e.dataTransfer.getData('productId') || e.dataTransfer.getData('text/plain');
    if (productId) {
      try {
        const parsed = JSON.parse(productId);
        if (parsed?.id) {
          productId = parsed.id;
        }
      } catch {
        // texto simple
      }

      const id = parseInt(productId, 10);
      if (!Number.isNaN(id)) {
        toggleFavorite(id);
      }
    }
  }, [toggleFavorite]);

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <div 
      className={styles.page}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Nuestros Productos</h1>
          <p className={styles.subtitle}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <SearchBar onSearch={setSearch} placeholder="Buscar..." />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.categories}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.catBtn} ${category === cat ? styles.catBtnActive : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.priceRange}>
              <input
                type="number"
                className={styles.priceInput}
                placeholder="Precio min"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                min="0"
              />
              <span className={styles.priceSep}>—</span>
              <input
                type="number"
                className={styles.priceInput}
                placeholder="Precio max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>

            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
              <option value="name">Nombre A-Z</option>
            </select>

            {hasFilters && (
              <button className={styles.clearBtn} onClick={clearFilters}>
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <h3>No se encontraron productos</h3>
            <p>Prueba con otros filtros o términos de búsqueda.</p>
            <button className={styles.clearBtn} onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles del producto */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}

      {/* Zona de drop para favoritos */}
      <DropZone />
    </div>
  );
}

export default Products;
