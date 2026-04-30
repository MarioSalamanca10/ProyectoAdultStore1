import { Link } from 'react-router-dom';
import Newsletter from '../Newsletter/Newsletter';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span>🌹</span>
              <span className={styles.logoText}>Adulto <span className={styles.accent}>Store</span></span>
            </div>
            <p className={styles.tagline}>Tu espacio seguro para explorar el placer con confianza y discreción.</p>
            <div className={styles.social}>
              {['📘', '📸', '🐦', '📌'].map((icon, i) => (
                <a key={i} href="#" className={styles.socialBtn} aria-label="Redes sociales">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.links}>
            <h4 className={styles.heading}>Navegación</h4>
            <ul className={styles.list}>
              <li><Link to="/" className={styles.link}>Inicio</Link></li>
              <li><Link to="/productos" className={styles.link}>Productos</Link></li>
              <li><Link to="/sobre-nosotros" className={styles.link}>Sobre Nosotros</Link></li>
              <li><Link to="/contacto" className={styles.link}>Contacto</Link></li>
              <li><Link to="/carrito" className={styles.link}>Carrito</Link></li>
            </ul>
          </div>

          <div className={styles.links}>
            <h4 className={styles.heading}>Categorías</h4>
            <ul className={styles.list}>
              {['Juguetes', 'Lencería', 'Accesorios', 'Cosméticos', 'Parejas'].map(cat => (
                <li key={cat}>
                  <Link to={`/productos?category=${cat}`} className={styles.link}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.newsletter}>
            <h4 className={styles.heading}>Newsletter</h4>
            <p className={styles.newsletterText}>Recibe ofertas exclusivas y novedades.</p>
            <Newsletter />
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {currentYear} Adulto Store. Todos los derechos reservados.
          </p>
          <p className={styles.disclaimer}>
            🔒 Sitio para mayores de 18 años | Compras 100% discretas
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
