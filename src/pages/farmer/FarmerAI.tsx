/**
 * Farmer AI Page
 * Interactive chat-based AI recommendations with crop selection and image upload
 */

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Loading } from '@/components/ui';
import { aiService, farmerService } from '@/api';
import { useQueue } from '@/hooks';
import type { Crop } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  imageUrl?: string;
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
    // Validate crop has required data
    if (!crop || !crop.cropName || !crop.cropType) {
      toast.error('Este cultivo no tiene datos completos. Por favor edítalo primero.');
      return;
    }
    
    setSelectedCrop(crop);
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        content: `¡Hola! 👋 He seleccionado tu cultivo de **${crop.cropName}** (${crop.cropType}).\n\nPuedo ayudarte con preguntas específicas sobre este cultivo:\n\n🌱 **Ejemplos de preguntas:**\n• "¿Cuándo debo regar mi ${crop.cropName}?"\n• "¿Qué fertilizante necesita en etapa de ${crop.stage}?"\n• "¿Cómo controlar plagas en mi ${crop.cropName}?"\n• "¿Cuál es el mejor momento para cosechar?"\n\n💡 **Nota:** Solo puedo responder preguntas relacionadas con tu cultivo de ${crop.cropName}. Para otros temas, por favor selecciona otro cultivo.`,
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
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Add to queue
    requestQueue.enqueue({ type: 'message', timestamp: new Date() });

    try {
      setIsSending(true);

      // Determine recommendation type based on message content - but prefer GENERAL for questions
      let recommendationType = 'GENERAL';
      const lowerMessage = messageInput.toLowerCase();
      
      // Only use specific types for very clear optimization requests
      if (lowerMessage.includes('optimi') || lowerMessage.includes('mejor') && (lowerMessage.includes('plan') || lowerMessage.includes('estrategia'))) {
        recommendationType = 'OPTIMIZATION';
      } else if (lowerMessage.includes('plaga') || lowerMessage.includes('insecto') || lowerMessage.includes('enfermedad') || lowerMessage.includes('control')) {
        recommendationType = 'PESTICIDE';
      } else if (lowerMessage.includes('fertiliz') || lowerMessage.includes('abono') || lowerMessage.includes('nutriente')) {
        recommendationType = 'FERTILIZER';
      }

      // Get AI recommendation with explicit question
      const response = await aiService.getRecommendation({
        type: recommendationType,
        cropId: selectedCrop.id,
        context: {
          question: messageInput, // Pregunta del usuario
          userMessage: messageInput, // También como userMessage por compatibilidad
          cropName: selectedCrop.cropName,
          cropType: selectedCrop.cropType,
          cropStage: selectedCrop.stage,
          soilType: selectedCrop.soilType || 'No especificado',
          climate: selectedCrop.climate || 'No especificado',
          area: selectedCrop.area,
          location: selectedCrop.location,
          hasImage: !!tempImage,
          responseLanguage: 'SPANISH', // Idioma de respuesta
          language: 'es',
          responseFormat: 'CONVERSATIONAL', // Formato conversacional, no técnico
          instructions: `INSTRUCCIONES CRÍTICAS PARA LA IA:

1. IDIOMA: Responde ÚNICAMENTE en español. Ni una sola palabra en inglés.

2. RESPONDE LA PREGUNTA ESPECÍFICA: El usuario preguntó: "${messageInput}"
   - NO des un "plan de optimización" genérico
   - NO des listas de fertilizantes si no preguntó por eso
   - Responde SOLO lo que se pregunta

3. VALIDACIÓN DE CONTEXTO: 
   - La pregunta debe ser sobre: ${selectedCrop.cropName} (${selectedCrop.cropType})
   - Si pregunta sobre otro cultivo, responde: "Tu pregunta no es sobre tu cultivo de ${selectedCrop.cropName}. Por favor pregunta específicamente sobre este cultivo."

4. FORMATO DE RESPUESTA:
   - Respuesta breve y directa (2-4 párrafos máximo)
   - Sin títulos en inglés como "Optimization Plan"
   - Sin secciones numeradas innecesarias
   - Formato conversacional y amigable

5. INFORMACIÓN DEL CULTIVO:
   - Cultivo: ${selectedCrop.cropName} (${selectedCrop.cropType})
   - Etapa actual: ${selectedCrop.stage}
   - Suelo: ${selectedCrop.soilType}
   - Clima: ${selectedCrop.climate}
   - Área: ${selectedCrop.area} hectáreas

EJEMPLO DE BUENA RESPUESTA para "¿Cuánto tiempo dura el cultivo de la cebolla?":
"El cultivo de cebolla generalmente tarda entre 90 a 120 días desde la siembra hasta la cosecha, dependiendo de la variedad. Para tu caso específico con cebolla tipo Tubérculo en clima templado, el ciclo completo suele ser de aproximadamente 100-110 días. Dado que tu cultivo está en etapa de FLOWERING (floración), te quedan aproximadamente 30-40 días más para la cosecha."

NO des respuestas técnicas sobre fertilizantes, pesticidas o planes de optimización a menos que específicamente se pregunte por ello.`
        },
      });

      // Debug: Log the response to see what backend returns
      console.log('🤖 Backend Response:', response);
      console.log('🤖 Response Type:', typeof response);
      console.log('🤖 Response Keys:', response ? Object.keys(response) : 'null/undefined');
      console.log('🤖 Explanation field:', response?.explanation);
      console.log('🤖 Full Response JSON:', JSON.stringify(response, null, 2));

      // Add AI response - handle multiple response formats
      let aiContent = '';
      
      if (typeof response === 'string') {
        aiContent = response;
      } else if (response) {
        // Backend returns: { explanation, fertilizers, pesticides, quantities }
        // Try to get content from any available field
        aiContent = response.explanation 
          || response.fertilizers
          || response.pesticides
          || response.quantities
          || response.recommendation 
          || response.content 
          || response.message
          || response.response
          || response.result
          || response.text
          || response.advice
          || response.data;
        
        // If explanation contains error, show user-friendly message
        if (aiContent && (aiContent.includes('Error generating AI recommendation') || aiContent.includes('400 Bad Request'))) {
          aiContent = '⚠️ La IA está teniendo problemas para generar la recomendación. Por favor, intenta reformular tu pregunta de manera más específica.\n\nEjemplos:\n• "¿Cuándo debo regar mi cultivo de cebolla?"\n• "¿Qué fertilizante necesita mi cebolla en etapa de floración?"\n• "Mi planta de cebolla tiene hojas amarillas, ¿qué hago?"';
        }
      }
      
      // Clean up and translate response if needed
      if (aiContent) {
        // Remove English section headers and translate common terms
        aiContent = aiContent
          .replace(/\*\*Optimization Plan for .+?\*\*/gi, '**Plan de Recomendaciones**')
          .replace(/\*\*Crop Details:\*\*/gi, '**Detalles del Cultivo:**')
          .replace(/\*\*Optimal Fertilizer Combination:\*\*/gi, '**Fertilización Recomendada:**')
          .replace(/\*\*Pesticide Strategy:\*\*/gi, '**Control de Plagas:**')
          .replace(/\*\*Cost-Effective Input Quantities:\*\*/gi, '**Cantidades Recomendadas:**')
          .replace(/\*\*Expected Yield Improvement:\*\*/gi, '**Mejora Esperada en Rendimiento:**')
          .replace(/\*\*Detailed Explanation of the Optimization Strategy:\*\*/gi, '**Explicación Detallada:**')
          .replace(/\*\*Optimization Plan:\*\*/gi, '**Plan de Mejora:**')
          .replace(/- Type:/gi, '- Tipo:')
          .replace(/- Area:/gi, '- Área:')
          .replace(/- Stage:/gi, '- Etapa:')
          .replace(/- Soil:/gi, '- Suelo:')
          .replace(/- Climate:/gi, '- Clima:')
          .replace(/\*\*\*/g, '**') // Triple asterisks to double
          .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double
          .replace(/###/g, '**') // H3 headers to bold
          .trim();
        
        // If response is still mostly in English, add a warning
        const englishWordCount = (aiContent.match(/\b(the|and|for|with|this|that|from|by|at|in|on|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|may|might)\b/gi) || []).length;
        if (englishWordCount > 20) {
          aiContent = `⚠️ **Nota:** La IA del backend respondió en inglés. Estamos trabajando para mejorar esto. Aquí está la respuesta traducida parcialmente:\n\n${aiContent}\n\n---\n💡 **Sugerencia:** Contacta al desarrollador del backend para configurar respuestas en español.`;
        }
      }
      
      if (!aiContent || aiContent.trim() === '' || aiContent === 'See full recommendation') {
        aiContent = 'Lo siento, no pude generar una recomendación en este momento. Por favor, intenta reformular tu pregunta.\n\n**Ejemplos de preguntas:**\n• "¿Cuánto tiempo tarda en crecer mi cebolla?"\n• "¿Cuándo debo cosechar?"\n• "¿Qué cuidados necesita en esta etapa?"';
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: aiContent,
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
                      <h4 className="font-semibold text-gray-900">{crop.cropName || 'Sin nombre'}</h4>
                      <p className="text-sm text-gray-600">{crop.cropType || 'Sin tipo'}</p>
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
                  <p className="text-sm text-gray-600">📏 {crop.area || 0} ha • 📍 {crop.location || 'Sin ubicación'}</p>
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
                  <h3 className="font-semibold text-gray-900">{selectedCrop.cropName}</h3>
                  <p className="text-sm text-gray-600">{selectedCrop.cropType} • {selectedCrop.area} ha</p>
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
