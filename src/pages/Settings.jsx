import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Eye, EyeOff, Save, Camera, Edit3, Bot } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatBot from '../components/ChatBot.jsx';

const SettingsProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Store Manager',
    shopName: 'Downtown Electronics',
    avatar: null
  });

  const [settings, setSettings] = useState({
    notifications: {
      lowStock: true,
      newOrders: true,
      dailyReports: false,
      systemUpdates: true
    },
    preferences: {
      theme: 'light',
      language: 'English',
      currency: 'USD',
      timezone: 'UTC-5'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginAlerts: true
    }
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock dashboard data for ChatBot
  const dashboardData = {
    todayStats: {
      revenue: 2450.75,
      transactions: 23,
      averageOrderValue: 106.55
    },
    inventory: {
      lowStockCount: 5,
      lowStockProducts: [
        { name: 'iPhone Cases', stock: 3 },
        { name: 'USB Cables', stock: 8 }
      ]
    },
    customers: {
      totalCustomers: 342
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings and profile...', { profile, settings, passwords });
    
    // API Calls to be implemented:
    
    // 1. Update Profile API Call
    // try {
    //   const profileResponse = await fetch('/api/user/profile', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     },
    //     body: JSON.stringify({
    //       firstName: profile.firstName,
    //       lastName: profile.lastName,
    //       email: profile.email,
    //       phone: profile.phone,
    //       shopName: profile.shopName
    //     })
    //   });
    //   const profileData = await profileResponse.json();
    //   console.log('Profile updated:', profileData);
    // } catch (error) {
    //   console.error('Failed to update profile:', error);
    // }

    // 2. Update Settings API Call
    // try {
    //   const settingsResponse = await fetch('/api/user/settings', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     },
    //     body: JSON.stringify(settings)
    //   });
    //   const settingsData = await settingsResponse.json();
    //   console.log('Settings updated:', settingsData);
    // } catch (error) {
    //   console.error('Failed to update settings:', error);
    // }

    // 3. Change Password API Call (if password fields are filled)
    // if (passwords.currentPassword && passwords.newPassword && passwords.confirmPassword) {
    //   if (passwords.newPassword !== passwords.confirmPassword) {
    //     alert('New passwords do not match');
    //     return;
    //   }
    //   try {
    //     const passwordResponse = await fetch('/api/user/change-password', {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //       },
    //       body: JSON.stringify({
    //         currentPassword: passwords.currentPassword,
    //         newPassword: passwords.newPassword
    //       })
    //     });
    //     const passwordData = await passwordResponse.json();
    //     console.log('Password updated:', passwordData);
    //     // Clear password fields after successful update
    //     setPasswords({
    //       currentPassword: '',
    //       newPassword: '',
    //       confirmPassword: ''
    //     });
    //   } catch (error) {
    //     console.error('Failed to update password:', error);
    //   }
    // }

    // 4. Upload Avatar API Call (if avatar file is selected)
    // if (profile.avatar instanceof File) {
    //   const formData = new FormData();
    //   formData.append('avatar', profile.avatar);
    //   try {
    //     const avatarResponse = await fetch('/api/user/avatar', {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //       },
    //       body: formData
    //     });
    //     const avatarData = await avatarResponse.json();
    //     console.log('Avatar updated:', avatarData);
    //   } catch (error) {
    //     console.error('Failed to upload avatar:', error);
    //   }
    // }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
     
      {/* Sidebar - Fixed positioning with proper z-index - Hidden on mobile */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:block`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 w-64 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area - Adjusted for sidebar */}
      <div className={`flex-1 transition-all duration-300 lg:ml-64 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Navbar - Fixed at top with proper z-index */}
        <div className="fixed top-0 right-0 left-0 z-30 transition-all duration-300 lg:left-64" style={{ left: window.innerWidth >= 1024 ? (sidebarOpen ? '256px' : '80px') : '0px' }}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title="Settings & Profile"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-24">
          <div className="max-w-7xl mx-auto">
            {/* Header with Save Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Manage your account and preferences</p>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="bg-black text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Sidebar Navigation - Mobile horizontal scroll, Desktop vertical */}
              <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 h-fit">
                <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap flex-shrink-0 lg:w-full ${
                          activeTab === tab.id
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-black">Profile Information</h2>
                        <Edit3 className="w-5 h-5 text-gray-400" />
                      </div>

                      {/* Avatar Section */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                        <div className="relative">
                          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                            ) : (
                              `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
                            )}
                          </div>
                          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                            <Camera className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-lg font-medium text-black">{profile.firstName} {profile.lastName}</h3>
                          <p className="text-gray-600">{profile.role}</p>
                          <p className="text-gray-500 text-sm">{profile.shopName}</p>
                        </div>
                      </div>

                      {/* Profile Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">First Name</label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-black mb-2">Email</label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Phone</label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Role</label>
                          <input
                            type="text"
                            value={profile.role}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-black mb-2">Shop Name</label>
                          <input
                            type="text"
                            value={profile.shopName}
                            onChange={(e) => handleProfileChange('shopName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    {/* Preferences */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <h2 className="text-xl font-semibold text-black mb-6">Preferences</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Theme</label>
                          <select
                            value={settings.preferences.theme}
                            onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Language</label>
                          <select
                            value={settings.preferences.language}
                            onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Currency</label>
                          <select
                            value={settings.preferences.currency}
                            onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="GHS">GHS (₵)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Timezone</label>
                          <select
                            value={settings.preferences.timezone}
                            onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          >
                            <option value="UTC-5">Eastern Time (UTC-5)</option>
                            <option value="UTC-8">Pacific Time (UTC-8)</option>
                            <option value="UTC+0">GMT (UTC+0)</option>
                            <option value="UTC+1">Central European Time (UTC+1)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <h2 className="text-xl font-semibold text-black mb-6">Change Password</h2>
                      <div className="space-y-4 max-w-full sm:max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={passwords.currentPassword}
                              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwords.newPassword}
                              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwords.confirmPassword}
                              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                      <h2 className="text-xl font-semibold text-black mb-6">Security Settings</h2>
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-black">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security.twoFactor}
                              onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-black">Login Alerts</h3>
                            <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security.loginAlerts}
                              onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">Session Timeout (minutes)</label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="w-full sm:w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-black mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-black">Low Stock Alerts</h3>
                          <p className="text-sm text-gray-600">Get notified when products are running low</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.lowStock}
                            onChange={(e) => handleSettingChange('notifications', 'lowStock', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-black">New Orders</h3>
                          <p className="text-sm text-gray-600">Get notified of new customer orders</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.newOrders}
                            onChange={(e) => handleSettingChange('notifications', 'newOrders', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-black">Daily Reports</h3>
                          <p className="text-sm text-gray-600">Receive daily sales and inventory reports</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.dailyReports}
                            onChange={(e) => handleSettingChange('notifications', 'dailyReports', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                         <h3 className="font-medium text-black">System Updates</h3>
                          <p className="text-sm text-gray-600">Get notified of system updates and maintenance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.systemUpdates}
                            onChange={(e) => handleSettingChange('notifications', 'systemUpdates', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      {/* Floating Chat Button - Adjusted for mobile */}
      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* ChatBot */}
      <ChatBot 
        dashboardData={dashboardData} 
        isVisible={showChatBot} 
        onClose={() => setShowChatBot(false)} 
      />
    </div>
  );
};

export default SettingsProfile;

// Additional API calls that can be implemented:

// 1. GET Profile Data on Component Mount
// useEffect(() => {
//   const fetchProfileData = async () => {
//     try {
//       const response = await fetch('/api/user/profile', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setProfile(data);
//     } catch (error) {
//       console.error('Failed to fetch profile data:', error);
//     }
//   };
//   fetchProfileData();
// }, []);

// 2. GET Settings Data on Component Mount
// useEffect(() => {
//   const fetchSettingsData = async () => {
//     try {
//       const response = await fetch('/api/user/settings', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setSettings(data);
//     } catch (error) {
//       console.error('Failed to fetch settings data:', error);
//     }
//   };
//   fetchSettingsData();
// }, []);

// 3. Handle Avatar File Upload
// const handleAvatarChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setProfile(prev => ({ ...prev, avatar: e.target.result }));
//     };
//     reader.readAsDataURL(file);
//   }
// };

// 4. Validate Password Strength
// const validatePassword = (password) => {
//   const minLength = 8;
//   const hasUpperCase = /[A-Z]/.test(password);
//   const hasLowerCase = /[a-z]/.test(password);
//   const hasNumbers = /\d/.test(password);
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//   
//   return {
//     isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
//     errors: {
//       minLength: password.length < minLength,
//       hasUpperCase: !hasUpperCase,
//       hasLowerCase: !hasLowerCase,
//       hasNumbers: !hasNumbers,
//       hasSpecialChar: !hasSpecialChar
//     }
//   };
// };

// 5. Two-Factor Authentication Setup API
// const setupTwoFactor = async () => {
//   try {
//     const response = await fetch('/api/user/two-factor/setup', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     });
//     const data = await response.json();
//     // Show QR code or setup instructions
//     console.log('Two-factor setup data:', data);
//   } catch (error) {
//     console.error('Failed to setup two-factor authentication:', error);
//   }
// };

// 6. Email Verification API
// const sendEmailVerification = async () => {
//   try {
//     const response = await fetch('/api/user/verify-email', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify({ email: profile.email })
//     });
//     const data = await response.json();
//     console.log('Email verification sent:', data);
//   } catch (error) {
//     console.error('Failed to send email verification:', error);
//   }
// };

// 7. Delete Account API
// const deleteAccount = async () => {
//   if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
//     try {
//       const response = await fetch('/api/user/account', {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (response.ok) {
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//       }
//     } catch (error) {
//       console.error('Failed to delete account:', error);
//     }
//   }
// };

// 8. Export User Data API
// const exportUserData = async () => {
//   try {
//     const response = await fetch('/api/user/export', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     });
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = 'user-data.json';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Failed to export user data:', error);
//   }
// };