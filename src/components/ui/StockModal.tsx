import React, { useEffect, useState } from 'react';
import { Button, Input } from '@/components/ui';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  currentStock?: number | string;
  onSave: (newStock: number) => Promise<void> | void;
}

export const StockModal: React.FC<StockModalProps> = ({ isOpen, onClose, title = 'Actualizar Stock', currentStock = '', onSave }) => {
  const [value, setValue] = useState(String(currentStock ?? ''));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setValue(String(currentStock ?? ''));
  }, [isOpen, currentStock]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const parsed = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(parsed) || parsed < 0) {
      // show friendly message using toast if available, fallback to alert
      try { (window as any).toast?.error?.('Ingrese un stock válido (número mayor o igual a 0)'); } catch {}
      if (!(window as any).toast) alert('Ingrese un stock válido (número mayor o igual a 0)');
      return;
    }
    try {
      setIsSaving(true);
      await onSave(parsed);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Ingrese el nuevo stock.</p>

          <div className="mb-4">
            <Input
              type="text"
              name="stock"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              className=""
            />
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button variant="primary" onClick={handleConfirm} className="flex-1" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Actualizar'}</Button>
          </div>
        </div>
    </div>
  );
};

export default StockModal;
