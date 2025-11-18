/**
 * Application Constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '30000'),
  TOKEN_REFRESH_INTERVAL: parseInt(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL || '840000'), // 14 minutes
} as const;

/**
 * Application Information
 */
export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || 'AgriGoSJ',
  VERSION: '1.0.0',
  DESCRIPTION: 'Plataforma Agrícola Inteligente',
} as const;

/**
 * User Roles
 */
export const USER_ROLES = {
  FARMER: 'FARMER',
  STORE: 'STORE',
  BUYER: 'BUYER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Role Labels (Spanish)
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.FARMER]: 'Agricultor',
  [USER_ROLES.STORE]: 'Agrotienda',
  [USER_ROLES.BUYER]: 'Comprador',
  [USER_ROLES.ADMIN]: 'Administrador',
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'agrigosj_auth_token',
  USER_DATA: 'agrigosj_user_data',
  THEME: 'agrigosj_theme',
  LANGUAGE: 'agrigosj_language',
  CACHE_PREFIX: 'agrigosj_cache_',
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Farmer routes
  FARMER: {
    DASHBOARD: '/farmer/dashboard',
    CROPS: '/farmer/crops',
    AI_RECOMMENDATIONS: '/farmer/ai',
    PRODUCTS: '/farmer/products',
  },
  
  // Store routes
  STORE: {
    DASHBOARD: '/store/dashboard',
    INPUTS: '/store/inputs',
    ORDERS: '/store/orders',
  },
  
  // Buyer routes
  BUYER: {
    DASHBOARD: '/buyer/dashboard',
    MARKETPLACE: '/buyer/marketplace',
    CART: '/buyer/cart',
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
  },
  
  // Public routes
  MARKETPLACE: '/marketplace',
  PRICE_COMPARATOR: '/price-comparator',
  ABOUT: '/about',
  PROFILE: '/profile',
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VALIDATE_EMAIL: '/auth/validate-email',
    SEND_VERIFICATION_CODE: '/auth/send-verification-code',
    VERIFY_CODE: '/auth/verify-code',
    CHECK_VERIFICATION: (email: string) => `/auth/check-verification/${email}`,
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Farmer
  FARMER: {
    CROPS: '/farmers/crops',
    CROP_BY_ID: (id: number) => `/farmers/crops/${id}`,
    PRODUCTS: '/farmers/products',
    PRODUCT_BY_ID: (id: number) => `/farmers/products/${id}`,
  },
  
  // Store
  STORE: {
    INPUTS: '/stores/inputs',
    INPUT_BY_ID: (id: number) => `/stores/inputs/${id}`,
  },
  
  // Marketplace
  MARKETPLACE: {
    PRODUCTS: '/marketplace/products',
    PRODUCT_BY_ID: (id: number) => `/marketplace/products/${id}`,
  },
  
  // AI
  AI: {
    RECOMMEND: '/ai/recommend',
    EXPLAIN: (cropId: number) => `/ai/explain/${cropId}`,
    RECOMMENDATIONS: (cropId: number) => `/ai/recommendations/${cropId}`,
  },
  
  // Price Comparator
  PRICE_COMPARATOR: {
    COMPARE: (inputId: number) => `/price-comparator/compare/${inputId}`,
    ALL: '/price-comparator/all',
  },
} as const;

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    GMAIL_PATTERN: /^[a-zA-Z0-9.]+@(gmail|googlemail)\.com$/,
  },
  VERIFICATION_CODE: {
    LENGTH: 6,
    PATTERN: /^\d{6}$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  PRICE: {
    MIN: 0,
    MAX: 1000000000,
  },
  QUANTITY: {
    MIN: 0,
    MAX: 999999,
  },
} as const;

/**
 * AI Recommendation Types
 */
export const AI_RECOMMENDATION_TYPES = {
  FERTILIZER: 'FERTILIZER',
  PESTICIDE: 'PESTICIDE',
  OPTIMIZATION: 'OPTIMIZATION',
} as const;

export type AIRecommendationType = typeof AI_RECOMMENDATION_TYPES[keyof typeof AI_RECOMMENDATION_TYPES];

/**
 * AI Recommendation Type Labels
 */
export const AI_RECOMMENDATION_TYPE_LABELS: Record<AIRecommendationType, string> = {
  [AI_RECOMMENDATION_TYPES.FERTILIZER]: 'Fertilizante',
  [AI_RECOMMENDATION_TYPES.PESTICIDE]: 'Pesticida',
  [AI_RECOMMENDATION_TYPES.OPTIMIZATION]: 'Optimización',
};

/**
 * Crop Types
 */
export const CROP_TYPES = [
  'Maíz',
  'Arroz',
  'Trigo',
  'Café',
  'Papa',
  'Tomate',
  'Plátano',
  'Yuca',
  'Zanahoria',
  'Lechuga',
  'Frijol',
  'Aguacate',
  'Naranja',
  'Mango',
  'Otro',
] as const;

/**
 * Input Types (Store)
 */
export const INPUT_TYPES = [
  'Fertilizante',
  'Pesticida',
  'Semilla',
  'Herramienta',
  'Equipo',
  'Otro',
] as const;

/**
 * Product Units
 */
export const PRODUCT_UNITS = [
  'kg',
  'g',
  'lb',
  'ton',
  'unidad',
  'caja',
  'bulto',
  'litro',
  'ml',
] as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Theme
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];

/**
 * Toast Configuration
 */
export const TOAST_CONFIG = {
  POSITION: 'top-right',
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSE_ON_HOVER: true,
  DRAGGABLE: true,
} as const;

/**
 * Request Queue Configuration
 */
export const QUEUE_CONFIG = {
  MAX_CONCURRENT_REQUESTS: 5,
  REQUEST_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  AI_REQUEST_COOLDOWN: 2000, // Prevent spam
} as const;

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300000, // 5 minutes
  MAX_CACHE_SIZE: 100,
  CACHE_KEY_PREFIX: 'agrigosj_cache_',
} as const;

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5242880, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
  UNAUTHORIZED: 'No estás autorizado. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  VALIDATION_ERROR: 'Error de validación. Por favor, verifica los datos ingresados.',
  TIMEOUT_ERROR: 'La solicitud ha excedido el tiempo de espera.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
  BAD_CREDENTIALS: 'Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.',
  USER_NOT_FOUND: 'El usuario no existe. Por favor, verifica el nombre de usuario.',
  ACCOUNT_DISABLED: 'Tu cuenta está desactivada. Contacta al administrador.',
  DUPLICATE_USERNAME: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
  DUPLICATE_EMAIL: 'El correo electrónico ya está registrado.',
  INVALID_EMAIL: 'El correo electrónico no es válido.',
  WEAK_PASSWORD: 'La contraseña es muy débil. Debe tener al menos 8 caracteres.',
  CONNECTION_ERROR: 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: '¡Bienvenido de nuevo!',
  REGISTER: '¡Registro exitoso! Ya puedes iniciar sesión.',
  LOGOUT: '¡Hasta pronto!',
  CREATE: 'Creado exitosamente',
  UPDATE: 'Actualizado exitosamente',
  DELETE: 'Eliminado exitosamente',
  SAVE: 'Guardado exitosamente',
} as const;
