/**
 * Shopping Assistant Page
 * AI-powered shopping assistant for finding and buying products
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Loading } from '@/components/ui';
import { ROUTES, APP_INFO } from '@/utils/constants';
import { useAuth } from '@/hooks';
import { aiService } from '@/api';
import { formatCurrencyInteger } from '@/utils/format';
import { SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: any[];
  timestamp: Date;
}

export const ShoppingAssistantPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de compras agrícolas. ¿Qué producto estás buscando hoy?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.shoppingAssistant(inputValue, 'es');
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message,
        suggestions: response.suggestions || [],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al consultar asistente:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: any) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para comprar productos');
      return;
    }
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to={ROUTES.HOME}>
              <h1 className="text-2xl font-bold text-primary-600">
                {APP_INFO.NAME}
              </h1>
            </Link>
            <div className="flex gap-4">
              <Link to={ROUTES.MARKETPLACE}>
                <Button variant="outline">Marketplace</Button>
              </Link>
              {isAuthenticated && user ? (
                <Link to={ROUTES.HOME}>
                  <Button variant="primary">Mi Panel</Button>
                </Link>
              ) : (
                <Link to={ROUTES.LOGIN}>
                  <Button variant="primary">Iniciar Sesión</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Asistente de Compras IA</h2>
          <p className="text-gray-600 mt-2">
            Encuentra productos agrícolas usando lenguaje natural
          </p>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Product Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {message.suggestions.map((product) => (
                        <div key={product.productId} className="bg-white rounded-lg p-3 text-gray-900">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{product.productName}</p>
                                {product.cheapest && (
                                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Mejor Precio</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">👨‍🌾 {product.farmerName}</p>
                              <p className="text-xs text-gray-500">Stock: {product.availableStock} {product.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary-600">{formatCurrencyInteger(product.price)}</p>
                              <p className="text-xs text-gray-500">por {product.unit}</p>
                            </div>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => handleProductSelect(product)}
                          >
                            Comprar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Loading />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ej: Quiero comprar tomates..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoading}
              />
              <Button 
                variant="primary" 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Purchase Modal - Placeholder for now */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Compra Rápida</h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de compra rápida en desarrollo. Por ahora, ve al Marketplace para comprar.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
                Cerrar
              </Button>
              <Link to={ROUTES.MARKETPLACE}>
                <Button variant="primary">Ir al Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingAssistantPage;
