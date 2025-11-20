/**
 * Farmer Crops Page
 * Manage crops with CRUD operations using LinkedList
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Input, Loading } from '@/components/ui';
import { SparklesIcon, MapPinIcon, SunIcon, CalendarDaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { farmerService } from '@/api';
import { LinkedList } from '@/data-structures';
import type { Crop } from '@/types';
import { formatDateSafe } from '@/utils/format';

interface CropFormData {
  name: string;
  type: string;
  plantedDate: string;
  area: number;
  location: string;
  status: string;
  notes: string;
}

export const FarmerCrops: React.FC = () => {
  const [crops, setCrops] = useState<LinkedList<Crop>>(new LinkedList());
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState<CropFormData>({
    name: '',
    type: '',
    plantedDate: '',
    area: 0,
    location: '',
    status: 'SEEDLING',
    notes: '',
  });

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setIsLoading(true);
      const data = await farmerService.getCrops();
      const cropsList = new LinkedList<Crop>();
      data.forEach((crop: Crop) => cropsList.append(crop));
      setCrops(cropsList);
    } catch (error: any) {
      toast.error(error?.message || 'Error al cargar cultivos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.type.trim() || !formData.location.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      // Transform data to match backend expectations
      const requestData = {
        cropName: formData.name,
        cropType: formData.type,
        plantingDate: formData.plantedDate, // Backend usa plantingDate sin 'd'
        area: formData.area,
        location: formData.location,
        stage: formData.status, // Backend usa stage
        soilType: 'Fértil', // Valor por defecto
        climate: 'Templado', // Valor por defecto
        notes: formData.notes,
      };

      if (editingCrop) {
        await farmerService.updateCrop(editingCrop.id, requestData);
        toast.success('Cultivo actualizado exitosamente');
      } else {
        await farmerService.createCrop(requestData);
        toast.success('Cultivo creado exitosamente');
      }
      
      await loadCrops();
      resetForm();
    } catch (error: any) {
      console.error('Error al guardar cultivo:', error);
      const backendMsg = error?.response?.data?.message || error?.response?.data || error?.message || 'Error al guardar cultivo';
      toast.error(String(backendMsg));
    }
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    
    // Handle plantingDate safely - it might be null/undefined or invalid
    let formattedDate = '';
    if (crop.plantingDate) {
      try {
        // If it's already a date string, use it
        if (typeof crop.plantingDate === 'string' && crop.plantingDate.includes('T')) {
          formattedDate = crop.plantingDate.split('T')[0];
        } else if (typeof crop.plantingDate === 'string') {
          formattedDate = crop.plantingDate;
        } else {
          // Try to convert to date
          const date = new Date(crop.plantingDate);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }
      } catch (e) {
        console.warn('Error parsing plantingDate:', e);
        formattedDate = '';
      }
    }
    
    setFormData({
      name: crop.cropName || '',
      type: crop.cropType || '',
      plantedDate: formattedDate,
      area: crop.area || 0,
      location: crop.location || '',
      status: crop.stage || 'SEEDLING',
      notes: crop.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cultivo? Se eliminarán también todas las recomendaciones de IA asociadas.')) return;

    try {
      await farmerService.deleteCrop(id);
      toast.success('Cultivo eliminado exitosamente');
      await loadCrops();
    } catch (error: any) {
      // Handle foreign key constraint error
      const errorMsg = error?.message || '';
      if (errorMsg.includes('foreign key constraint') || errorMsg.includes('CONSTRAINT')) {
        toast.error('No se puede eliminar: Este cultivo tiene recomendaciones de IA asociadas. Contacta al administrador para eliminarlo.');
      } else if (errorMsg.includes('Internal server error')) {
        toast.error('Error del servidor: No se puede eliminar el cultivo porque tiene recomendaciones asociadas.');
      } else {
        toast.error(errorMsg || 'Error al eliminar cultivo');
      }
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      plantedDate: '',
      area: 0,
      location: '',
      status: 'PLANTED',
      notes: '',
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'area' ? parseFloat(value) || 0 : value,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  const cropsArray = crops.toArray();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Cultivos</h2>
          <p className="text-gray-600">
            Gestiona tus cultivos agrícolas ({cropsArray.length} {cropsArray.length === 1 ? 'cultivo' : 'cultivos'})
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Agregar Cultivo'}
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="relative z-20">
          <h3 className="text-lg font-semibold mb-4">
            {editingCrop ? 'Editar Cultivo' : 'Nuevo Cultivo'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Cultivo *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Maíz"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cultivo *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Selecciona tipo...</option>
                  <option value="CEREAL">Cereal</option>
                  <option value="VEGETABLE">Hortaliza</option>
                  <option value="FRUIT">Frutal</option>
                  <option value="LEGUME">Leguminosa</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
              <Input
                label="Fecha de Siembra *"
                type="date"
                name="plantedDate"
                value={formData.plantedDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Área (hectáreas) *"
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                required
              />
              <Input
                label="Ubicación *"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: Parcela A"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg relative z-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="SEEDLING">Plántula</option>
                  <option value="VEGETATIVE">Crecimiento Vegetativo</option>
                  <option value="FLOWERING">Floreciendo</option>
                  <option value="FRUITING">Fructificando</option>
                  <option value="HARVEST">Listo para Cosechar</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg relative z-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Notas adicionales..."
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                {editingCrop ? 'Actualizar' : 'Crear'} Cultivo
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de cultivos */}
      {cropsArray.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <SparklesIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes cultivos registrados</h3>
            <p className="text-gray-500 mb-4">Comienza agregando tu primer cultivo para gestionar tu producción</p>
            <Button variant="primary" onClick={() => setShowForm(true)}>Crear Primer Cultivo</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cropsArray.map((crop) => (
            <Card key={crop.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{crop.cropName}</h3>
                  <p className="text-sm text-gray-600">{crop.cropType}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  crop.stage === 'HARVEST' ? 'bg-green-100 text-green-800' :
                  crop.stage === 'FRUITING' ? 'bg-yellow-100 text-yellow-800' :
                  crop.stage === 'FLOWERING' ? 'bg-purple-100 text-purple-800' :
                  crop.stage === 'VEGETATIVE' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {crop.stage === 'SEEDLING' ? 'Plántula' :
                   crop.stage === 'VEGETATIVE' ? 'Vegetativo' :
                   crop.stage === 'FLOWERING' ? 'Floreciendo' :
                   crop.stage === 'FRUITING' ? 'Fructificando' : 'Cosecha'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="inline-flex items-center gap-2"><CalendarDaysIcon className="w-4 h-4 text-gray-500" /> Siembra: {crop.plantingDate ? formatDateSafe(crop.plantingDate) : 'Sin fecha'}</p>
                <p className="inline-flex items-center gap-2"><SparklesIcon className="w-4 h-4 text-gray-500" /> Área: {crop.area} ha</p>
                <p className="inline-flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-gray-500" /> Ubicación: {crop.location}</p>
                {crop.soilType && <p className="inline-flex items-center gap-2"><SparklesIcon className="w-4 h-4 text-gray-500" /> Suelo: {crop.soilType}</p>}
                {crop.climate && <p className="inline-flex items-center gap-2"><SunIcon className="w-4 h-4 text-gray-500" /> Clima: {crop.climate}</p>}
                {crop.notes && <p className="text-xs inline-flex items-center gap-2"><DocumentTextIcon className="w-4 h-4 text-gray-500" /> {crop.notes}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(crop)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(crop.id)}
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

export default FarmerCrops;
