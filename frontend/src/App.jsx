import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ui';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Auth init is handled inside AuthProvider
  }, [dispatch]);

  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster position="top-right" />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
