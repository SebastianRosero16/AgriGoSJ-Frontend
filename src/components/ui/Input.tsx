/**
 * Input Component
 * Reusable input with validation
 */

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg
            relative z-10
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
          // allow typing decimals with comma on locales where comma is decimal separator
          onKeyDown={(e) => {
            // allow navigation keys, digits, one comma or dot for decimals, backspace, delete
            const allowedKeys = ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Home','End'];
            if (allowedKeys.includes(e.key)) return;
            // allow ctrl/meta combinations
            if (e.ctrlKey || e.metaKey) return;
            const isNumberInput = (e.currentTarget as HTMLInputElement).type === 'number';
            if (!isNumberInput) return;
            const char = e.key;
            const isDigit = /^[0-9]$/.test(char);
            const isDecimal = char === '.' || char === ',';
            if (!isDigit && !isDecimal) {
              e.preventDefault();
            }
            // prevent multiple decimals
            if (isDecimal) {
              const value = (e.currentTarget as HTMLInputElement).value;
              if (value.includes('.') || value.includes(',')) {
                e.preventDefault();
              }
            }
          }}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
