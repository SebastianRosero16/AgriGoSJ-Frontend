/**
 * Admin Dashboard
 * Main dashboard for administrators
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { ROUTES, APP_INFO } from '@/utils/constants';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">
                {APP_INFO.NAME}
              </h1>
              <p className="text-sm text-gray-600">
                Panel de Administrador - Bienvenido, {user?.fullName}
              </p>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
            <p className="text-gray-600 mt-1">Gestiona la plataforma AgriGoSJ</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Agricultores</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Agrotiendas</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Compradores</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
              </div>
            </Card>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Usuarios</h3>
              <p className="text-gray-600 mb-4">
                Administra usuarios, roles y permisos
              </p>
              <Button variant="primary" fullWidth>
                Ver Usuarios
              </Button>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes del Sistema</h3>
              <p className="text-gray-600 mb-4">
                Analiza estadísticas y genera reportes
              </p>
              <Button variant="primary" fullWidth>
                Ver Reportes
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
