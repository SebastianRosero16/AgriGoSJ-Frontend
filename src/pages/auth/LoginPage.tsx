/**
 * Login Page
 * User authentication with strict validation
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import { Button, Input, Card } from '@/components/ui';
import { validateRequired, normalizeSpaces } from '@/utils/validation';
import { ROUTES, SUCCESS_MESSAGES, APP_INFO, USER_ROLES } from '@/utils/constants';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Get dashboard route by role
   */
  const getDashboardByRole = (role: string): string => {
    switch (role) {
      case USER_ROLES.FARMER:
        return ROUTES.FARMER.DASHBOARD;
      case USER_ROLES.STORE:
        return ROUTES.STORE.DASHBOARD;
      case USER_ROLES.BUYER:
        return ROUTES.BUYER.DASHBOARD;
      case USER_ROLES.ADMIN:
        return ROUTES.ADMIN.DASHBOARD;
      default:
        return ROUTES.HOME;
    }
  };

  /**
   * Handle input change with validation
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
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
      password: '',
    };

    // Validate username
    const usernameError = validateRequired(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }

    // Validate password
    const passwordError = validateRequired(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
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
      const loginData = {
        username: normalizeSpaces(formData.username),
        password: formData.password, // Password should not be normalized
      };

      // Get user directly from login response
      const user = await login(loginData);
      toast.success(SUCCESS_MESSAGES.LOGIN);
      
      const dashboardRoute = getDashboardByRole(user.role);
      navigate(dashboardRoute, { replace: true });
    } catch (error: any) {
      const errorMessage = error?.message || 'Credenciales inválidas. Por favor, verifica tus datos.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">
            {APP_INFO.NAME}
          </h1>
          <p className="text-gray-600">{APP_INFO.DESCRIPTION}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Usuario"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
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
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
