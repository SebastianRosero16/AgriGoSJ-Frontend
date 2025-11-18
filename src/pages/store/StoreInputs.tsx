/**
 * Store Inputs Page
 * Manage agricultural inputs with CRUD operations
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Input, Loading } from '@/components/ui';
import { storeService } from '@/api';
import type { StoreInput } from '@/types';

interface InputFormData {
  name: string;
  type: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
}

export const StoreInputs: React.FC = () => {
  const [inputs, setInputs] = useState<StoreInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInput, setEditingInput] = useState<StoreInput | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState<InputFormData>({
    name: '',
    type: '',
    description: '',
    price: 0,
    stock: 0,
    unit: 'kg',
  });

  useEffect(() => {
    loadInputs();
  }, []);

  const loadInputs = async () => {
    try {
      setIsLoading(true);
      const data = await storeService.getInputs();
      setInputs(data);
    } catch (error: any) {
      toast.error(error?.message || 'Error al cargar insumos');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (formData.name.trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    if (formData.type.trim().length < 2) {
      toast.error('El tipo debe tener al menos 2 caracteres');
      return false;
    }
    if (formData.price <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return false;
    }
    if (formData.stock < 0) {
      toast.error('El stock no puede ser negativo');
      return false;
    }
    if (formData.unit.trim().length < 1) {
      toast.error('La unidad de medida es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Log para debug
      console.log('📤 Enviando datos del insumo:', formData);
      
      if (editingInput) {
        await storeService.updateInput(editingInput.id, formData);
        toast.success('Insumo actualizado exitosamente');
      } else {
        await storeService.createInput(formData);
        toast.success('Insumo creado exitosamente');
      }

      await loadInputs();
      resetForm();
    } catch (error: any) {
      console.error('❌ Error al guardar insumo:', error);
      toast.error(error?.message || 'Error al guardar insumo');
    }
  };

  const handleEdit = (input: StoreInput) => {
    setEditingInput(input);
    setFormData({
      name: input.name,
      type: input.type,
      description: input.description || '',
      price: input.price,
      stock: input.stock,
      unit: input.unit,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este insumo?')) return;

    try {
      await storeService.deleteInput(id);
      toast.success('Insumo eliminado exitosamente');
      await loadInputs();
    } catch (error: any) {
      toast.error(error?.message || 'Error al eliminar insumo');
    }
  };

  const handleUpdateStock = async (input: StoreInput) => {
    const newStock = prompt(`Actualizar stock de ${input.name}\nStock actual: ${input.stock} ${input.unit}\n\nIngresa el nuevo stock:`, input.stock.toString());
    
    if (newStock === null) return;
    
    const stockValue = parseFloat(newStock);
    
    if (isNaN(stockValue) || stockValue < 0) {
      toast.error('Stock inválido. Debe ser un número mayor o igual a 0');
      return;
    }

    try {
      await storeService.updateInput(input.id, { stock: stockValue });
      toast.success('Stock actualizado exitosamente');
      await loadInputs();
    } catch (error: any) {
      toast.error(error?.message || 'Error al actualizar stock');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      price: 0,
      stock: 0,
      unit: 'kg',
    });
    setEditingInput(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  // Filter inputs
  const filteredInputs = inputs.filter(input => {
    const matchesSearch = input.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         input.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'low-stock' && input.stock < 10 && input.stock > 0) ||
                         (filterType === 'out-of-stock' && input.stock === 0);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Insumos</h2>
          <p className="text-gray-600">
            Gestiona tu inventario de insumos agrícolas ({inputs.length} {inputs.length === 1 ? 'insumo' : 'insumos'})
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Agregar Insumo'}
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            {editingInput ? 'Editar Insumo' : 'Nuevo Insumo'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Insumo *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Fertilizante NPK"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <Input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Ej: Fertilizante, Pesticida, Semilla"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Descripción del insumo..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio ($) *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  step="1"
                  min="0"
                  required
                />
              </div>
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
                  <option value="L">Litro (L)</option>
                  <option value="gal">Galón (gal)</option>
                  <option value="unidad">Unidad</option>
                  <option value="bolsa">Bolsa</option>
                  <option value="caja">Caja</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                {editingInput ? 'Actualizar' : 'Crear'} Insumo
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="🔍 Buscar por nombre o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilterType('all')}
            >
              Todos
            </Button>
            <Button
              variant={filterType === 'low-stock' ? 'primary' : 'secondary'}
              onClick={() => setFilterType('low-stock')}
            >
              Stock Bajo
            </Button>
            <Button
              variant={filterType === 'out-of-stock' ? 'primary' : 'secondary'}
              onClick={() => setFilterType('out-of-stock')}
            >
              Sin Stock
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de insumos */}
      {filteredInputs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterType !== 'all' 
                ? 'No se encontraron insumos' 
                : 'No tienes insumos registrados'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer insumo para empezar a vender'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                Crear Primer Insumo
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInputs.map((input) => (
            <Card key={input.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{input.name}</h3>
                  <p className="text-sm text-gray-600">{input.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  input.stock === 0 ? 'bg-red-100 text-red-800' :
                  input.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {input.stock === 0 ? 'Sin Stock' :
                   input.stock < 10 ? 'Stock Bajo' :
                   'Disponible'}
                </span>
              </div>

              {input.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{input.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="font-semibold text-lg text-primary-600">
                    ${input.price.toFixed(2)} / {input.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className={`font-semibold ${
                    input.stock === 0 ? 'text-red-600' :
                    input.stock < 10 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {input.stock} {input.unit}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateStock(input)}
                  className="text-xs"
                  title="Actualizar Stock"
                >
                  📦 Stock
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(input)}
                  className="text-xs"
                  title="Editar"
                >
                  ✏️ Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(input.id)}
                  className="text-xs"
                  title="Eliminar"
                >
                  🗑️
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreInputs;
