import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ShopManagement from './pages/Shop';
import ProductManagement from './pages/Products';
import Category from './pages/Cat';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import StocksMove from './pages/StocksMovement';
import StockAdjustment from './pages/StocksAdjust';
import Supplier from './pages/Supplier';
import Reports from './pages/advanceReports';
import Promo from './pages/Promo';
import Settings from './pages/Settings';
import './App.css';
import viteLogo from '/vite.svg';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="text-center p-8">Checking Authentication...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // Detect if app is already installed (mobile full screen)
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
      setShowSplash(true);
      const timer = setTimeout(() => setShowSplash(false), 2500); // splash timeout
      return () => clearTimeout(timer);
    }
  }, []);

  // Detect install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-gray-300 text-white text-center">
        <img src={viteLogo} alt="Retail360 Logo" className="w-24 h-24 animate-bounce mb-4" />
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Retail360</h1>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {showInstallButton && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={handleInstallClick}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Install App
            </button>
          </div>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><ShopManagement /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
          <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/stocksMove" element={<ProtectedRoute><StocksMove /></ProtectedRoute>} />
          <Route path="/editStocks" element={<ProtectedRoute><StockAdjustment /></ProtectedRoute>} />
          <Route path="/Supplier" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/promo" element={<ProtectedRoute><Promo /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
