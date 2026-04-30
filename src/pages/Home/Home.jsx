import { Link } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { calculateRating } from '../../utils/ratingCalculator';
import ProductCard from '../../components/ProductCard/ProductCard';
import Newsletter from '../../components/Newsletter/Newsletter';
import styles from './Home.module.css';

const CATEGORIES = [
  { name: 'Juguetes', icon: '🎮', desc: 'Placeres personales' },
  { name: 'Lencería', icon: '👙', desc: 'Moda íntima' },
  { name: 'Accesorios', icon: '✨', desc: 'Complementos y más' },
  { name: 'Cosméticos', icon: '💋', desc: 'Cremas y aceites' },
  { name: 'Parejas', icon: '💑', desc: 'Para disfrutar juntos' },
];

const FEATURES = [
  { icon: '📦', title: 'Envío Discreto', desc: 'Packaging neutro y sin identificación del contenido.' },
  { icon: '🔒', title: 'Pago Seguro', desc: 'Todos los pagos cifrados con SSL de 256 bits.' },
  { icon: '↩️', title: 'Devoluciones', desc: '30 días para cambiar de opinión, sin preguntas.' },
  { icon: '💬', title: 'Atención 24/7', desc: 'Soporte disponible todos los días del año.' },
];

function Home() {
  const { products } = useAdmin();
  const FEATURED = products.filter(p => p.inStock && calculateRating(p.likes || 0) >= 4).slice(0, 6);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>✨ Nueva colección disponible</span>
          <h1 className={styles.heroTitle}>
            Descubre el <span className={styles.accent}>placer</span> con confianza
          </h1>
          <p className={styles.heroSubtitle}>
            Tu tienda adulta de confianza. Productos de calidad premium,
            envío 100% discreto y atención personalizada.
          </p>
          <div className={styles.heroCTA}>
            <Link to="/productos" className={styles.btnPrimary}>
              Ver productos 🛍️
            </Link>
            <Link to="/sobre-nosotros" className={styles.btnSecondary}>
              Conocer más
            </Link>
          </div>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.heroCircle1} />
          <div className={styles.heroCircle2} />
          <span className={styles.heroEmoji}>🌹</span>
        </div>
      </section>

      {/* Features bar */}
      <section className={styles.featuresBar}>
        <div className={styles.container}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.featureItem}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Productos Destacados</h2>
            <Link to="/productos" className={styles.seeAll}>Ver todos →</Link>
          </div>
          <div className={styles.productsGrid}>
            {FEATURED.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Explorar por Categoría</h2>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/productos?category=${cat.name}`}
                className={styles.categoryCard}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <strong className={styles.categoryName}>{cat.name}</strong>
                <p className={styles.categoryDesc}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterBox}>
            <div>
              <h2 className={styles.newsletterTitle}>Ofertas exclusivas en tu email</h2>
              <p className={styles.newsletterSub}>
                Únete a más de 10,000 suscriptores y recibe descuentos de hasta el 30%.
              </p>
            </div>
            <Newsletter />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
