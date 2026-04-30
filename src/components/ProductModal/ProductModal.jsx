import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Rating from '../Rating/Rating';
import { useFavoritesContext } from '../../App';
import styles from './ProductModal.module.css';

function ProductModal({ product, onClose }) {
  const { toggleFavorite, isFavorite, addComment, getComments } = useFavoritesContext();
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([]);

  const favorite = isFavorite(product.id);
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  // Cargar comentarios persistidos
  useEffect(() => {
    setComments(getComments(product.id));
  }, [product.id, getComments]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(product.id, {
        text: newComment,
        rating,
      });
      setComments(getComments(product.id));
      setNewComment('');
      setRating(5);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('productId', product.id);
    e.dataTransfer.setData('text/plain', String(product.id));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.content}>
          <div 
            className={styles.imageSection}
            draggable
            onDragStart={handleDragStart}
            title="Arrastra para agregar a favoritos"
          >
            <img src={product.image} alt={product.name} className={styles.image} />
            {product.discount > 0 && (
              <span className={styles.badge}>-{product.discount}%</span>
            )}
            <div className={styles.dragHint}>🖐️ Arrastra</div>
          </div>

          <div className={styles.details}>
            <span className={styles.category}>{product.category}</span>
            <h2 className={styles.title}>{product.name}</h2>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.priceRow}>
              {discountedPrice ? (
                <>
                  <span className={styles.price}>${discountedPrice.toFixed(2)}</span>
                  <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className={styles.price}>${product.price.toFixed(2)}</span>
              )}
            </div>

            <Rating likes={product.likes} reviews={product.reviews} />

            <div className={styles.stock}>
              {product.inStock ? (
                <span className={styles.inStock}>✓ En stock ({product.stockQuantity} disponibles)</span>
              ) : (
                <span className={styles.outOfStock}>🚫 Agotado</span>
              )}
            </div>

            <button
              className={`${styles.favoriteBtn} ${favorite ? styles.active : ''}`}
              onClick={() => toggleFavorite(product.id)}
            >
              {favorite ? '❤️ Quitar de favoritos' : '🤍 Añadir a favoritos'}
            </button>

            <div className={styles.commentsSection}>
              <h3>💬 Comentarios ({comments.length})</h3>
              
              <form onSubmit={handleAddComment} className={styles.commentForm}>
                <div className={styles.ratingSelect}>
                  <label>Tu calificación:</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} ⭐</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  rows={3}
                />
                <button type="submit">Agregar comentario</button>
              </form>

              <div className={styles.commentsList}>
                {comments.length === 0 ? (
                  <p className={styles.noComments}>Sé el primero en comentar</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentRating}>{'⭐'.repeat(comment.rating)}</span>
                        <span className={styles.commentDate}>{comment.date}</span>
                      </div>
                      <p className={styles.commentText}>{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    likes: PropTypes.number,
    inStock: PropTypes.bool,
    stockQuantity: PropTypes.number,
    discount: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductModal;