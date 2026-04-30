import { useState } from 'react';
import styles from './Contact.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INFO_CARDS = [
  { icon: '📧', title: 'Email', value: 'jomasago10@gmail.com', sub: 'Respuesta en menos de 24h' },
  { icon: '📞', title: 'Teléfono', value: '+57 323 8151791', sub: 'Lun–Vie 9:00–21:00' },
  { icon: '🕐', title: 'Horario', value: 'Lun–Vie 9:00–21:00', sub: 'Sáb 10:00–14:00' },
];

function Contact() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    else if (form.nombre.trim().length < 2) newErrors.nombre = 'Mínimo 2 caracteres';

    if (!form.email.trim()) newErrors.email = 'El email es requerido';
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = 'Formato de email inválido';

    if (!form.asunto.trim()) newErrors.asunto = 'El asunto es requerido';

    if (!form.mensaje.trim()) newErrors.mensaje = 'El mensaje es requerido';
    else if (form.mensaje.trim().length < 10) newErrors.mensaje = 'Mínimo 10 caracteres';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSuccess(true);
    setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
    setErrors({});
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contáctanos</h1>
          <p className={styles.subtitle}>Estamos aquí para ayudarte de forma discreta y profesional.</p>
        </div>

        {/* Info cards */}
        <div className={styles.infoGrid}>
          {INFO_CARDS.map(card => (
            <div key={card.title} className={styles.infoCard}>
              <span className={styles.infoIcon}>{card.icon}</span>
              <h4>{card.title}</h4>
              <p className={styles.infoValue}>{card.value}</p>
              <p className={styles.infoSub}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className={styles.formSection}>
          {success ? (
            <div className={styles.successMsg}>
              <span className={styles.successIcon}>✅</span>
              <h3>¡Mensaje enviado!</h3>
              <p>Nos pondremos en contacto contigo a la brevedad.</p>
              <button className={styles.resetBtn} onClick={() => setSuccess(false)}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <h2 className={styles.formTitle}>Envíanos un mensaje</h2>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="nombre">Nombre *</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                  {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="asunto">Asunto *</label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  className={`${styles.input} ${errors.asunto ? styles.inputError : ''}`}
                  placeholder="Motivo de tu consulta"
                  value={form.asunto}
                  onChange={handleChange}
                />
                {errors.asunto && <span className={styles.error}>{errors.asunto}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="mensaje">
                  Mensaje * <span className={styles.charCount}>{form.mensaje.length}/10 min</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  className={`${styles.textarea} ${errors.mensaje ? styles.inputError : ''}`}
                  placeholder="Escribe tu consulta aquí..."
                  rows={5}
                  value={form.mensaje}
                  onChange={handleChange}
                />
                {errors.mensaje && <span className={styles.error}>{errors.mensaje}</span>}
              </div>

              <button type="submit" className={styles.submitBtn}>
                Enviar mensaje ✉️
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
