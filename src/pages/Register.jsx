import { useState } from 'react';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'owner',
    permissions: {
      canViewReports: true,
      canManageInventory: true
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionKey = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: checked
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const registerUser = async (userData) => {
    try {
      // Your registration API call here
      console.log('Registration attempt:', userData);
      
      // Example API call for user registration:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: userData.name,
      //     email: userData.email,
      //     phone: userData.phone,
      //     password: userData.password,
      //     role: userData.role,
      //     permissions: userData.permissions
      //   })
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Registration failed');
      // }
      
      // Handle successful registration:
      // - Store JWT token: localStorage.setItem('token', data.token);
      // - Redirect user: navigate('/dashboard');
      // - Show success message: toast.success('Account created successfully!');
      // - Update global auth state: setUser(data.user);
      
      // Handle different response scenarios:
      // if (data.status === 'pending_verification') {
      //   // Email verification required
      //   navigate('/verify-email', { state: { email: userData.email } });
      // } else if (data.status === 'active') {
      //   // Account immediately active
      //   navigate('/dashboard');
      // }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error types:
      // if (error.status === 409) {
      //   // User already exists
      //   setError('An account with this email already exists');
      // } else if (error.status === 422) {
      //   // Validation errors
      //   setErrors(error.data.errors);
      // } else if (error.status === 429) {
      //   // Rate limiting
      //   setError('Too many registration attempts. Please try again later.');
      // } else {
      //   // Generic error
      //   setError('Registration failed. Please try again.');
      // }
    }
  };

  const handleSubmit = () => {
    if (userData.password !== userData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    registerUser(userData);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Welcome Section */}
      <div className="flex-1 bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="mb-6 lg:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
              <img src="/src/assets/vite.svg" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
          </div>

          {/* Welcome Content */}
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4">Join Our Team</h1>
            <p className="text-base sm:text-lg mb-6 lg:mb-8 text-gray-300">
              Start your retail management journey with us today
            </p>
            
            {/* Team/Collaboration Illustration */}
            <div className="relative hidden sm:block">
              <div className="w-64 sm:w-72 lg:w-80 h-48 sm:h-56 lg:h-60 bg-gray-800 rounded-2xl mx-auto p-4 sm:p-6">
                <svg width="100%" height="100%" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background */}
                  <rect width="320" height="200" rx="12" fill="#1f2937"/>
                  
                  {/* Team Members */}
                  <circle cx="80" cy="80" r="20" fill="#3b82f6"/>
                  <rect x="65" y="105" width="30" height="35" rx="15" fill="#3b82f6"/>
                  
                  <circle cx="160" cy="70" r="20" fill="#10b981"/>
                  <rect x="145" y="95" width="30" height="35" rx="15" fill="#10b981"/>
                  
                  <circle cx="240" cy="80" r="20" fill="#f59e0b"/>
                  <rect x="225" y="105" width="30" height="35" rx="15" fill="#f59e0b"/>
                  
                  {/* Connection Lines */}
                  <line x1="100" y1="80" x2="140" y2="70" stroke="#fff" strokeWidth="2" strokeDasharray="5,5"/>
                  <line x1="180" y1="70" x2="220" y2="80" stroke="#fff" strokeWidth="2" strokeDasharray="5,5"/>
                  
                  {/* Shop/Store Icon */}
                  <rect x="140" y="140" width="40" height="30" rx="4" fill="#fff"/>
                  <rect x="145" y="145" width="30" height="15" rx="2" fill="#374151"/>
                  <rect x="150" y="150" width="5" height="5" fill="#10b981"/>
                  <rect x="160" y="150" width="5" height="5" fill="#ef4444"/>
                  <rect x="170" y="150" width="5" height="5" fill="#f59e0b"/>
                  
                  {/* ID Badge */}
                  <rect x="200" y="140" width="20" height="25" rx="2" fill="#fff"/>
                  <rect x="203" y="143" width="14" height="8" rx="1" fill="#3b82f6"/>
                  <rect x="203" y="153" width="14" height="2" fill="#6b7280"/>
                  <rect x="203" y="157" width="14" height="2" fill="#6b7280"/>
                  <rect x="203" y="161" width="14" height="2" fill="#6b7280"/>
                  
                  {/* Checkmark */}
                  <circle cx="280" cy="160" r="15" fill="#10b981"/>
                  <path d="M275 160 L278 163 L285 156" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 order-1 lg:order-2">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-gray-600">Fill in your details to get started</p>
          </div>

          <div onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1 sm:mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-black mb-1 sm:mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="+233123456789"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1 sm:mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base mt-4 sm:mt-6"
            >
              Create Account
            </button>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{' '}
                <a href="/login" className="text-black font-medium hover:underline">
               Login
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
              <span className="ml-1">BootCode</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;