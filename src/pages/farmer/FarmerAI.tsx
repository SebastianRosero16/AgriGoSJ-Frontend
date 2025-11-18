/**
 * Farmer AI Page
 * Interactive chat-based AI recommendations with crop selection and image upload
 */

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Input, Loading } from '@/components/ui';
import { aiService, farmerService } from '@/api';
import { Stack } from '@/data-structures';
import { useQueue } from '@/hooks';
import type { Crop } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

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
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestQueue = useQueue<RequestQueue>();

  useEffect(() => {
    loadCrops();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const loadCrops = async () => {
    try {
      setIsLoading(true);
      const data = await farmerService.getCrops();
      setCrops(data);
    } catch (error: any) {
      toast.error(error?.message || 'Error al cargar cultivos');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCropSelect = (crop: Crop) => {
    setSelectedCrop(crop);
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        content: `¡Hola! He seleccionado tu cultivo de **${crop.name}** (${crop.type}). Puedo ayudarte con:\n\n🌱 Recomendaciones de siembra\n💧 Optimización de riego\n🐛 Control de plagas\n🌾 Fertilización\n\n¿En qué puedo asistirte hoy? También puedes enviarme fotos de tu cultivo para análisis.`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCrop) {
      toast.warning('Por favor selecciona un cultivo primero');
      return;
    }

    if (!messageInput.trim() && !selectedImage) {
      toast.warning('Escribe un mensaje o selecciona una imagen');
      return;
    }

    // Anti-spam check
    const queueArray = requestQueue.toArray();
    const recentRequest = queueArray.find(
      (req) => Date.now() - req.timestamp.getTime() < 3000
    );

    if (recentRequest) {
      toast.warning('Por favor espera unos segundos antes de enviar otro mensaje');
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: messageInput || '📷 Imagen adjunta',
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessageInput('');
    const tempImage = selectedImage;
    const tempImageUrl = imagePreview;
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Add to queue
    requestQueue.enqueue({ type: 'message', timestamp: new Date() });

    try {
      setIsSending(true);

      // Determine recommendation type based on message content
      let recommendationType = 'GENERAL';
      const lowerMessage = messageInput.toLowerCase();
      if (lowerMessage.includes('riego') || lowerMessage.includes('agua')) {
        recommendationType = 'OPTIMIZATION';
      } else if (lowerMessage.includes('plaga') || lowerMessage.includes('insecto') || lowerMessage.includes('enfermedad')) {
        recommendationType = 'PESTICIDE';
      } else if (lowerMessage.includes('fertiliz') || lowerMessage.includes('abono') || lowerMessage.includes('nutriente')) {
        recommendationType = 'FERTILIZER';
      }

      // Get AI recommendation
      const response = await aiService.getRecommendation({
        type: recommendationType,
        cropId: selectedCrop.id,
        context: {
          userMessage: messageInput,
          cropName: selectedCrop.name,
          cropType: selectedCrop.type,
          cropStatus: selectedCrop.status,
          area: selectedCrop.area,
          location: selectedCrop.location,
          hasImage: !!tempImage,
        },
      });

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: response.recommendation || response.content || 'Lo siento, no pude generar una recomendación en este momento.',
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      toast.success('Recomendación recibida');
    } catch (error: any) {
      toast.error(error?.message || 'Error al obtener recomendación');
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        requestQueue.dequeue();
      }, 3000);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recomendaciones IA 🤖</h2>
        <p className="text-gray-600">
          Chat interactivo con IA para recomendaciones personalizadas
        </p>
      </div>

      {/* Crop Selection */}
      {!selectedCrop ? (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Selecciona un cultivo para comenzar</h3>
          {crops.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-gray-500 mb-4">No tienes cultivos registrados</p>
              <Button variant="primary" onClick={() => window.location.href = '/farmer/crops'}>
                Crear Primer Cultivo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <div
                  key={crop.id}
                  onClick={() => handleCropSelect(crop)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                      <p className="text-sm text-gray-600">{crop.type}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      crop.status === 'HARVESTED' ? 'bg-green-100 text-green-800' :
                      crop.status === 'READY' ? 'bg-yellow-100 text-yellow-800' :
                      crop.status === 'GROWING' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {crop.status === 'PLANTED' ? 'Plantado' :
                       crop.status === 'GROWING' ? 'Creciendo' :
                       crop.status === 'READY' ? 'Listo' : 'Cosechado'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">📏 {crop.area} ha • 📍 {crop.location}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <>
          {/* Selected Crop Info */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🌱</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedCrop.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCrop.type} • {selectedCrop.area} ha</p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => {
                setSelectedCrop(null);
                setChatMessages([]);
              }}>
                Cambiar Cultivo
              </Button>
            </div>
          </Card>

          {/* Chat Container */}
          <Card className="h-[500px] flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Uploaded"
                        className="w-full rounded-lg mb-2 max-h-48 object-cover"
                      />
                    )}
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-bounce">🤖</div>
                      <span className="text-sm text-gray-600">Generando recomendación...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-4 pb-2">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg border-2 border-primary-500"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                  className="flex-shrink-0"
                >
                  📷
                </Button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Escribe tu pregunta sobre el cultivo..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSending || (!messageInput.trim() && !selectedImage)}
                  className="flex-shrink-0"
                >
                  {isSending ? '⏳' : '📤'} Enviar
                </Button>
              </div>
            </form>
          </Card>

          {/* Info Card */}
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Consejos para mejores recomendaciones
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Sé específico en tus preguntas (ej: "¿Cuándo debo regar?")</li>
                  <li>• Menciona síntomas si ves problemas (ej: "hojas amarillas")</li>
                  <li>• Sube fotos claras de las plantas para análisis visual</li>
                  <li>• Espera 3 segundos entre mensajes (sistema anti-spam)</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default FarmerAI;

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
      id: 'GENERAL',
      title: 'Recomendaciones de Siembra',
      icon: '🌱',
      description: 'Mejor época y técnicas para sembrar tus cultivos',
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'OPTIMIZATION',
      title: 'Gestión de Riego',
      icon: '💧',
      description: 'Optimiza el uso de agua según clima y cultivo',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'PESTICIDE',
      title: 'Control de Plagas',
      icon: '🐛',
      description: 'Identifica y controla plagas de forma natural',
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      id: 'FERTILIZER',
      title: 'Fertilización',
      icon: '🌾',
      description: 'Recomendaciones de fertilizantes para tus cultivos',
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
        cropId: 1, // Default crop ID for general recommendations
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
