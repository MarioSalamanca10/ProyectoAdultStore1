import PropTypes from 'prop-types';
import { useCartContext } from '../../App';
import styles from './CartItem.module.css';

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCartContext();

  const discountedPrice = item.discount
    ? item.price * (1 - item.discount / 100)
    : item.price;

  const subtotal = discountedPrice * item.quantity;

  return (
    <div className={styles.item}>
      <img src={item.image} alt={item.name} className={styles.image} />

      <div className={styles.info}>
        <h4 className={styles.name}>{item.name}</h4>
        <span className={styles.category}>{item.category}</span>
        <div className={styles.price}>
          ${discountedPrice.toFixed(2)}
          {item.discount > 0 && (
            <span className={styles.discount}>-{item.discount}%</span>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.qty}>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className={styles.qtyValue}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <div className={styles.subtotal}>${subtotal.toFixed(2)}</div>

        <button
          className={styles.removeBtn}
          onClick={() => removeFromCart(item.id)}
          aria-label={`Eliminar ${item.name}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartItem;
