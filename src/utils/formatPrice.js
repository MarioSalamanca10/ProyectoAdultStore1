/**
 * Formatea un número como precio en pesos colombianos
 * @param {number} value - Valor a formatear
 * @param {boolean} showDecimals - Mostrar decimales (default: false)
 * @returns {string} Precio formateado (ej: $150.000 o $150.000,50)
 */
export const formatPrice = (value, showDecimals = false) => {
  if (!value || isNaN(value)) return '$0';
  
  const num = parseFloat(value);
  
  // Formatear con separadores de miles
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);

  return formatted;
};

/**
 * Formatea un número como precio con decimales
 * @param {number} value - Valor a formatear
 * @returns {string} Precio formateado (ej: $150.000,50)
 */
export const formatPriceWithDecimals = (value) => {
  return formatPrice(value, true);
};
