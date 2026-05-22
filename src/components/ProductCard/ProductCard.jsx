import PropTypes from 'prop-types';
import { useCartContext, useFavoritesContext } from '../../App';
import { useAdmin } from '../../contexts/AdminContext';
import Rating from '../Rating/Rating';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductCard.module.css';

function ProductCard({ product, onProductClick, dragData }) {
  const { addToCart, isInCart } = useCartContext();
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const { addLike } = useAdmin();

  const likes = product.likes ?? 0;
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  const favorite = isFavorite(product.id);
  const inCart = isInCart(product.id);

  // Drag and drop para agregar a favoritos o a listas de regalo
  const handleDragStart = (e) => {
    if (dragData) {
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    } else {
      e.dataTransfer.setData('productId', product.id);
      e.dataTransfer.setData('text/plain', String(product.id));
    }
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = (e) => {
    if (e.dataTransfer?.clearData) {
      e.dataTransfer.clearData();
    }
  };

  return (
    <article 
      className={styles.card}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title="Arrastra para agregar a favoritos"
    >
      <div className={`${styles.imageWrapper} ${!product.inStock ? styles.outOfStockWrapper : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
          onClick={() => onProductClick?.(product)}
          style={{ cursor: 'pointer' }}
        />
        {product.discount > 0 && (
          <span className={styles.badge}>-{product.discount}%</span>
        )}
        {!product.inStock && (
          <div className={styles.outOfStock}>Agotado</div>
        )}
        <button
          className={`${styles.favorite} ${favorite ? styles.favoriteActive : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          {favorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.priceRow}>
          {discountedPrice ? (
            <>
              <span className={styles.price}>{formatPrice(discountedPrice)}</span>
              <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
        </div>

        <Rating likes={likes} reviews={product.reviews} />

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={`${styles.likeProductBtn}`}
            onClick={() => addLike(product.id)}
            aria-label={`Dar me gusta a ${product.name}`}
          >
            👍 Me gusta ({likes})
          </button>
          <button
            className={`${styles.addBtn} ${!product.inStock ? styles.disabled : ''} ${inCart ? styles.inCart : ''}`}
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            aria-label={`Añadir ${product.name} al carrito`}
          >
            {!product.inStock ? '🚫 Agotado' : inCart ? '✓ En carrito' : '🛒 Añadir al carrito'}
          </button>
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    likes: PropTypes.number,
    reviews: PropTypes.number,
    inStock: PropTypes.bool.isRequired,
    stockQuantity: PropTypes.number,
    discount: PropTypes.number.isRequired,
  }).isRequired,
  onProductClick: PropTypes.func,
  dragData: PropTypes.object,
};

export default ProductCard;
