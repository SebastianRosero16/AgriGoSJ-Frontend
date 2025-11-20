/**
 * Store Inputs Page
 * Manage agricultural inputs with CRUD operations
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Input, Loading } from '@/components/ui';
import { BeakerIcon, ShoppingBagIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import StockModal from '@/components/ui/StockModal';
import { storeService } from '@/api';
import type { StoreInput } from '@/types';

interface InputFormData {
  name: string;
  type: string;
  description: string;
  price: string | number;
  stock: string | number;
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
    price: '',
    stock: '',
    unit: 'kg',
  });

  useEffect(() => {
    loadInputs();
  }, []);

  const loadInputs = async () => {
    try {
      setIsLoading(true);
      const data = await storeService.getInputs();
      if (!data) {
        setInputs([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error('Respuesta inesperada de getInputs, se esperaba array:', data);
        setInputs([]);
        return;
      }

      setInputs(data);
    } catch (error: any) {
      toast.error(error?.message || 'Error al cargar insumos');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if ((String(formData.name ?? '')).trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    if ((String(formData.type ?? '')).trim().length < 2) {
      toast.error('El tipo debe tener al menos 2 caracteres');
      return false;
    }
    const priceNum = typeof formData.price === 'string' && formData.price.trim() !== ''
      ? parseFloat(String(formData.price).replace(',', '.'))
      : typeof formData.price === 'number'
      ? formData.price
      : NaN;

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('El precio debe ser un número mayor a 0');
      return false;
    }

    const stockNum = typeof formData.stock === 'string'
      ? parseInt(formData.stock.replace(/[^0-9]/g, ''), 10)
      : typeof formData.stock === 'number'
      ? formData.stock
      : NaN;

    if (isNaN(stockNum) || stockNum < 0) {
      toast.error('El stock debe ser un número entero mayor o igual a 0');
      return false;
    }
    if ((String(formData.unit ?? '')).trim().length < 1) {
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
      // Mapear el campo `type` desde etiquetas en español a los valores Enum que espera el backend
      const mapType = (input: string | number | undefined) => {
        if (!input) return 'OTHER';
        const s = String(input).trim().toLowerCase();
        const map: Record<string, string> = {
          'fertilizante': 'FERTILIZER',
          'fertilizantes': 'FERTILIZER',
          'pesticida': 'PESTICIDE',
          'pesticidas': 'PESTICIDE',
          'semilla': 'SEED',
          'semillas': 'SEED',
          'herbicida': 'HERBICIDE',
          'fungicida': 'FUNGICIDE',
          'herramienta': 'TOOL',
          'otro': 'OTHER',
          'other': 'OTHER',
        };
        return map[s] || s.toUpperCase().replace(/\s+/g, '_');
      };

      // Convertir strings a números antes de enviar
      const payload: any = {
        ...formData,
        price: typeof formData.price === 'string' ? parseFloat(String(formData.price).replace(',', '.')) : formData.price,
        stock: typeof formData.stock === 'string' ? parseInt(String(formData.stock).replace(/[^0-9]/g, ''), 10) : formData.stock,
        type: mapType(formData.type),
      };

      console.log('Enviando datos del insumo (payload):', payload);

      if (editingInput) {
        await storeService.updateInput(editingInput.id, payload);
        toast.success('Insumo actualizado exitosamente');
      } else {
        await storeService.createInput(payload);
        toast.success('Insumo creado exitosamente');
      }

      await loadInputs();
      resetForm();
    } catch (error: any) {
      console.error('Error al guardar insumo:', error);
      // Mostrar mensaje del backend si está disponible
      const backendMsg = error?.response?.data?.message || error?.response?.data || error?.message || 'Error al guardar insumo';
      toast.error(String(backendMsg));
    }
  };

  const handleEdit = (input: StoreInput) => {
    setEditingInput(input);
    setFormData({
      name: String(input.name ?? ''),
      type: String(input.type ?? ''),
      description: String(input.description ?? ''),
      price: String(input.price ?? ''),
      stock: String(input.stock ?? ''),
      unit: String(input.unit ?? 'kg'),
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
    // Abrir modal con el insumo a actualizar
    setEditingInput(input);
    setShowStockModal(true);
  };

  const [showStockModal, setShowStockModal] = useState(false);

  const handleConfirmStock = async (newStock: number) => {
    if (!editingInput) return;

    // Construir payload completo para cumplir la validación actual del backend
    const payload: any = {
      name: editingInput.name,
      type: editingInput.type,
      description: editingInput.description ?? '',
      price: typeof editingInput.price === 'number' ? editingInput.price : parseFloat(String(editingInput.price).replace(',', '.')) || 0,
      stock: newStock,
      unit: editingInput.unit ?? 'kg',
    };

    try {
      console.log('PUT payload (update stock):', payload);
      await storeService.updateInput(editingInput.id, payload);
      toast.success('Stock actualizado exitosamente');
      await loadInputs();
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error(error?.message || 'Error al actualizar stock');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      price: '',
      stock: '',
      unit: 'kg',
    });
    setEditingInput(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const cleaned = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }
    if (name === 'stock') {
      const cleaned = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter inputs (defensive: normaliza campos que pueden venir undefined del backend)
  const normalizedSearch = (searchTerm || '').toLowerCase();
  const filteredInputs = inputs.filter(input => {
    const name = (input.name ?? '').toString();
    const typeField = (input.type ?? '').toString();
    const matchesSearch = name.toLowerCase().includes(normalizedSearch) ||
                         typeField.toLowerCase().includes(normalizedSearch);

    const stockNum = Number(input.stock) || 0;
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'low-stock' && stockNum < 10 && stockNum > 0) ||
                         (filterType === 'out-of-stock' && stockNum === 0);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Mis Insumos</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gestiona tu inventario de insumos agrícolas — <span className="font-medium">{inputs.length}</span> {inputs.length === 1 ? 'insumo' : 'insumos'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Agregar Insumo'}
          </Button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="relative z-20 p-6 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {editingInput ? 'Editar Insumo' : 'Nuevo Insumo'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Selecciona tipo...</option>
                  <option value="FERTILIZER">Fertilizante</option>
                  <option value="PESTICIDE">Pesticida</option>
                  <option value="SEED">Semilla</option>
                  <option value="HERBICIDE">Herbicida</option>
                  <option value="FUNGICIDE">Fungicida</option>
                  <option value="TOOL">Herramienta</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg relative z-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Descripción del insumo..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio ($) *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock *
                </label>
                <Input
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unidad *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg relative z-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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

      {/* Stock Modal */}
      <StockModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        currentStock={editingInput?.stock}
        onSave={handleConfirmStock}
      />

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar por nombre o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800"
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
      </div>

      {/* Lista de insumos */}
      {filteredInputs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BeakerIcon className="w-16 h-16 mx-auto" />
            </div>
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
              <Button variant="primary" onClick={() => setShowForm(true)} icon={<ShoppingBagIcon className="w-5 h-5" />}>
                Crear Primer Insumo
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInputs.map((input) => (
            <div key={input.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{input.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{input.type}</p>
                </div>
                {(() => {
                  const stockNum = Number(input.stock) || 0;
                  const badgeClass = stockNum === 0 ? 'bg-red-100 text-red-800' : stockNum < 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
                  const badgeText = stockNum === 0 ? 'Sin Stock' : stockNum < 10 ? 'Stock Bajo' : 'Disponible';
                  return (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${badgeClass}`}>
                      {badgeText}
                    </span>
                  );
                })()}
              </div>

              {input.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{input.description}</p>
              )}

              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Precio</div>
                  <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">${ (Number(input.price) || 0).toFixed(0) }</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-300">Stock</div>
                  <div className={`text-lg font-semibold ${Number(input.stock) === 0 ? 'text-red-600' : Number(input.stock) < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{Number(input.stock) || 0} {input.unit}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleUpdateStock(input)} icon={<ShoppingBagIcon className="w-4 h-4" />}>Stock</Button>
                <Button variant="secondary" onClick={() => handleEdit(input)} icon={<PencilIcon className="w-4 h-4" />}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(input.id)} icon={<TrashIcon className="w-4 h-4 text-white" />}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreInputs;
