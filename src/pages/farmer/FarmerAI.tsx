/**
 * Farmer AI Page
 * AI-powered recommendations using Queue to prevent spam
 */

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Card, Button } from '@/components/ui';
import { aiService } from '@/api';
import { Stack } from '@/data-structures';
import { useQueue } from '@/hooks';

interface Recommendation {
  id: string;
  type: string;
  title: string;
  content: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

interface RequestQueue {
  type: string;
  timestamp: Date;
}

export const FarmerAI: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Stack<Recommendation>>(new Stack());
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const requestQueue = useQueue<RequestQueue>();
  const [showHistory, setShowHistory] = useState(false);

  const recommendationTypes = [
    {
      id: 'planting',
      title: 'Recomendaciones de Siembra',
      icon: '🌱',
      description: 'Mejor época y técnicas para sembrar tus cultivos',
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'irrigation',
      title: 'Gestión de Riego',
      icon: '💧',
      description: 'Optimiza el uso de agua según clima y cultivo',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'pests',
      title: 'Control de Plagas',
      icon: '🐛',
      description: 'Identifica y controla plagas de forma natural',
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      id: 'harvest',
      title: 'Momento de Cosecha',
      icon: '🌾',
      description: 'Determina el mejor momento para cosechar',
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  const handleGetRecommendation = async (type: string, title: string) => {
    // Anti-spam: Check if request already in queue
    const queueArray = requestQueue.toArray();
    const recentRequest = queueArray.find(
      (req) => req.type === type && Date.now() - req.timestamp.getTime() < 3000
    );

    if (recentRequest) {
      toast.warning('Por favor espera unos segundos antes de solicitar otra recomendación');
      return;
    }

    // Add to queue
    requestQueue.enqueue({ type, timestamp: new Date() });

    try {
      setIsLoading((prev) => ({ ...prev, [type]: true }));

      // Get AI recommendation
      const response = await aiService.getRecommendation({
        type,
        context: {
          farmerId: 1, // Would come from auth context
          season: getCurrentSeason(),
          location: 'Colombia',
        },
      });

      // Create recommendation object
      const newRecommendation: Recommendation = {
        id: `${type}-${Date.now()}`,
        type,
        title,
        content: response.recommendation,
        timestamp: new Date(),
        priority: response.priority || 'medium',
      };

      // Add to history (Stack - LIFO)
      const updatedRecommendations = new Stack<Recommendation>();
      const existingRecs = recommendations.toArray();
      existingRecs.forEach(rec => updatedRecommendations.push(rec));
      updatedRecommendations.push(newRecommendation);
      setRecommendations(updatedRecommendations);

      toast.success('Recomendación generada exitosamente');
      setShowHistory(true);
    } catch (error: any) {
      toast.error(error?.message || 'Error al obtener recomendación');
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }));
      
      // Remove from queue after 3 seconds
      setTimeout(() => {
        requestQueue.dequeue();
      }, 3000);
    }
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Otoño';
    if (month >= 6 && month <= 8) return 'Invierno';
    if (month >= 9 && month <= 11) return 'Primavera';
    return 'Verano';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };

  const historyArray = recommendations.toArray();
  const queueInfo = requestQueue.toArray();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recomendaciones IA 🤖</h2>
          <p className="text-gray-600">
            Obtén recomendaciones inteligentes para optimizar tu producción
          </p>
        </div>
        {historyArray.length > 0 && (
          <Button variant="secondary" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Ocultar Historial' : `Ver Historial (${historyArray.length})`}
          </Button>
        )}
      </div>

      {/* Queue Status (Anti-spam indicator) */}
      {queueInfo.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <div className="animate-pulse">⏳</div>
            <span>Procesando {queueInfo.length} solicitud{queueInfo.length > 1 ? 'es' : ''}...</span>
          </div>
        </Card>
      )}

      {/* Recommendation Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendationTypes.map((item) => (
          <Card key={item.id} className={`${item.color} border-2`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{item.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <Button
                  variant="primary"
                  onClick={() => handleGetRecommendation(item.id, item.title)}
                  disabled={isLoading[item.id]}
                >
                  {isLoading[item.id] ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Generando...
                    </>
                  ) : (
                    'Obtener Recomendación'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* History (Stack - LIFO) */}
      {showHistory && historyArray.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Historial de Recomendaciones (Stack)
            </h3>
            <span className="text-sm text-gray-500">
              Mostrando las más recientes primero
            </span>
          </div>

          {historyArray.map((rec) => {
            const typeData = recommendationTypes.find((t) => t.id === rec.type);
            return (
              <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{typeData?.icon || '💡'}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {rec.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                          Prioridad {getPriorityText(rec.priority)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {rec.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {rec.content}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          {historyArray.length > 5 && (
            <div className="text-center">
              <Button
                variant="secondary"
                onClick={() => {
                  const newStack = new Stack<Recommendation>();
                  setRecommendations(newStack);
                  setShowHistory(false);
                  toast.info('Historial limpiado');
                }}
              >
                Limpiar Historial
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {historyArray.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Sin recomendaciones aún
            </h3>
            <p className="text-gray-500 mb-4">
              Selecciona un tipo de recomendación arriba para comenzar
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-600">Temporada actual:</span>
              <span className="text-sm font-semibold text-primary-600">
                {getCurrentSeason()}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Sobre las Recomendaciones IA
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Las recomendaciones se generan usando inteligencia artificial</li>
              <li>• Se consideran factores como clima, temporada y ubicación</li>
              <li>• El historial se guarda localmente durante tu sesión</li>
              <li>• Puedes generar una recomendación cada 3 segundos (anti-spam)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FarmerAI;
