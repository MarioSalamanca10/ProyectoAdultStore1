import PropTypes from 'prop-types';
import { calculateRating } from '../../utils/ratingCalculator';
import styles from './Rating.module.css';

function Rating({ rating = null, likes = null, reviews, size = 'sm' }) {
  // Si se proporciona likes, calcular el rating dinámicamente
  // Si no, usar el rating proporcionado
  const finalRating = likes !== null ? calculateRating(likes) : rating;

  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(finalRating)) return 'full';
    if (i < finalRating) return 'half';
    return 'empty';
  });

  return (
    <div className={`${styles.rating} ${styles[size]}`}>
      <div className={styles.stars}>
        {stars.map((type, i) => (
          <span key={i} className={`${styles.star} ${styles[type]}`}>
            {type === 'full' ? '★' : type === 'half' ? '⯨' : '☆'}
          </span>
        ))}
      </div>
      <div className={styles.ratingInfo}>
        <span className={styles.ratingValue}>{finalRating.toFixed(1)}</span>
        {reviews !== undefined && (
          <span className={styles.reviews}>({reviews})</span>
        )}
        {likes !== null && (
          <span className={styles.likes}>{likes} 👍</span>
        )}
      </div>
    </div>
  );
}

Rating.propTypes = {
  rating: PropTypes.number,
  likes: PropTypes.number,
  reviews: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Rating;
