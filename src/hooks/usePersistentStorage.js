import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  FAVORITES: 'adulto_storer_favorites',
  COMMENTS: 'adulto_storer_comments',
};

export function usePersistentStorage() {
  // Cargar favoritos desde localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Cargar comentarios desde localStorage
  const [comments, setComments] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persistir favoritos cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  // Persistir comentarios cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  }, [comments]);

  // Toggle favorito con persistencia
  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  }, []);

  // Verificar si es favorito
  const isFavorite = useCallback((productId) => {
    return favorites.includes(productId);
  }, [favorites]);

  // Agregar comentario a un producto
  const addComment = useCallback((productId, comment) => {
    setComments(prev => ({
      ...prev,
      [productId]: [
        ...(prev[productId] || []),
        {
          id: Date.now(),
          text: comment.text,
          rating: comment.rating,
          date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      ],
    }));
  }, []);

  // Obtener comentarios de un producto
  const getComments = useCallback((productId) => {
    return comments[productId] || [];
  }, [comments]);

  // Obtener todos los IDs favoritos
  const getFavoriteIds = useCallback(() => {
    return favorites;
  }, [favorites]);

  // Limpiar todos los favoritos
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // Limpiar comentarios de un producto
  const clearComments = useCallback((productId) => {
    setComments(prev => {
      const newComments = { ...prev };
      delete newComments[productId];
      return newComments;
    });
  }, []);

  return {
    favorites,
    comments,
    toggleFavorite,
    isFavorite,
    addComment,
    getComments,
    getFavoriteIds,
    clearFavorites,
    clearComments,
  };
}

export default usePersistentStorage;