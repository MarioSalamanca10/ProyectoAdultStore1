/**
 * Calcula la calificación (rating) basada en la cantidad de likes
 * Escala: cada 10 likes = 1 estrella, máximo 5 estrellas
 * @param {number} likes - Cantidad de likes del producto
 * @returns {number} Rating entre 0 y 5
 */
export const calculateRating = (likes) => {
  if (!likes || likes < 0) return 0;
  
  // Cada 10 likes = 1 estrella
  const rating = Math.floor(likes / 10);
  
  // Máximo 5 estrellas
  return Math.min(rating, 5);
};

/**
 * Calcula el próximo hito de likes para la siguiente estrella
 * @param {number} likes - Cantidad de likes actual
 * @returns {number} Likes necesarios para la siguiente estrella
 */
export const getLikesForNextStar = (likes) => {
  const currentRating = calculateRating(likes);
  
  if (currentRating >= 5) {
    return null; // Ya alcanzó el máximo
  }
  
  return (currentRating + 1) * 10 - likes;
};

/**
 * Obtiene información detallada del rating
 * @param {number} likes - Cantidad de likes
 * @returns {object} Objeto con rating, estrellas completas, decimales
 */
export const getRatingDetails = (likes) => {
  const rating = calculateRating(likes);
  const fullStars = Math.floor(rating);
  const hasHalfStar = (rating % 1) >= 0.5;
  
  return {
    rating,
    fullStars,
    hasHalfStar,
    likesForNextStar: getLikesForNextStar(likes),
  };
};
