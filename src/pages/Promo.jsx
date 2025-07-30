import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit3, Trash2, Check, X, Gift, Percent, Users, Code, Calendar, DollarSign, TrendingUp, Filter, Search, ChevronDown, Bot } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';
import { toast } from 'react-toastify';

const DiscountPromotionsSystem = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const shopId = userData?.currentShop?._id;
  const authToken = localStorage.getItem('authToken');

  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    code: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: ''
  });

  // API base URL
  const API_BASE = 'https://retail360-backend.vercel.app';

  // Load campaigns from API
  const loadCampaigns = async () => {
    if (!shopId) {
      toast.error('No shop selected');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/discounts/shop/${shopId}/active`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new campaign
  const handleCreateCampaign = async () => {
    if (!shopId) {
      toast.error('No shop selected');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...newCampaign,
          shopId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create campaign');
      }

      if (data.success) {
        toast.success('Campaign created successfully');
        // Add the new campaign to local state
        setCampaigns([...campaigns, { ...newCampaign, _id: data.data._id }]);
        // Reset form
        setNewCampaign({
          name: '',
          code: '',
          type: 'percentage',
          value: '',
          startDate: '',
          endDate: ''
        });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete campaign
  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/discounts/${selectedCampaign._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete campaign');
      }

      if (data.success) {
        toast.success('Campaign deleted successfully');
        setCampaigns(campaigns.filter(campaign => campaign._id !== selectedCampaign._id));
        setShowDeleteModal(false);
        setSelectedCampaign(null);
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  const CampaignCard = ({ campaign }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-black mb-1 truncate">{campaign.name}</h3>
          <p className="text-sm text-gray-600 break-all sm:break-normal">Code: {campaign.code}</p>
        </div>
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start">
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Percent className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {campaign.type === 'percentage' ? `${campaign.value}%` : `$${campaign.value}`} off
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {campaign.startDate} - {campaign.endDate}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <button 
          onClick={() => {
            setSelectedCampaign(campaign);
            setShowEditModal(true);
          }}
          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
          title="Edit Campaign"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => {
            setSelectedCampaign(campaign);
            setShowDeleteModal(true);
          }}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete Campaign"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Navbar */}
        <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
          sidebarOpen ? 'lg:left-64' : 'lg:left-20'
        } left-0`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={'Promotion and Discount'}
          />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pt-16 pb-20 lg:pb-6">
          {/* Header */}
          <div className="bg-black text-white p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Discounts & Promotions</h1>
                  <p className="text-gray-300 text-sm sm:text-base">Manage campaigns and discounts for your store</p>
                </div>
                <div className="flex justify-between lg:justify-end lg:space-x-8 space-x-4">
                  <div className="text-center lg:text-right">
                    <p className="text-xl sm:text-2xl font-bold">{campaigns.length}</p>
                    <p className="text-xs sm:text-sm text-gray-300">Active Campaigns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
            <div className="max-w-6xl mx-auto">
              <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto px-4 sm:px-0">
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'campaigns'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Campaigns
                </button>
              </nav>
            </div>
          </div>

          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            {activeTab === 'campaigns' && (
              <div>
                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Campaign</span>
                  </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && campaigns.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Campaigns</h3>
                    <p className="text-gray-500">Create your first discount campaign to get started</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Create Campaign
                    </button>
                  </div>
                )}

                {/* Campaigns Grid */}
                {!isLoading && campaigns.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {campaigns
                      .filter(campaign => 
                        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        campaign.code.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(campaign => (
                        <CampaignCard key={campaign._id} campaign={campaign} />
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Create Campaign Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Create New Campaign</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Campaign Name *</label>
                      <input
                        type="text"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter campaign name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Discount Code *</label>
                      <input
                        type="text"
                        value={newCampaign.code}
                        onChange={(e) => setNewCampaign({...newCampaign, code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter discount code"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Discount Type *</label>
                      <select
                        value={newCampaign.type}
                        onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {newCampaign.type === 'percentage' ? 'Percentage (%) *' : 'Amount ($) *'}
                      </label>
                      <input
                        type="number"
                        value={newCampaign.value}
                        onChange={(e) => setNewCampaign({...newCampaign, value: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder={newCampaign.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Start Date *</label>
                        <input
                          type="date"
                          value={newCampaign.startDate}
                          onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">End Date *</label>
                        <input
                          type="date"
                          value={newCampaign.endDate}
                          onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateCampaign}
                      disabled={isLoading}
                      className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : 'Create Campaign'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Campaign Modal */}
          {showDeleteModal && selectedCampaign && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-black text-center mb-2">Delete Campaign</h2>
                  <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete "{selectedCampaign.name}"? This action cannot be undone.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Campaign:</span>
                        <span className="font-medium text-black truncate ml-2">{selectedCampaign.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Code:</span>
                        <span className="font-mono font-medium text-black break-all ml-2">{selectedCampaign.code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedCampaign(null);
                      }}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteCampaign}
                      disabled={isLoading}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : 'Delete Campaign'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Chatbot */}
      <ChatBot 
        isVisible={showChatBot} 
        onClose={() => setShowChatBot(false)}
        dashboardData={{
          todayStats: {
            transactions: 42,
            revenue: 2850.75,
            averageOrderValue: 67.88
          },
          inventory: {
            lowStockCount: 8,
            lowStockProducts: [
              { name: "Premium Headphones" },
              { name: "Wireless Charger" }
            ]
          },
          customers: {
            totalCustomers: 1245
          }
        }}
      />

      {/* Chatbot toggle button */}
      <button 
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>

    </div>
  );
};

export default DiscountPromotionsSystem;