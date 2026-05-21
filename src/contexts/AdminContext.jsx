import React, { createContext, useContext, useState, useEffect } from 'react';
import { createProduct, deleteProduct as deleteProductApi, getProducts, updateProduct as updateProductApi } from '../api/products';

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (newProduct) => {
    const productPayload = {
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      stockQuantity: parseInt(newProduct.stockQuantity, 10) || 0,
      inStock: newProduct.inStock !== undefined ? newProduct.inStock : (parseInt(newProduct.stockQuantity, 10) || 0) > 0,
      likes: 0,
      reviews: 0,
      rating: 0,
    };

    const created = await createProduct(productPayload);
    setProducts((current) => [...current, created]);
    return created;
  };

  const updateProduct = async (id, updatedData) => {
    const payload = {
      ...updatedData,
      price: updatedData.price !== undefined ? parseFloat(updatedData.price) : undefined,
      stockQuantity: updatedData.stockQuantity !== undefined ? parseInt(updatedData.stockQuantity, 10) : undefined,
      inStock: updatedData.inStock,
    };

    const updatedProduct = await updateProductApi(id, payload);
    setProducts((current) => current.map((product) =>
      product.id === id ? updatedProduct : product
    ));
  };

  const deleteProduct = async (id) => {
    await deleteProductApi(id);
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const addLike = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const updatedProduct = await updateProductApi(id, {
      likes: (product.likes || 0) + 1,
    });
    setProducts((current) => current.map((p) =>
      p.id === id ? updatedProduct : p
    ));
  };

  return (
    <AdminContext.Provider value={{
      products,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      addLike,
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
