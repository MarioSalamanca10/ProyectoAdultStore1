import { useState, useCallback } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback((productId) => {
    return favorites.includes(productId);
  }, [favorites]);

  const removeFavorite = useCallback((productId) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  }, []);

  return { favorites, toggleFavorite, isFavorite, removeFavorite };
}
