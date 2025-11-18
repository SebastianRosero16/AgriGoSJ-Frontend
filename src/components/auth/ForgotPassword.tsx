/**
 * Forgot Password Component
 * Handles password reset flow with token
 */

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input, Card } from '@/components/ui';
import { authService } from '@/api';
import { validateEmail, validatePassword } from '@/utils/validation';

interface ForgotPasswordProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: email, 2: token, 3: nueva contraseña
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Email inválido');
      return;
    }

    setLoading(true);
    try {
      // First verify email exists
      const existsResponse = await authService.verifyEmailExists(email);
      
      if (!existsResponse.exists) {
        setError('No existe un usuario registrado con ese email');
        toast.error('No existe un usuario registrado con ese email');
        setLoading(false);
        return;
      }

      // Request password reset token
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        toast.success('Token de recuperación generado');
        
        // In development, show token in console
        if (response.token && response.note) {
          console.log('🔑 MODO DESARROLLO - Token:', response.token);
          console.log('📧', response.note);
          setToken(response.token); // Auto-fill in development
        }
        
        setStep(2);
      } else {
        setError(response.message || 'Error al solicitar recuperación');
        toast.error(response.message || 'Error al solicitar recuperación');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al solicitar recuperación de contraseña';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Por favor, ingresa el token de recuperación');
      return;
    }

    setStep(3);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Contraseña inválida');
      return;
    }

    // Check passwords match
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(token, newPassword);
      
      if (response.success) {
        toast.success('¡Contraseña actualizada exitosamente!');
        onSuccess();
      } else {
        setError(response.message || 'Error al resetear contraseña');
        toast.error(response.message || 'Error al resetear contraseña');
      }
    } catch (err: any) {
      let errorMessage = err?.message || 'Error al resetear contraseña';
      
      // Handle specific errors
      if (errorMessage.includes('Token') || errorMessage.includes('token')) {
        errorMessage = 'Token inválido o expirado. Por favor, solicita uno nuevo.';
        setStep(1);
        setToken('');
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      {/* Step 1: Email */}
      {step === 1 && (
        <>
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Recuperar Contraseña
            </h3>
            <p className="text-sm text-gray-600">
              Ingresa tu email para recibir un token de recuperación
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="tu-email@gmail.com"
              required
              autoFocus
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Enviando...' : 'Enviar Token'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Step 2: Token */}
      {step === 2 && (
        <>
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🔑</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ingresa el Token
            </h3>
            <p className="text-sm text-gray-600">
              Revisa tu email para obtener el token de recuperación
            </p>
            <p className="text-sm font-medium text-gray-900 mt-2">
              {email}
            </p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <Input
              label="Token de Recuperación"
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError('');
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              required
              autoFocus
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                Continuar
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-full"
              >
                Volver
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>💡 En modo desarrollo, el token se muestra en la consola del navegador</p>
            </div>
          </form>
        </>
      )}

      {/* Step 3: Nueva Contraseña */}
      {step === 3 && (
        <>
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nueva Contraseña
            </h3>
            <p className="text-sm text-gray-600">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Nueva Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              placeholder="Mínimo 8 caracteres"
              required
              autoFocus
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Repite la contraseña"
              required
            />

            <div className="text-xs text-gray-600 space-y-1">
              <p>La contraseña debe tener:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Al menos 8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(2)}
                disabled={loading}
                className="w-full"
              >
                Volver
              </Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
