import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'gift_lists';

export function useGiftList() {
  const [giftLists, setGiftLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);

  // Cargar listas guardadas del localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const lists = JSON.parse(saved);
        setGiftLists(lists);
        if (lists.length > 0 && !currentListId) {
          setCurrentListId(lists[0].id);
        }
      } catch (e) {
        console.error('Error cargando listas de deseos:', e);
      }
    }
  }, []);

  // Guardar listas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(giftLists));
  }, [giftLists]);

  const createList = useCallback((name) => {
    const newList = {
      id: Date.now(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
      promoCode: null,
      discountPercentage: 0,
    };
    setGiftLists(prev => [...prev, newList]);
    setCurrentListId(newList.id);
    return newList;
  }, []);

  const deleteList = useCallback((listId) => {
    setGiftLists(prev => prev.filter(list => list.id !== listId));
    if (currentListId === listId) {
      setCurrentListId(null);
    }
  }, [currentListId]);

  const renameList = useCallback((listId, newName) => {
    setGiftLists(prev =>
      prev.map(list =>
        list.id === listId ? { ...list, name: newName } : list
      )
    );
  }, []);

  const addItemToList = useCallback((listId, product) => {
    setGiftLists(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.some(item => item.id === product.id)
                ? list.items
                : [...list.items, { ...product, addedAt: new Date().toISOString() }]
            }
          : list
      )
    );
  }, []);

  const removeItemFromList = useCallback((listId, productId) => {
    setGiftLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, items: list.items.filter(item => item.id !== productId) }
          : list
      )
    );
  }, []);

  const clearList = useCallback((listId) => {
    setGiftLists(prev =>
      prev.map(list =>
        list.id === listId ? { ...list, items: [] } : list
      )
    );
  }, []);

  const applyPromotion = useCallback((listId, promoCode, discountPercentage) => {
    setGiftLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { ...list, promoCode, discountPercentage }
          : list
      )
    );
  }, []);

  const getCurrentList = useCallback(() => {
    return giftLists.find(list => list.id === currentListId);
  }, [giftLists, currentListId]);

  const calculateListTotal = useCallback((listId) => {
    const list = giftLists.find(l => l.id === listId);
    if (!list) return 0;
    
    const subtotal = list.items.reduce((sum, item) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + price;
    }, 0);

    const discount = subtotal * (list.discountPercentage / 100);
    return subtotal - discount;
  }, [giftLists]);

  const getPromotionsForList = useCallback((listId) => {
    const list = giftLists.find(l => l.id === listId);
    if (!list || list.items.length === 0) return [];

    const promos = [];
    const itemCount = list.items.length;

    if (itemCount >= 2) {
      promos.push({
        id: 'buy2',
        name: '🎁 Promo de 2+ artículos',
        discount: 5,
        message: 'Descuento del 5% en tu lista'
      });
    }

    if (itemCount >= 4) {
      promos.push({
        id: 'buy4',
        name: '🎉 Promo de 4+ artículos',
        discount: 10,
        message: 'Descuento del 10% en tu lista'
      });
    }

    if (itemCount >= 6) {
      promos.push({
        id: 'buy6',
        name: '💝 Promo Pack Completo',
        discount: 15,
        message: 'Descuento del 15% en tu lista'
      });
    }

    const totalValue = list.items.reduce((sum, item) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + price;
    }, 0);

    if (totalValue >= 150) {
      promos.push({
        id: 'highvalue',
        name: '💎 Promo Premium',
        discount: 12,
        message: 'Descuento del 12% por compra mayor a $150'
      });
    }

    return promos;
  }, [giftLists]);

  return {
    giftLists,
    currentListId,
    setCurrentListId,
    createList,
    deleteList,
    renameList,
    addItemToList,
    removeItemFromList,
    clearList,
    applyPromotion,
    getCurrentList,
    calculateListTotal,
    getPromotionsForList,
  };
}
