/**
 * String validation utilities
 * Used for: Form validation, input sanitization
 */

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * Check if string has multiple consecutive spaces
 */
export function hasMultipleSpaces(value: string): boolean {
  return /\s{2,}/.test(value);
}

/**
 * Check if string has only spaces
 */
export function isOnlySpaces(value: string): boolean {
  return value.length > 0 && /^\s+$/.test(value);
}

/**
 * Trim and normalize spaces (remove multiple spaces)
 */
export function normalizeSpaces(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
}

/**
 * Validate username (alphanumeric and underscore)
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize string (remove special characters except spaces)
 */
export function sanitizeString(value: string): string {
  return value.replace(/[^\w\s]/gi, '');
}

/**
 * Capitalize first letter
 */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Validate required field (not empty and no multiple spaces)
 */
export function validateRequired(value: string): string | null {
  if (isEmpty(value)) {
    return 'Este campo es obligatorio';
  }
  
  if (isOnlySpaces(value)) {
    return 'El campo no puede contener solo espacios';
  }
  
  if (hasMultipleSpaces(value)) {
    return 'El campo no puede contener múltiples espacios consecutivos';
  }
  
  return null;
}

/**
 * Validate email with error message
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const requiredError = validateRequired(email);
  if (requiredError) {
    return { isValid: false, error: requiredError };
  }
  
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Por favor, ingresa un correo electrónico válido' };
  }
  
  return { isValid: true };
}

/**
 * Validate password with error message
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (isEmpty(password)) {
    return { isValid: false, error: 'La contraseña es obligatoria' };
  }
  
  if (!isValidPassword(password)) {
    return { 
      isValid: false, 
      error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número' 
    };
  }
  
  return { isValid: true };
}

/**
 * Validate username with error message
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  const requiredError = validateRequired(username);
  if (requiredError) {
    return { isValid: false, error: requiredError };
  }
  
  if (!isValidUsername(username)) {
    return { 
      isValid: false, 
      error: 'El usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos' 
    };
  }
  
  return { isValid: true };
}

/**
 * Validate min length
 */
export function validateMinLength(value: string, min: number): string | null {
  const trimmed = value.trim();
  if (trimmed.length < min) {
    return `Debe tener al menos ${min} caracteres`;
  }
  return null;
}

/**
 * Validate max length
 */
export function validateMaxLength(value: string, max: number): string | null {
  const trimmed = value.trim();
  if (trimmed.length > max) {
    return `No puede exceder ${max} caracteres`;
  }
  return null;
}

/**
 * Validate numeric input
 */
export function isValidNumber(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value.trim());
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validate integer
 */
export function isInteger(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate date string (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: string): boolean {
  const d = new Date(date);
  return d < new Date();
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: string): boolean {
  const d = new Date(date);
  return d > new Date();
}

/**
 * Validate Gmail email format (advanced)
 */
export function isValidGmail(email: string): { isValid: boolean; error?: string } {
  if (!email.endsWith('@gmail.com') && !email.endsWith('@googlemail.com')) {
    return { isValid: false, error: 'El email debe ser de Gmail' };
  }

  const localPart = email.split('@')[0];

  // No puede empezar o terminar con punto
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'El email de Gmail no puede empezar o terminar con punto' };
  }

  // No puede tener puntos consecutivos
  if (localPart.includes('..')) {
    return { isValid: false, error: 'El email de Gmail no puede tener puntos consecutivos' };
  }

  // Solo letras, números y puntos
  if (!/^[a-zA-Z0-9.]+$/.test(localPart)) {
    return { isValid: false, error: 'El email de Gmail solo puede contener letras, números y puntos' };
  }

  return { isValid: true };
}

/**
 * Validate advanced email with Gmail check
 */
export function validateEmailAdvanced(email: string): { isValid: boolean; error?: string } {
  const requiredError = validateRequired(email);
  if (requiredError) {
    return { isValid: false, error: requiredError };
  }

  // Formato básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  // Validación específica de Gmail
  if (email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')) {
    return isValidGmail(email);
  }

  return { isValid: true };
}

/**
 * Validate verification code (6 digits)
 */
export function validateVerificationCode(code: string): { isValid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { isValid: false, error: 'El código es obligatorio' };
  }

  if (!/^\d{6}$/.test(code)) {
    return { isValid: false, error: 'El código debe tener exactamente 6 dígitos' };
  }

  return { isValid: true };
}

/**
 * Check if code is numeric
 */
export function isNumericCode(code: string): boolean {
  return /^\d+$/.test(code);
}
