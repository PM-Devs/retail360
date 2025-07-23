import React, { useState } from 'react';
import { Plus, Eye, Edit3, Trash2, Check, X, Gift, Percent, Users, Code, Calendar, DollarSign, TrendingUp, Filter, Search, ChevronDown, Bot } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';

const DiscountPromotionsSystem = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const [campaigns, setCampaigns] = useState([
    {
      id: 'camp_001',
      name: 'New Year Sale',
      code: 'NEWYEAR2024',
      type: 'percentage',
      value: 15,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      minimumPurchase: 50.00,
      usageLimit: 100,
      usedCount: 25,
      status: 'active'
    },
    {
      id: 'camp_002',
      name: 'Customer Loyalty Points',
      code: 'LOYALTY500',
      type: 'fixed',
      value: 500,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      minimumPurchase: 0,
      usageLimit: 50,
      usedCount: 12,
      status: 'active'
    }
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'req_001',
      userId: 'user_123',
      userName: 'John Doe',
      email: 'john@example.com',
      campaignId: 'camp_002',
      campaignName: 'Customer Loyalty Points',
      pointsRequested: 500,
      reason: 'Completed 5 purchases this month',
      requestDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: 'req_002',
      userId: 'user_456',
      userName: 'Jane Smith',
      email: 'jane@example.com',
      campaignId: 'camp_002',
      campaignName: 'Customer Loyalty Points',
      pointsRequested: 300,
      reason: 'Referral program participation',
      requestDate: '2024-01-21',
      status: 'pending'
    }
  ]);

  const [generatedCodes, setGeneratedCodes] = useState([
    { code: 'SAVE20NOW', campaignId: 'camp_001', generated: '2024-01-22', used: false },
    { code: 'DEAL30OFF', campaignId: 'camp_001', generated: '2024-01-21', used: true },
    { code: 'BONUS15', campaignId: 'camp_002', generated: '2024-01-20', used: false }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    minimumPurchase: '',
    usageLimit: ''
  });

  const [editCampaign, setEditCampaign] = useState({
    id: '',
    name: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    minimumPurchase: '',
    usageLimit: ''
  });

  const handleCreateCampaign = () => {
    const campaignData = {
      id: `camp_${Date.now()}`,
      ...newCampaign,
      code: generatePromoCode(),
      usedCount: 0,
      status: 'active'
    };
    setCampaigns([...campaigns, campaignData]);
    setNewCampaign({
      name: '',
      type: 'percentage',
      value: '',
      startDate: '',
      endDate: '',
      minimumPurchase: '',
      usageLimit: ''
    });
    setShowCreateModal(false);
  };

  const handleEditCampaign = () => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === editCampaign.id 
          ? { ...campaign, ...editCampaign }
          : campaign
      )
    );
    setShowEditModal(false);
    setSelectedCampaign(null);
  };

  const handleDeleteCampaign = () => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== selectedCampaign.id));
    setShowDeleteModal(false);
    setSelectedCampaign(null);
  };

  const openEditModal = (campaign) => {
    setSelectedCampaign(campaign);
    setEditCampaign({
      id: campaign.id,
      name: campaign.name,
      type: campaign.type,
      value: campaign.value,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      minimumPurchase: campaign.minimumPurchase,
      usageLimit: campaign.usageLimit
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleApproveRequest = (requestId, approved) => {
    setPendingApprovals(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: approved ? 'approved' : 'rejected' }
          : req
      )
    );
  };

  const generateNewCode = (campaignId) => {
    const newCode = generatePromoCode();
    setGeneratedCodes(prev => [
      ...prev,
      {
        code: newCode,
        campaignId,
        generated: new Date().toISOString().split('T')[0],
        used: false
      }
    ]);
  };

  const validateCode = (code) => {
    return generatedCodes.find(c => c.code === code && !c.used);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const CampaignCard = ({ campaign }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-black mb-1">{campaign.name}</h3>
          <p className="text-sm text-gray-600">Code: {campaign.code}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          campaign.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Percent className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {campaign.type === 'percentage' ? `${campaign.value}%` : `$${campaign.value}`} off
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {campaign.usedCount}/{campaign.usageLimit} used
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {campaign.startDate} - {campaign.endDate}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Min: ${campaign.minimumPurchase}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
          <div 
            className="bg-black h-2 rounded-full" 
            style={{ width: `${(campaign.usedCount / campaign.usageLimit) * 100}%` }}
          ></div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => generateNewCode(campaign.id)}
            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
            title="Generate New Code"
          >
            <Code className="h-4 w-4" />
          </button>
          <button 
            onClick={() => openEditModal(campaign)}
            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
            title="Edit Campaign"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => openDeleteModal(campaign)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Campaign"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ApprovalCard = ({ request }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-black mb-1">{request.userName}</h3>
          <p className="text-sm text-gray-600">{request.email}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Campaign:</span>
          <span className="text-sm font-medium text-black">{request.campaignName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Points Requested:</span>
          <span className="text-sm font-medium text-black">{request.pointsRequested}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Request Date:</span>
          <span className="text-sm font-medium text-black">{request.requestDate}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Reason:</span> {request.reason}
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => handleApproveRequest(request.id, true)}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Check className="h-4 w-4" />
          <span>Approve</span>
        </button>
        <button
          onClick={() => handleApproveRequest(request.id, false)}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - Fixed positioning with proper z-index */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area - Adjusted for sidebar */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar - Fixed at top with proper z-index */}
        <div className="fixed top-0 right-0 z-30 transition-all duration-300" style={{ left: sidebarOpen ? '256px' : '80px' }}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={ 'Promotion and Discount'}
          />
        </div>
        
       

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-11">
          {/* Header */}
          <div className="bg-black text-white p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Discounts & Promotions</h1>
                  <p className="text-gray-300">Manage campaigns, approve requests, and generate promo codes</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{campaigns.length}</p>
                    <p className="text-sm text-gray-300">Active Campaigns</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{pendingApprovals.filter(req => req.status === 'pending').length}</p>
                    <p className="text-sm text-gray-300">Pending Approvals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'campaigns'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Campaigns
                </button>
                <button
                  onClick={() => setActiveTab('approvals')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                    activeTab === 'approvals'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Approvals
                  {pendingApprovals.filter(req => req.status === 'pending').length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingApprovals.filter(req => req.status === 'pending').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('codes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'codes'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Generated Codes
                </button>
              </nav>
            </div>
          </div>

          <div className="max-w-6xl mx-auto p-6">
            {activeTab === 'campaigns' && (
              <div>
                {/* Controls */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Campaign</span>
                  </button>
                </div>

                {/* Campaigns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-black mb-2">Pending Point Requests</h2>
                  <p className="text-gray-600">Review and approve customer point redemption requests</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingApprovals
                    .filter(req => req.status === 'pending')
                    .map(request => (
                      <ApprovalCard key={request.id} request={request} />
                    ))}
                </div>

                {pendingApprovals.filter(req => req.status === 'pending').length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Approvals</h3>
                    <p className="text-gray-500">All point requests have been processed.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'codes' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-black mb-2">Generated Promo Codes</h2>
                  <p className="text-gray-600">View and manage all generated promotional codes</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {generatedCodes.map((code, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-semibold text-black">{code.code}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {campaigns.find(c => c.id === code.campaignId)?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {code.generated}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              code.used 
                                ? 'bg-gray-100 text-gray-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {code.used ? 'Used' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-black hover:text-gray-700">Copy</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Create Campaign Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Create New Campaign</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Campaign Name</label>
                      <input
                        type="text"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter campaign name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Discount Type</label>
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
                        {newCampaign.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                      </label>
                      <input
                        type="number"
                        value={newCampaign.value}
                        onChange={(e) => setNewCampaign({...newCampaign, value: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder={newCampaign.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Start Date</label>
                        <input
                          type="date"
                          value={newCampaign.startDate}
                          onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">End Date</label>
                        <input
                          type="date"
                          value={newCampaign.endDate}
                          onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Minimum Purchase ($)</label>
                      <input
                        type="number"
                        value={newCampaign.minimumPurchase}
                        onChange={(e) => setNewCampaign({...newCampaign, minimumPurchase: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter minimum purchase amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Usage Limit</label>
                      <input
                        type="number"
                        value={newCampaign.usageLimit}
                        onChange={(e) => setNewCampaign({...newCampaign, usageLimit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter usage limit"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateCampaign}
                      className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Create Campaign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Campaign Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Edit Campaign</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Campaign Name</label>
                      <input
                        type="text"
                        value={editCampaign.name}
                        onChange={(e) => setEditCampaign({...editCampaign, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter campaign name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Discount Type</label>
                      <select
                        value={editCampaign.type}
                        onChange={(e) => setEditCampaign({...editCampaign, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        {editCampaign.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                      </label>
                      <input
                        type="number"
                        value={editCampaign.value}
                        onChange={(e) => setEditCampaign({...editCampaign, value: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder={editCampaign.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Start Date</label>
                        <input
                          type="date"
                          value={editCampaign.startDate}
                          onChange={(e) => setEditCampaign({...editCampaign, startDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">End Date</label>
                        <input
                          type="date"
                          value={editCampaign.endDate}
                          onChange={(e) => setEditCampaign({...editCampaign, endDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Minimum Purchase ($)</label>
                      <input
                        type="number"
                        value={editCampaign.minimumPurchase}
                        onChange={(e) => setEditCampaign({...editCampaign, minimumPurchase: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter minimum purchase amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Usage Limit</label>
                      <input
                        type="number"
                        value={editCampaign.usageLimit}
                        onChange={(e) => setEditCampaign({...editCampaign, usageLimit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        placeholder="Enter usage limit"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedCampaign(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditCampaign}
                      className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Campaign Modal */}
          {showDeleteModal && selectedCampaign && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
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
                        <span className="font-medium text-black">{selectedCampaign.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Code:</span>
                        <span className="font-mono font-medium text-black">{selectedCampaign.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium text-black">{selectedCampaign.usedCount}/{selectedCampaign.usageLimit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedCampaign(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteCampaign}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Campaign
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
        onClick={() =>  setShowChatBot(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Bot className="text-white w-6 h-6" />
      </button>

    </div>
  );
};

export default DiscountPromotionsSystem;