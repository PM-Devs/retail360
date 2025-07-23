import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();
  // Demo credentials
  const demoCredentials = {
    email: 'demo@retailapp.com',
    password: 'demo123'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fillDemoCredentials = () => {
    setCredentials(demoCredentials);
  };

  const loginUser = async (credentials) => {
    try {
      // Check if using demo credentials
      if (credentials.email === demoCredentials.email && credentials.password === demoCredentials.password) {
        console.log('Demo login successful!');
        navigate('/dashboard'); // Redirect to dashboard on demo login
        // Handle demo login success
        return;
      }

      // Your regular login API call here
      console.log('Login attempt:', credentials);
      // Example API call:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();
      // Handle success/error
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(credentials);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="flex-1 bg-black flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                 <img src="../src/assets/vite.svg" alt="Logo" className="w-12 h-12" />
            </div>
          </div>

          {/* Welcome Content */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg mb-8 text-gray-300">
              Manage your retail operations with ease and efficiency
            </p>
            
            {/* Retail Dashboard Illustration */}
            <div className="relative">
              <div className="w-80 h-60 bg-gray-800 rounded-2xl mx-auto p-6">
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
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Log In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-800">Try Demo Account</h3>
                <p className="text-xs text-blue-600 mt-1">Use demo credentials for testing</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showDemo ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showDemo && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Email:</strong> demo@retailapp.com</p>
                  <p><strong>Password:</strong> demo123</p>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Fill Demo Credentials
                </button>
              </div>
            )}
          </div>

          <div onSubmit={handleSubmit} className="space-y-6">
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
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
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
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
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
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Log In
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-black font-medium hover:underline">
                Create Account
              </a>
            </p>
          </div>

          {/* Partnership/Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 italic flex items-center justify-center">
              Powered by
              <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#10b981"/>
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-1">BootCode</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;