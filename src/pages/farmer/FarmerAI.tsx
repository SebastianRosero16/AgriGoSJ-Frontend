/**
 * Farmer AI Recommendations Page
 * Get AI-powered recommendations for crops
 */

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';

export const FarmerAI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendation = () => {
    setIsLoading(true);
    // Simulación - aquí se conectará con la API
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recomendaciones IA</h2>
        <p className="text-gray-600">
          Obtén recomendaciones inteligentes para mejorar tus cultivos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Recomendación de Siembra
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Obtén consejos sobre qué cultivar según la temporada y condiciones
            </p>
            <Button 
              variant="primary" 
              onClick={handleGetRecommendation}
              isLoading={isLoading}
            >
              Obtener Recomendación
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Optimización de Riego
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Consejos para optimizar el uso de agua en tus cultivos
            </p>
            <Button 
              variant="primary" 
              onClick={handleGetRecommendation}
              isLoading={isLoading}
            >
              Obtener Recomendación
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🐛</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Control de Plagas
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Identifica y previene plagas comunes en tus cultivos
            </p>
            <Button 
              variant="primary" 
              onClick={handleGetRecommendation}
              isLoading={isLoading}
            >
              Obtener Recomendación
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cosecha Óptima
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Determina el mejor momento para cosechar tus cultivos
            </p>
            <Button 
              variant="primary" 
              onClick={handleGetRecommendation}
              isLoading={isLoading}
            >
              Obtener Recomendación
            </Button>
          </div>
        </Card>
      </div>

      {/* Historial de recomendaciones */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📋 Historial de Recomendaciones
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No hay recomendaciones anteriores</p>
          <p className="text-sm mt-2">
            Las recomendaciones que obtengas aparecerán aquí
          </p>
        </div>
      </Card>
    </div>
  );
};

export default FarmerAI;
