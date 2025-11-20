import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Suppress authentication error logs in console
window.addEventListener('unhandledrejection', (event) => {
  // Check if this is an authentication error
  const error = event.reason;
  if (
    error?.message?.includes('Usuario o contraseña incorrectos') ||
    error?.message?.includes('Unauthorized') ||
    error?.status === 401 ||
    (error?.config?.url && error.config.url.includes('/auth/login'))
  ) {
    // Prevent the error from being logged to console
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
