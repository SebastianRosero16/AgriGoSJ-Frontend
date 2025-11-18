/**
 * Landing Page
 * Main public page showcasing AgriGoSJ features
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { ROUTES, APP_INFO } from '@/utils/constants';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🌾',
      title: 'Para Agricultores',
      description: 'Gestiona tus cultivos, recibe recomendaciones de IA personalizadas y publica tus productos en el marketplace.',
      benefits: [
        'Gestión de cultivos con seguimiento detallado',
        'Recomendaciones de IA sobre riego, fertilización y plagas',
        'Publicación de productos en marketplace',
        'Análisis de rentabilidad y estadísticas'
      ]
    },
    {
      icon: '🏪',
      title: 'Para Agrotiendas',
      description: 'Administra tu inventario de insumos agrícolas, actualiza precios y stocks fácilmente.',
      benefits: [
        'Gestión completa de inventario de insumos',
        'Actualización rápida de precios y stock',
        'Control de insumos con stock bajo',
        'Estadísticas de ventas y valor total'
      ]
    },
    {
      icon: '🛒',
      title: 'Para Compradores',
      description: 'Explora productos frescos de agricultores locales y compara precios de insumos agrícolas.',
      benefits: [
        'Marketplace de productos agrícolas frescos',
        'Comparación de precios entre agrotiendas',
        'Búsqueda y filtros avanzados',
        'Contacto directo con agricultores'
      ]
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Regístrate',
      description: 'Crea tu cuenta seleccionando tu rol: Agricultor, Agrotienda o Comprador'
    },
    {
      step: '2',
      title: 'Configura tu Perfil',
      description: 'Completa tu información y comienza a usar las herramientas específicas para tu rol'
    },
    {
      step: '3',
      title: 'Empieza a Usar',
      description: 'Gestiona cultivos, vende insumos o compra productos según tu rol'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🌱</span>
              <div>
                <h1 className="text-2xl font-bold text-primary-600">{APP_INFO.NAME}</h1>
                <p className="text-xs text-gray-600">{APP_INFO.DESCRIPTION}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate(ROUTES.LOGIN)}>
                Iniciar Sesión
              </Button>
              <Button variant="primary" onClick={() => navigate(ROUTES.REGISTER)}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Plataforma Agrícola <span className="text-primary-600">Inteligente</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conectamos agricultores, agrotiendas y compradores en un ecosistema digital. 
            Gestiona cultivos, vende insumos y encuentra productos frescos, todo en un solo lugar.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="primary" 
              onClick={() => navigate(ROUTES.REGISTER)}
              className="text-lg px-8 py-4"
            >
              Comenzar Gratis →
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate(ROUTES.MARKETPLACE)}
              className="text-lg px-8 py-4"
            >
              Ver Marketplace
            </Button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-12 shadow-xl">
            <div className="text-9xl">🌾🏪🛒</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Para Quién es {APP_INFO.NAME}?
            </h3>
            <p className="text-xl text-gray-600">
              Soluciones específicas para cada actor del sector agrícola
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                </div>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 text-xl">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h3>
            <p className="text-xl text-gray-600">
              Comienza en 3 simples pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white text-3xl font-bold rounded-full mb-6 shadow-lg">
                  {item.step}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h4>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Highlight */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">Características Destacadas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h4 className="text-xl font-bold mb-2">IA Agrícola</h4>
              <p className="text-primary-100">Recomendaciones inteligentes para tus cultivos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h4 className="text-xl font-bold mb-2">Estadísticas</h4>
              <p className="text-primary-100">Análisis detallado de tu producción</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h4 className="text-xl font-bold mb-2">Comparador</h4>
              <p className="text-primary-100">Compara precios de insumos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌐</div>
              <h4 className="text-xl font-bold mb-2">Marketplace</h4>
              <p className="text-primary-100">Vende y compra productos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para Transformar tu Negocio Agrícola?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Únete a la comunidad de agricultores, agrotiendas y compradores que ya están usando {APP_INFO.NAME}
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate(ROUTES.REGISTER)}
            className="text-xl px-12 py-5"
          >
            Crear Cuenta Gratis →
          </Button>
          <p className="text-gray-500 mt-4">
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-xl font-bold mb-4">{APP_INFO.NAME}</h5>
              <p className="text-gray-400">{APP_INFO.DESCRIPTION}</p>
              <p className="text-gray-400 mt-2">Versión {APP_INFO.VERSION}</p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Enlaces Rápidos</h5>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate(ROUTES.MARKETPLACE)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Marketplace
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate(ROUTES.PRICE_COMPARATOR)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Comparador de Precios
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate(ROUTES.REGISTER)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Registrarse
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Contacto</h5>
              <p className="text-gray-400">
                Construido con ❤️ para el sector agrícola
              </p>
              <div className="mt-4 text-3xl space-x-3">
                🌱 🚜 🌾
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 {APP_INFO.NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
