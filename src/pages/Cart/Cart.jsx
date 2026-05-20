import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../App';
import CartItem from '../../components/CartItem/CartItem';
import { createOrder } from '../../api/orders';
import styles from './Cart.module.css';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

function Cart() {
  const { items, clearCart, total, itemCount } = useCartContext();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    customerEmail: '',
    paymentMethod: 'Tarjeta ficticia',
  });

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = total + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleCheckout = async () => {
    if (!checkoutForm.customerName.trim() || !checkoutForm.customerEmail.trim()) {
      setError('Por favor ingresa nombre y correo electrónico.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const order = await createOrder({
        customerName: checkoutForm.customerName,
        customerEmail: checkoutForm.customerEmail,
        paymentMethod: checkoutForm.paymentMethod,
        shipping,
        total: orderTotal,
        items,
      });

      setOrderId(order.id);
      setOrderData(order);
      clearCart();
      setCheckoutDone(true);
    } catch (submissionError) {
      console.error('Error creando pedido:', submissionError);
      setError(submissionError.message || 'No se pudo procesar el pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkoutDone) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.success}>
            <span>🎉</span>
            <h2>¡Pedido realizado con éxito!</h2>
            {orderId && <p>Número de pedido: <strong>{orderId}</strong></p>}
            {orderData && (
              <div className={styles.orderSummary}>
                <p><strong>Nombre:</strong> {orderData.customerName}</p>
                <p><strong>Correo:</strong> {orderData.customerEmail}</p>
                <p><strong>Pago:</strong> {orderData.paymentMethod} (ficticio)</p>
                <p><strong>Total:</strong> ${orderData.total.toFixed(2)}</p>
              </div>
            )}
            <p>Recibirás un email de confirmación ficticio. Tu pedido llegará de forma discreta.</p>
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

            <div className={styles.checkoutForm}>
              <h4>Datos de envío y pago (ficticio)</h4>
              <div className={styles.formGroup}>
                <label htmlFor="customerName">Nombre completo</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={checkoutForm.customerName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Ej: María Pérez"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="customerEmail">Email</label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={checkoutForm.customerEmail}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="paymentMethod">Método de pago</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={checkoutForm.paymentMethod}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option>Tarjeta ficticia</option>
                  <option>Transferencia ficticia</option>
                  <option>Pago en efectivo ficticio</option>
                </select>
              </div>
              {error && <div className={styles.errorMsg}>{error}</div>}
              <button
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando pago...' : 'Pagar (ficticio) 🔒'}
              </button>
              <p className={styles.checkoutHint}>
                Pago ficticio: no se realizará ningún cargo real.
              </p>
            </div>

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
