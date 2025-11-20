import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can log the error to an external service here
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-2">Se produjo un error en la aplicación</h2>
            <p className="text-gray-600 mb-4">Lo sentimos — estamos trabajando para solucionarlo. Por favor recarga la página o contacta al administrador.</p>
            <pre className="text-xs text-left bg-gray-50 p-3 rounded overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as JSX.Element;
  }
}

export default ErrorBoundary;
