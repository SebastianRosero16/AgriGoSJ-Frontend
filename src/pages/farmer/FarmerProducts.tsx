/**
 * Farmer Products Page
 * Manage marketplace products with CRUD operations using Stack for history
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Input, Loading, Modal, ImageUpload } from '@/components/ui';
import { TrashIcon, DocumentTextIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { marketplaceService } from '@/api';
import { Stack } from '@/data-structures';
import type { Product } from '@/types';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  unit: string;
  stock: string;
  category: string;
  imageUrl: string;
}

interface ActionHistory {
  action: string;
  product: string;
  timestamp: Date;
}

export const FarmerProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [actionHistory] = useState<Stack<ActionHistory>>(new Stack());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await marketplaceService.getMyProducts();
      
      if (!data) {
        setProducts([]);
        return;
      }
      
      // Validar que sea un array
      if (!Array.isArray(data)) {
        console.error('La respuesta no es un array:', data);
        toast.error('Error al cargar productos: formato de datos inválido');
        setProducts([]);
        return;
      }
      
      // Debug: ver qué datos envía el backend
      console.log('Productos recibidos del backend:', data);
      
      // Filtrar productos activos (excluir los marcados como inactivos/eliminados)
      const activeProducts = data.filter(product => {
        // Verificar múltiples campos que podrían indicar que el producto fue eliminado
        const isActive = product.active !== false && 
                        product.deleted !== true && 
                        product.available !== false &&
                        product.status !== 'DELETED' &&
                        product.status !== 'INACTIVE';
        
        console.log(`Producto ${product.name}: active=${product.active}, deleted=${product.deleted}, available=${product.available}, status=${product.status}, isActive=${isActive}`);
        
        return isActive;
      });
      
      console.log(`Productos filtrados: ${activeProducts.length} de ${data.length}`);
      
      setProducts(activeProducts);
      if (activeProducts.length > 0) {
        addToHistory('Cargar', `${activeProducts.length} productos cargados`);
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      
      // Manejar diferentes tipos de errores
      if (error?.status === 404 || error?.message?.includes('404')) {
        // No hay productos aún, esto es normal
        setProducts([]);
      } else if (error?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // Opcional: redirigir al login
      } else if (error?.status === 0) {
        toast.error('No se puede conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        const errorMessage = error?.message || 'Error al cargar productos. Por favor, intenta de nuevo.';
        toast.error(errorMessage);
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = (action: string, product: string) => {
    actionHistory.push({
      action,
      product,
      timestamp: new Date(),
    });
  };

  const validateForm = (): boolean => {
    // Validar nombre
    if (!formData.name.trim()) {
      toast.error('El nombre del producto es requerido');
      return false;
    }
    if (formData.name.trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    if (formData.name.trim().length > 100) {
      toast.error('El nombre no puede exceder 100 caracteres');
      return false;
    }

    // Validar descripción
    if (!formData.description.trim()) {
      toast.error('La descripción es requerida');
      return false;
    }
    if (formData.description.trim().length < 10) {
      toast.error('La descripción debe tener al menos 10 caracteres');
      return false;
    }
    if (formData.description.trim().length > 500) {
      toast.error('La descripción no puede exceder 500 caracteres');
      return false;
    }

    // Validar categoría
    if (!formData.category.trim()) {
      toast.error('La categoría es requerida');
      return false;
    }
    if (formData.category.trim().length < 2) {
      toast.error('La categoría debe tener al menos 2 caracteres');
      return false;
    }
    // Validar que la categoría solo contenga letras y espacios
    const categoryPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/;
    if (!categoryPattern.test(formData.category.trim())) {
      toast.error('La categoría solo puede contener letras y espacios');
      return false;
    }

    // Validar precio
    if (!formData.price || formData.price.trim() === '') {
      toast.error('El precio es requerido');
      return false;
    }
    const priceNum = parseInt(formData.price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('El precio debe ser un número mayor a 0');
      return false;
    }
    if (priceNum > 999999999) {
      toast.error('El precio no puede exceder $999,999,999 COP');
      return false;
    }

    // Validar stock
    const stockNum = formData.stock === '' ? NaN : parseInt(formData.stock.replace(/[^0-9]/g, ''), 10);
    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('El stock debe ser un número entero mayor o igual a 0');
      return false;
    }
    if (stockNum > 999999) {
      toast.error('El stock no puede exceder 999,999 unidades');
      return false;
    }

    // Validar URL de imagen si está presente
    if (formData.imageUrl && formData.imageUrl.trim()) {
      // Permitir imágenes Base64 o URLs tradicionales
      const isBase64 = formData.imageUrl.startsWith('data:image/');
      const isUrl = formData.imageUrl.startsWith('http://') || formData.imageUrl.startsWith('https://');
      
      if (!isBase64 && !isUrl) {
        toast.error('La imagen debe ser una URL válida o una imagen subida desde tu dispositivo');
        return false;
      }
      
      // Si es URL, validar formato
      if (isUrl) {
        try {
          new URL(formData.imageUrl);
          if (!formData.imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
            toast.error('La URL de la imagen debe terminar en .jpg, .png, .gif o .webp');
            return false;
          }
        } catch {
          toast.error('La URL de la imagen no es válida');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar el formulario
    if (!validateForm()) {
      return;
    }

    // Limpiar datos antes de enviar
    // El backend espera productName, productCategory y quantity
    const cleanedData: any = {
      productName: formData.name.trim(),
      productCategory: formData.category.trim(),
      productDescription: formData.description.trim(),
      price: Number(formData.price),
      quantity: Number(formData.stock), // El backend usa quantity en lugar de stock
      unit: formData.unit,
    };

    // Solo agregar imageUrl si tiene valor
    if (formData.imageUrl && formData.imageUrl.trim()) {
      cleanedData.imageUrl = formData.imageUrl.trim();
    }

    console.log('Datos a enviar al backend:', cleanedData);
    console.log('Valores del formulario:', formData);

    try {
      if (editingProduct) {
        await marketplaceService.updateProduct(editingProduct.id, cleanedData);
        toast.success('Producto actualizado exitosamente');
        addToHistory('Actualizar', formData.name.trim());
      } else {
        await marketplaceService.createProduct(cleanedData);
        toast.success('Producto publicado exitosamente');
        addToHistory('Crear', formData.name.trim());
      }
      
      await loadProducts();
      resetForm();
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      const errorMessage = error?.message || 'Error al guardar producto. Por favor, intenta de nuevo.';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      unit: product.unit,
      stock: product.stock.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: number, name: string) => {
    setProductToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await marketplaceService.deleteProduct(productToDelete.id);
      toast.success('Producto eliminado exitosamente');
      addToHistory('Eliminar', productToDelete.name);
      await loadProducts();
    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      
      // Manejar errores específicos
      if (error?.status === 500 || error?.message?.includes('foreign key constraint')) {
        toast.error('No se puede eliminar este producto porque tiene órdenes asociadas. Por favor, contacta al administrador o marca el stock como 0 para ocultarlo.');
      } else if (error?.status === 404) {
        toast.error('El producto ya no existe');
        await loadProducts(); // Recargar para actualizar la lista
      } else if (error?.status === 403) {
        toast.error('No tienes permisos para eliminar este producto');
      } else {
        toast.error(error?.message || 'Error al eliminar producto. Por favor, intenta de nuevo.');
      }
    } finally {
      setProductToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      stock: '',
      category: '',
      imageUrl: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validaciones en tiempo real
    if (name === 'price') {
      // Permitir solo números sin decimales (moneda colombiana)
      const cleanedValue = value.replace(/[^\d]/g, '');
      
      if (cleanedValue === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }
      
      const numValue = parseInt(cleanedValue, 10);
      
      // Validar que sea un número positivo y no exceda un límite razonable
      if (isNaN(numValue) || numValue < 0 || numValue > 999999999) {
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: cleanedValue }));
    } else if (name === 'stock') {
      // Allow only integer digits, keep as string so empty = ''
      const cleaned = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === 'name') {
      // Limitar longitud del nombre
      if (value.length > 100) {
        toast.warning('El nombre no puede exceder 100 caracteres');
        return;
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'description') {
      // Limitar longitud de la descripción
      if (value.length > 500) {
        toast.warning('La descripción no puede exceder 500 caracteres');
        return;
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'category') {
      // Solo permitir letras, espacios, guiones y tildes (sin números)
      const categoryPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]*$/;
      if (!categoryPattern.test(value)) {
        toast.warning('La categoría solo puede contener letras y espacios');
        return;
      }
      // Limitar longitud de la categoría
      if (value.length > 50) {
        return;
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const historyArray = actionHistory.toArray();
  return (
    <>
      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="¿Eliminar producto?"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer y el producto será removido del marketplace.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
        icon={<TrashIcon className="w-6 h-6 text-red-600" />}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Productos</h2>
            <p className="text-gray-600">
              Gestiona tus productos en el marketplace ({products.length} {products.length === 1 ? 'producto' : 'productos'})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowHistory(!showHistory)} icon={<DocumentTextIcon className="w-5 h-5" />}>
              Historial
            </Button>
            <Button variant="primary" onClick={() => setShowForm(!showForm)} icon={<PlusIcon className="w-5 h-5" />}>
              {showForm ? 'Cancelar' : 'Publicar Producto'}
            </Button>
          </div>
        </div>

        {/* Historial (Stack) */}
        {showHistory && historyArray.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-3">Historial de Acciones (Stack)</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {historyArray.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>
                    <strong>{item.action}:</strong> {item.product}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Formulario */}
        {showForm && (
          <Card className="relative z-20">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? 'Editar Producto' : 'Publicar Nuevo Producto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Producto *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Tomate Orgánico"
                  required
                />
                <Input
                  label="Categoría *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ej: Verduras, Frutas, Cereales"
                  helperText="Solo letras y espacios"
                  required
                />
                <Input
                  label="Precio (COP) *"
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ej: 5000"
                  helperText="Solo números positivos mayores a 0"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg relative z-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="lb">Libra (lb)</option>
                    <option value="unit">Unidad</option>
                    <option value="bunch">Atado</option>
                    <option value="box">Caja</option>
                  </select>
                </div>
                <Input
                  label="Stock Disponible *"
                  type="text"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
              </div>
              <ImageUpload
                label="Imagen del Producto"
                value={formData.imageUrl}
                onChange={(imageData) => setFormData(prev => ({ ...prev, imageUrl: imageData }))}
                helperText="Sube una imagen desde tu dispositivo (JPG, PNG, WEBP). Máximo 2MB"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg relative z-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe tu producto..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary">{editingProduct ? 'Actualizar' : 'Publicar'} Producto</Button>
                <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de productos / estado vacío */}
        {products.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-primary-600 mb-4">
                <ShoppingBagIcon className="w-24 h-24 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes productos publicados</h3>
              <p className="text-gray-500 mb-4">Publica tus productos para que los compradores puedan encontrarlos</p>
              <Button variant="primary" onClick={() => setShowForm(true)} icon={<PlusIcon className="w-4 h-4" />}>Publicar Primer Producto</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'; }}
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                  <span className="text-sm text-gray-500">por {product.unit}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(product)} className="flex-1">Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(product.id, product.name)} className="flex-1">Eliminar</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FarmerProducts;
