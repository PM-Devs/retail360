import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate  = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loginUser = async (credentials) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('https://retail360-backend.vercel.app/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Extract user data and permissions
      const { user, token } = data.data;
      
      // Store authentication token
      localStorage.setItem('authToken', token);
      
      // Store complete user data including permissions
      localStorage.setItem('userData', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email || credentials.email,
        shops: user.shops,
        currentShop: user.currentShop
      }));
      
      // Store current shop information separately for easy access
      const currentShop = user.shops?.find(shop => shop.shopId === user.currentShop) || user.shops?.[0];
      if (currentShop) {
        localStorage.setItem('currentShop', JSON.stringify({
          shopId: currentShop.shopId,
          shopName: currentShop.shopName,
          role: currentShop.role
        }));
        
        // Store user permissions for the current shop
        localStorage.setItem('userPermissions', JSON.stringify(currentShop.permissions || {}));
        
        // Store user role for easy access
        localStorage.setItem('userRole', currentShop.role);
      }
      
      // Store shops list for shop switching functionality
      if (user.shops && user.shops.length > 0) {
        localStorage.setItem('userShops', JSON.stringify(user.shops));
      }
      
      setUserData(user);
      
      // Show success modal with animations
      setShowSuccessModal(true);
      
     
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Clear any existing auth data on login failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('currentShop');
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userShops');
      
      // Handle different error types
      if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('Account not found') || error.message.includes('404')) {
        setError('No account found with this email address.');
      } else if (error.message.includes('429')) {
        setError('Too many login attempts. Please try again later.');
      } else if (error.message.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password.');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    loginUser(credentials);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const handleRedirectToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  // Success Modal Component with Animations
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden animate-slideUp">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50"></div>
        
        {/* Bouncing Success Elements */}
        <div className="relative z-10">
          {/* Padlock Animation Container */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto relative animate-bounce">
              {/* Padlock Body */}
              <div className="w-12 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg mx-auto mt-6 relative">
                {/* Lock Shackle - Animates from locked to unlocked */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 border-4 border-gray-700 border-b-transparent rounded-t-full animate-unlockShackle"></div>
                </div>
                
                {/* Keyhole */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-yellow-400 mx-auto"></div>
                </div>
                
                {/* Success Checkmark */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-checkmark">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Success Text with Typing Animation */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-typewriter">
              Login Successful!
            </h3>
            <p className="text-gray-600 animate-fadeInDelay">
              Welcome back, <span className="font-semibold text-green-600">{userData?.name || 'User'}</span>
            </p>
            {userData?.shops && userData.shops.length > 0 && (
              <p className="text-sm text-gray-500 mt-1 animate-fadeInDelay">
                Role: <span className="font-medium capitalize">{userData.shops.find(shop => shop.shopId === userData.currentShop)?.role || userData.shops[0].role}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2 animate-fadeInDelay2">
              Redirecting to your dashboard...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full animate-progressBar"></div>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-float1"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-float2"></div>
          <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-float3"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-purple-400 rounded-full animate-float1"></div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRedirectToDashboard}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue to Dashboard
            </button>
            <button
              onClick={handleSuccessModalClose}
              className="w-full bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes unlockShackle {
          0% { transform: translateX(-50%) rotate(0deg); }
          50% { transform: translateX(-50%) rotate(-15deg); }
          100% { transform: translateX(-30%) rotate(-45deg); }
        }

        @keyframes checkmark {
          0% { 
            opacity: 0;
            transform: scale(0) rotate(180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes fadeInDelay {
          0%, 50% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDelay2 {
          0%, 70% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(90deg); }
          75% { transform: translateY(8px) rotate(270deg); }
        }

        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-unlockShackle { animation: unlockShackle 1.5s ease-in-out 0.5s forwards; }
        .animate-checkmark { animation: checkmark 0.8s ease-out 1.8s forwards; }
        .animate-typewriter { animation: typewriter 1s ease-out 0.8s both; overflow: hidden; white-space: nowrap; }
        .animate-fadeInDelay { animation: fadeInDelay 1s ease-out; }
        .animate-fadeInDelay2 { animation: fadeInDelay2 1.2s ease-out; }
        .animate-progressBar { animation: progressBar 3s linear; }
        .animate-float1 { animation: float1 3s ease-in-out infinite; }
        .animate-float2 { animation: float2 2.5s ease-in-out infinite 0.5s; }
        .animate-float3 { animation: float3 2.8s ease-in-out infinite 1s; }
      `}</style>
    </div>
  );

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Welcome Section */}
        <div className="flex-1 bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[40vh] lg:min-h-screen">
          <div className="max-w-md w-full text-center">
            {/* Logo */}
            <div className="mb-6 lg:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <img src="/vite.svg" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
            </div>

            {/* Welcome Content */}
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4">Welcome Back</h1>
              <p className="text-sm sm:text-base lg:text-lg mb-6 lg:mb-8 text-gray-300">
                Manage your retail operations with ease and efficiency
              </p>
              
              {/* Retail Dashboard Illustration */}
              <div className="relative hidden sm:block">
                <div className="w-64 sm:w-72 lg:w-80 h-48 sm:h-56 lg:h-60 bg-gray-800 rounded-2xl mx-auto p-4 sm:p-6">
                  <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Dashboard Background */}
                    <rect width="320" height="200" rx="12" fill="#1f2937"/>
                    
                    {/* Mobile Device */}
                    <rect x="40" y="40" width="100" height="120" rx="8" fill="#fff"/>
                    <rect x="50" y="50" width="80" height="60" rx="4" fill="#3b82f6"/>
                    
                    {/* Charts/Analytics */}
                    <rect x="160" y="40" width="60" height="40" rx="4" fill="#10b981"/>
                    <rect x="240" y="40" width="60" height="40" rx="4" fill="#f59e0b"/>
                    
                    {/* Bar Chart */}
                    <rect x="160" y="100" width="10" height="30" fill="#3b82f6"/>
                    <rect x="180" y="90" width="10" height="40" fill="#10b981"/>
                    <rect x="200" y="85" width="10" height="45" fill="#f59e0b"/>
                    <rect x="220" y="95" width="10" height="35" fill="#ef4444"/>
                    
                    {/* Person Icon */}
                    <circle cx="280" cy="120" r="15" fill="#fff"/>
                    <rect x="270" y="140" width="20" height="30" rx="10" fill="#fff"/>
                    
                    {/* Shopping Cart */}
                    <rect x="50" y="140" width="40" height="20" rx="4" fill="#6b7280"/>
                    <circle cx="60" cy="170" r="5" fill="#6b7280"/>
                    <circle cx="80" cy="170" r="5" fill="#6b7280"/>
                    
                    {/* Location Pins */}
                    <circle cx="120" cy="60" r="6" fill="#ef4444"/>
                    <path d="M120 54 L120 66 L126 60 Z" fill="#ef4444"/>
                    
                    <circle cx="180" cy="160" r="6" fill="#f59e0b"/>
                    <path d="M180 154 L180 166 L186 160 Z" fill="#f59e0b"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen">
          <div className="max-w-md w-full">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Log In</h2>
              <p className="text-sm sm:text-base text-gray-600">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base disabled:bg-gray-100"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  required
                  disabled={loading}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base disabled:bg-gray-100"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-black hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !credentials.email || !credentials.password}
                className="w-full bg-black text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging In...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="text-black font-medium hover:underline">
                  Create Account
                </a>
              </p>
            </div>

            {/* Partnership/Footer */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs text-gray-500 italic flex items-center justify-center">
                Powered by
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#10b981"/>
                  <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-1">Team</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </>
  );
};

export default Login;