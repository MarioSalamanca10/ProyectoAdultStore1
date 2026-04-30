import styles from './About.module.css';

const TEAM = [
  { name: 'Ana García', role: 'Fundadora & CEO', emoji: '👩‍💼', bio: 'Especialista en salud sexual con 10 años de experiencia.' },
  { name: 'Carlos López', role: 'Director de Producto', emoji: '👨‍💻', bio: 'Apasionado por crear experiencias de compra únicas y cómodas.' },
  { name: 'María Rodríguez', role: 'Atención al Cliente', emoji: '👩‍❤️‍💋‍👨', bio: 'Dedicada a que cada cliente se sienta seguro y bienvenido.' },
  { name: 'Diego Martínez', role: 'Logística & Discreción', emoji: '📦', bio: 'Garantiza que cada envío llegue a tiempo y de forma privada.' },
];

const VALUES = [
  { icon: '🔓', title: 'Sin Tabúes', desc: 'Creemos en hablar abiertamente sobre sexualidad como parte natural de la vida.' },
  { icon: '🛡️', title: 'Privacidad', desc: 'Tu privacidad es nuestra prioridad. Datos cifrados y envíos discretos.' },
  { icon: '✅', title: 'Calidad', desc: 'Sólo trabajamos con marcas certificadas y materiales seguros para tu salud.' },
  { icon: '🤝', title: 'Inclusividad', desc: 'Una tienda para todos. Sin importar identidad, orientación o preferencia.' },
];

function About() {
  return (
    <div className={styles.page}>
      {/* Story */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <span className={styles.label}>Nuestra Historia</span>
              <h1 className={styles.title}>
                Creado para romper <span className={styles.accent}>tabúes</span>
              </h1>
              <p>
                Adulto Store nació en 2020 de una necesidad real: tener un espacio seguro,
                educativo y sin vergüenza donde las personas pudieran explorar su sexualidad
                con total confianza.
              </p>
              <p>
                Nos cansamos de las tiendas oscuras, los empaques incómodos y la falta de
                información. Creamos algo diferente: una tienda moderna, discreta y que trata
                a sus clientes como adultos inteligentes.
              </p>
              <p>
                Hoy somos más de 10,000 clientes satisfechos que encontraron en nosotros
                un aliado en su bienestar sexual y personal.
              </p>
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.statGrid}>
                {[
                  { n: '10K+', label: 'Clientes felices' },
                  { n: '200+', label: 'Productos' },
                  { n: '4.8★', label: 'Valoración media' },
                  { n: '4', label: 'Años de experiencia' },
                ].map(s => (
                  <div key={s.label} className={styles.statCard}>
                    <strong>{s.n}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className={styles.mvSection}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <span className={styles.mvIcon}>🎯</span>
              <h3>Misión</h3>
              <p>Proporcionar productos de calidad premium que promuevan el bienestar sexual,
              la autoexploración y la intimidad de parejas, en un entorno seguro, educativo y sin prejuicios.</p>
            </div>
            <div className={styles.mvCard}>
              <span className={styles.mvIcon}>🔭</span>
              <h3>Visión</h3>
              <p>Ser la tienda adulta de referencia en habla hispana, reconocida por nuestra
              discreción, variedad de productos y compromiso con la educación sexual positiva.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
          <div className={styles.teamGrid}>
            {TEAM.map(member => (
              <div key={member.name} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{member.emoji}</div>
                <h4 className={styles.teamName}>{member.name}</h4>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamBio}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoBox}>
            <h3>¿Tienes preguntas?</h3>
            <p>Estamos aquí para ayudarte de forma discreta y profesional.</p>
            <div className={styles.infoItems}>
              <span>📧 contacto@adultostore.com</span>
              <span>📞 +34 900 123 456</span>
              <span>🕐 Lun–Vie 9:00–21:00</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
