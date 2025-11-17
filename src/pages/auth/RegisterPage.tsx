/**
 * Register Page
 * User registration with role selection and strict validation
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import { Button, Input, Card } from '@/components/ui';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validateUsername,
  normalizeSpaces,
} from '@/utils/validation';
import { ROUTES, SUCCESS_MESSAGES, APP_INFO, USER_ROLES } from '@/utils/constants';
import type { UserRole } from '@/types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '' as UserRole | '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle input change with validation
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: '',
    };

    // Validate full name
    const fullNameError = validateRequired(formData.fullName);
    if (fullNameError) {
      newErrors.fullName = fullNameError;
    }

    // Validate username
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error || '';
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || '';
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error || '';
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Por favor, confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validate role
    if (!formData.role) {
      newErrors.role = 'Por favor, selecciona un tipo de cuenta';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Normalize data before sending
      const registerData = {
        username: normalizeSpaces(formData.username),
        email: normalizeSpaces(formData.email),
        password: formData.password,
        fullName: normalizeSpaces(formData.fullName),
        role: formData.role as UserRole,
      };

      await registerUser(registerData);
      toast.success(SUCCESS_MESSAGES.REGISTER);
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      console.error('Error de registro:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Error al registrar usuario. Verifica que el backend esté corriendo en http://localhost:8080';
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">Únete a {APP_INFO.NAME}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nombre Completo"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="Juan Pérez"
            required
            disabled={isLoading}
          />

          <Input
            label="Usuario"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="juan_perez"
            helperText="Solo letras, números y guiones bajos"
            autoComplete="username"
            required
            disabled={isLoading}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="juan@ejemplo.com"
            autoComplete="email"
            required
            disabled={isLoading}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            helperText="Mínimo 8 caracteres, con mayúsculas, minúsculas y números"
            autoComplete="new-password"
            required
            disabled={isLoading}
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            disabled={isLoading}
          />

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Cuenta <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.role
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              required
              disabled={isLoading}
            >
              <option value="">Selecciona un tipo</option>
              <option value={USER_ROLES.FARMER}>Agricultor</option>
              <option value={USER_ROLES.STORE}>Tienda</option>
              <option value={USER_ROLES.BUYER}>Comprador</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Registrarse
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
