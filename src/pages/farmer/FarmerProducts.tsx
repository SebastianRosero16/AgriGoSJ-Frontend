/**
 * Farmer Products Page
 * Manage marketplace products with CRUD operations using Stack for history
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Input, Loading } from '@/components/ui';
import { marketplaceService } from '@/api';
import { Stack } from '@/data-structures';
import type { Product } from '@/types';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
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
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    unit: 'kg',
    stock: 0,
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
      setProducts(data);
      addToHistory('Cargar', 'Productos cargados');
    } catch (error: any) {
      toast.error(error?.message || 'Error al cargar productos');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.price <= 0 || formData.stock < 0) {
      toast.error('Precio y stock deben ser valores válidos');
      return;
    }

    try {
      if (editingProduct) {
        await marketplaceService.updateProduct(editingProduct.id, formData);
        toast.success('Producto actualizado exitosamente');
        addToHistory('Actualizar', formData.name);
      } else {
        await marketplaceService.createProduct(formData);
        toast.success('Producto publicado exitosamente');
        addToHistory('Crear', formData.name);
      }
      
      await loadProducts();
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || 'Error al guardar producto');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto del marketplace?')) return;

    try {
      await marketplaceService.deleteProduct(id);
      toast.success('Producto eliminado exitosamente');
      addToHistory('Eliminar', name);
      await loadProducts();
    } catch (error: any) {
      toast.error(error?.message || 'Error al eliminar producto');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      unit: 'kg',
      stock: 0,
      category: '',
      imageUrl: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  const historyArray = actionHistory.toArray();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Productos</h2>
          <p className="text-gray-600">
            Gestiona tus productos en el marketplace ({products.length} {products.length === 1 ? 'producto' : 'productos'})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowHistory(!showHistory)}>
            📜 Historial
          </Button>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Publicar Producto'}
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
        <Card>
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
                placeholder="Ej: Verduras"
                required
              />
              <Input
                label="Precio *"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
              <Input
                label="URL de Imagen"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe tu producto..."
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                {editingProduct ? 'Actualizar' : 'Publicar'} Producto
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de productos */}
      {products.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes productos publicados
            </h3>
            <p className="text-gray-500 mb-4">
              Publica tus productos para que los compradores puedan encontrarlos
            </p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Publicar Primer Producto
            </Button>
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
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                  }}
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
                <span className="text-2xl font-bold text-primary-600">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">por {product.unit}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product.id, product.name)}
                  className="flex-1"
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProducts;
