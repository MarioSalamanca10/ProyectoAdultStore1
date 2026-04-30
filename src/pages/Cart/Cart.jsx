import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../App';
import CartItem from '../../components/CartItem/CartItem';
import styles from './Cart.module.css';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

function Cart() {
  const { items, clearCart, total, itemCount } = useCartContext();
  const [checkoutDone, setCheckoutDone] = useState(false);

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = total + shipping;

  if (checkoutDone) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.success}>
            <span>🎉</span>
            <h2>¡Pedido realizado con éxito!</h2>
            <p>Recibirás un email de confirmación. Tu pedido llegará de forma discreta.</p>
            <Link to="/productos" className={styles.continueBtn}>
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>Aún no has agregado ningún producto.</p>
            <Link to="/productos" className={styles.shopBtn}>
              Ver productos →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mi Carrito</h1>
          <span className={styles.count}>{itemCount} producto{itemCount !== 1 ? 's' : ''}</span>
        </div>

        <div className={styles.layout}>
          <div className={styles.items}>
            <div className={styles.itemsHeader}>
              <span>Producto</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
            </div>
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
            <button className={styles.clearBtn} onClick={clearCart}>
              🗑️ Vaciar carrito
            </button>
          </div>

          <aside className={styles.summary}>
            <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span className={shipping === 0 ? styles.free : ''}>
                  {shipping === 0 ? '¡Gratis!' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {total < SHIPPING_THRESHOLD && (
                <p className={styles.freeShippingMsg}>
                  Añade ${(SHIPPING_THRESHOLD - total).toFixed(2)} más para envío gratis
                </p>
              )}
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => { clearCart(); setCheckoutDone(true); }}
            >
              Finalizar compra 🔒
            </button>

            <Link to="/productos" className={styles.continueLink}>
              ← Seguir comprando
            </Link>

            <p className={styles.security}>🔒 Compra 100% segura y discreta</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
