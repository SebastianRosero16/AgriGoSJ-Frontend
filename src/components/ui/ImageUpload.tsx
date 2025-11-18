/**
 * Image Upload Component
 * Allows users to upload images from their device with preview
 */

import React, { useState, useRef } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (imageData: string) => void;
  error?: string;
  helperText?: string;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Imagen del Producto',
  value = '',
  onChange,
  error,
  helperText = 'Formatos: JPG, PNG, WEBP. Máximo 2MB',
  maxSizeMB = 2,
}) => {
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato no válido. Use JPG, PNG o WEBP');
      return;
    }

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError(`La imagen no debe exceder ${maxSizeMB}MB`);
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      // Convertir a Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onChange(base64String);
        setUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Error al leer el archivo');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError('Error al procesar la imagen');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Preview or Upload Button */}
        {preview ? (
          <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={uploading}
              >
                Cambiar
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors hover:border-primary-400 hover:bg-primary-50
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              ${error || uploadError ? 'border-red-500' : 'border-gray-300'}
            `}
          >
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600 mb-1">
                {uploading ? 'Procesando imagen...' : 'Click para subir imagen'}
              </p>
              <p className="text-xs text-gray-500">o arrastra y suelta aquí</p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {/* Helper text or error */}
        {(uploadError || error) && (
          <p className="text-sm text-red-500">{uploadError || error}</p>
        )}
        {!uploadError && !error && helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
