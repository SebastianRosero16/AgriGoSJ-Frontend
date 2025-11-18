/**
 * Email Verification Component
 * Handles email verification with 6-digit code
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Input, Card } from '@/components/ui';
import { authService } from '@/api';
import { validateVerificationCode, isNumericCode } from '@/utils/validation';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified,
  onCancel,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const [hasSentInitialCode, setHasSentInitialCode] = useState(false);

  useEffect(() => {
    // Send initial code only once
    if (!hasSentInitialCode) {
      setHasSentInitialCode(true);
      sendCode();
    }
  }, []);

  useEffect(() => {
    // Countdown timer for resend button
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const sendCode = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.sendVerificationCode(email);
      if (response.success) {
        toast.success(`Código enviado a ${email}`);
        if (response.note) {
          console.log('📧 MODO DESARROLLO:', response.note);
        }
        // Reset countdown
        setCountdown(60);
        setResendDisabled(true);
      } else {
        setError(response.message || 'Error al enviar código');
        toast.error(response.message || 'Error al enviar código');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al enviar código de verificación';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    // Validate code format
    const validation = validateVerificationCode(code);
    if (!validation.isValid) {
      setError(validation.error || 'Código inválido');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authService.verifyCode(email, code);
      
      if (response.success && response.verified) {
        toast.success('¡Email verificado exitosamente!');
        onVerified();
      } else if (response.error) {
        setError(response.error);
        toast.error(response.error);
        
        // Clear code if max attempts reached or expired
        if (response.error.includes('excedido') || response.error.includes('expirado')) {
          setCode('');
        }
      } else {
        setError('Error al verificar el código');
        toast.error('Error al verificar el código');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al verificar código';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (value === '' || isNumericCode(value)) {
      setCode(value.slice(0, 6)); // Max 6 digits
      setError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.length === 6 && !loading) {
      verifyCode();
    }
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">📧</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Verifica tu email
        </h3>
        <p className="text-sm text-gray-600">
          Hemos enviado un código de 6 dígitos a
        </p>
        <p className="text-sm font-medium text-gray-900 mt-1">
          {email}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          El código expira en 10 minutos
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            label="Código de verificación"
            type="text"
            value={code}
            onChange={handleCodeChange}
            onKeyPress={handleKeyPress}
            placeholder="123456"
            maxLength={6}
            className="text-center text-2xl tracking-widest font-mono"
            autoComplete="off"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            {code.length}/6 dígitos
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            onClick={verifyCode}
            disabled={loading || code.length !== 6}
            className="w-full"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Button>

          <Button
            variant="secondary"
            onClick={sendCode}
            disabled={loading || resendDisabled}
            className="w-full"
          >
            {resendDisabled
              ? `Reenviar código (${countdown}s)`
              : 'Reenviar código'}
          </Button>

          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• Revisa tu bandeja de entrada y spam</p>
          <p>• El código tiene 6 dígitos numéricos</p>
          <p>• Tienes 3 intentos para ingresar el código correcto</p>
        </div>
      </div>
    </Card>
  );
};
