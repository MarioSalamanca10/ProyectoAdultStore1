import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import styles from './ProductForm.module.css';

function ProductForm({ product = null, onClose = null }) {
  const { addProduct, updateProduct } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Juguetes',
    image: '',
    inStock: true,
    stockQuantity: 1,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['Juguetes', 'Lencería', 'Cosméticos', 'Accesorios', 'Parejas'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity ?? (product.inStock ? 1 : 0),
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'La imagen es requerida';
    }
    if (formData.inStock && (!formData.stockQuantity || parseInt(formData.stockQuantity, 10) <= 0)) {
      newErrors.stockQuantity = 'La cantidad en stock debe ser mayor a 0 si está en stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setFormData(prev => ({
          ...prev,
          image: imageUrl,
        }));
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const stockQuantity = parseInt(formData.stockQuantity, 10) || 0;
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity,
      inStock: formData.inStock && stockQuantity > 0,
    };

    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }

    // Resetear formulario
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Juguetes',
      image: '',
      inStock: true,
      stockQuantity: 1,
    });
    setImagePreview('');

    if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {product ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      <div className={styles.twoColumn}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nombre del Producto *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Ej: Vibrador Premium Rose"
          />
          {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Precio (USD) *
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
            placeholder="89.99"
            step="0.01"
            min="0"
          />
          {errors.price && <span className={styles.errorMsg}>{errors.price}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>
          Categoría
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={styles.select}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descripción *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          placeholder="Describe el producto en detalle..."
          rows="5"
        />
        {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.formGroup}>
          <label htmlFor="stockQuantity" className={styles.label}>
            Cantidad en stock
          </label>
          <input
            id="stockQuantity"
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.stockQuantity ? styles.inputError : ''}`}
            min="0"
          />
          {errors.stockQuantity && <span className={styles.errorMsg}>{errors.stockQuantity}</span>}
        </div>

        <div className={styles.formGroupCheckbox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
            />
            Producto en stock
          </label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image" className={styles.label}>
          Imagen *
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />
        {errors.image && <span className={styles.errorMsg}>{errors.image}</span>}
        
        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Vista previa" />
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn}>
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
