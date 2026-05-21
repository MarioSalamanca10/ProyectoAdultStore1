import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { getProducts } from '../services/api';

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);

  // Cargar productos desde la API remota cuando exista, o desde localStorage/inicial
  useEffect(() => {
    async function loadProducts() {
      try {
        const apiProducts = await getProducts();
        if (Array.isArray(apiProducts) && apiProducts.length > 0) {
          setProducts(apiProducts.map(product => ({
            ...product,
            likes: product.likes ?? 0,
            reviews: product.reviews ?? 0,
            rating: product.rating ?? 0,
            stockQuantity: product.stockQuantity ?? 1,
            inStock: product.stockQuantity !== undefined ? product.stockQuantity > 0 : true,
          })));
          return;
        }
      } catch (error) {
        console.warn('No se pudo cargar productos remotos:', error.message);
      }

      const savedProducts = localStorage.getItem('adminProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProducts.map(product => ({
          ...product,
          likes: 0,
          reviews: 0,
          rating: 0,
          stockQuantity: product.stockQuantity ?? 1,
          inStock: product.stockQuantity !== undefined ? product.stockQuantity > 0 : true,
        })));
      }
    }

    loadProducts();

    const handleStorageChange = (event) => {
      if (event.key !== 'adminProducts') return;
      if (!event.newValue) return;

      try {
        const updatedProducts = JSON.parse(event.newValue);
        if (Array.isArray(updatedProducts)) {
          setProducts(updatedProducts);
        }
      } catch (error) {
        console.error('Error parsing products from storage event', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Guardar productos en localStorage cada vez que cambien
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('adminProducts', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (newProduct) => {
    const stockQuantity = parseInt(newProduct.stockQuantity, 10) || 0;
    const inStock = newProduct.inStock !== undefined ? newProduct.inStock : stockQuantity > 0;

    const product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      ...newProduct,
      price: parseFloat(newProduct.price),
      stockQuantity,
      inStock,
      likes: 0,
      reviews: 0,
      rating: 0,
    };
    setProducts([...products, product]);
    return product;
  };

  const updateProduct = (id, updatedData) => {
    const stockQuantity = updatedData.stockQuantity !== undefined
      ? parseInt(updatedData.stockQuantity, 10)
      : undefined;
    const inStock = updatedData.inStock !== undefined
      ? updatedData.inStock
      : stockQuantity !== undefined
        ? stockQuantity > 0
        : undefined;

    setProducts(products.map(p => {
      if (p.id !== id) return p;
      const updatedProduct = { ...p, ...updatedData };
      if (stockQuantity !== undefined) {
        updatedProduct.stockQuantity = stockQuantity;
        updatedProduct.inStock = inStock !== undefined ? inStock : stockQuantity > 0;
      }
      if (updatedData.inStock === false) {
        updatedProduct.stockQuantity = 0;
      }
      if (updatedData.inStock === true && updatedProduct.stockQuantity === 0) {
        updatedProduct.stockQuantity = 1;
      }
      return updatedProduct;
    }));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addLike = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p
    ));
  };

  return (
    <AdminContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      addLike 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de AdminProvider');
  }
  return context;
}
