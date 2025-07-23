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

  // Mock data - In production, these would come from API calls
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

  // API Call Functions (commented for reference)
  
  // Load campaigns from API
  // const loadCampaigns = async () => {
  //   try {
  //     const response = await fetch('/api/campaigns');
  //     const data = await response.json();
  //     setCampaigns(data);
  //   } catch (error) {
  //     console.error('Error loading campaigns:', error);
  //   }
  // };

  // Load pending approvals from API
  // const loadPendingApprovals = async () => {
  //   try {
  //     const response = await fetch('/api/approvals/pending');
  //     const data = await response.json();
  //     setPendingApprovals(data);
  //   } catch (error) {
  //     console.error('Error loading pending approvals:', error);
  //   }
  // };

  // Load generated codes from API
  // const loadGeneratedCodes = async () => {
  //   try {
  //     const response = await fetch('/api/promo-codes');
  //     const data = await response.json();
  //     setGeneratedCodes(data);
  //   } catch (error) {
  //     console.error('Error loading generated codes:', error);
  //   }
  // };

  const handleCreateCampaign = async () => {
    // API Call: Create new campaign
    // try {
    //   const response = await fetch('/api/campaigns', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(newCampaign)
    //   });
    //   const createdCampaign = await response.json();
    //   setCampaigns([...campaigns, createdCampaign]);
    // } catch (error) {
    //   console.error('Error creating campaign:', error);
    // }

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

  const handleEditCampaign = async () => {
    // API Call: Update campaign
    // try {
    //   const response = await fetch(`/api/campaigns/${editCampaign.id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(editCampaign)
    //   });
    //   const updatedCampaign = await response.json();
    //   setCampaigns(prev => 
    //     prev.map(campaign => 
    //       campaign.id === editCampaign.id ? updatedCampaign : campaign
    //     )
    //   );
    // } catch (error) {
    //   console.error('Error updating campaign:', error);
    // }

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

  const handleDeleteCampaign = async () => {
    // API Call: Delete campaign
    // try {
    //   const response = await fetch(`/api/campaigns/${selectedCampaign.id}`, {
    //     method: 'DELETE'
    //   });
    //   if (response.ok) {
    //     setCampaigns(prev => prev.filter(campaign => campaign.id !== selectedCampaign.id));
    //   }
    // } catch (error) {
    //   console.error('Error deleting campaign:', error);
    // }

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

  const handleApproveRequest = async (requestId, approved) => {
    // API Call: Approve/Reject request
    // try {
    //   const response = await fetch(`/api/approvals/${requestId}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ 
    //       status: approved ? 'approved' : 'rejected' 
    //     })
    //   });
    //   const updatedRequest = await response.json();
    //   setPendingApprovals(prev => 
    //     prev.map(req => 
    //       req.id === requestId ? updatedRequest : req
    //     )
    //   );
    // } catch (error) {
    //   console.error('Error updating approval status:', error);
    // }

    setPendingApprovals(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: approved ? 'approved' : 'rejected' }
          : req
      )
    );
  };

  const generateNewCode = async (campaignId) => {
    // API Call: Generate new promo code
    // try {
    //   const response = await fetch(`/api/campaigns/${campaignId}/generate-code`, {
    //     method: 'POST'
    //   });
    //   const newCodeData = await response.json();
    //   setGeneratedCodes(prev => [...prev, newCodeData]);
    // } catch (error) {
    //   console.error('Error generating new code:', error);
    // }

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
    // API Call: Validate promo code
    // try {
    //   const response = await fetch(`/api/promo-codes/validate/${code}`);
    //   const validationResult = await response.json();
    //   return validationResult.isValid;
    // } catch (error) {
    //   console.error('Error validating code:', error);
    //   return false;
    // }

    return generatedCodes.find(c => c.code === code && !c.used);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const CampaignCard = ({ campaign }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-black mb-1 truncate">{campaign.name}</h3>
          <p className="text-sm text-gray-600 break-all sm:break-normal">Code: {campaign.code}</p>
        </div>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium self-start ${
          campaign.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.status}
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
          <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {campaign.usedCount}/{campaign.usageLimit} used
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:col-span-1">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {campaign.startDate} - {campaign.endDate}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            Min: ${campaign.minimumPurchase}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-black h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(campaign.usedCount / campaign.usageLimit) * 100}%` }}
          ></div>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
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
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-black mb-1 truncate">{request.userName}</h3>
          <p className="text-sm text-gray-600 break-all sm:break-normal">{request.email}</p>
        </div>
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 self-start">
          Pending
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
          <span className="text-sm text-gray-600">Campaign:</span>
          <span className="text-sm font-medium text-black truncate sm:text-right">{request.campaignName}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
          <span className="text-sm text-gray-600">Points Requested:</span>
          <span className="text-sm font-medium text-black">{request.pointsRequested}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
          <span className="text-sm text-gray-600">Request Date:</span>
          <span className="text-sm font-medium text-black">{request.requestDate}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Reason:</span> {request.reason}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
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
      {/* Sidebar - Responsive positioning */}
      <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area - Responsive margins */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Navbar - Responsive positioning */}
        <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
          sidebarOpen ? 'lg:left-64' : 'lg:left-20'
        } left-0`}>
          <Navbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            title={'Promotion and Discount'}
          />
        </div>

        {/* Content with responsive padding */}
        <main className="flex-1 overflow-y-auto pt-16 pb-20 lg:pb-6">
          {/* Header - Responsive design */}
          <div className="bg-black text-white p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Discounts & Promotions</h1>
                  <p className="text-gray-300 text-sm sm:text-base">Manage campaigns, approve requests, and generate promo codes</p>
                </div>
                <div className="flex justify-between lg:justify-end lg:space-x-8 space-x-4">
                  <div className="text-center lg:text-right">
                    <p className="text-xl sm:text-2xl font-bold">{campaigns.length}</p>
                    <p className="text-xs sm:text-sm text-gray-300">Active Campaigns</p>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-xl sm:text-2xl font-bold">{pendingApprovals.filter(req => req.status === 'pending').length}</p>
                    <p className="text-xs sm:text-sm text-gray-300">Pending Approvals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Responsive scroll */}
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
                <button
                  onClick={() => setActiveTab('approvals')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative whitespace-nowrap ${
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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

          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            {activeTab === 'campaigns' && (
              <div>
                {/* Controls - Responsive layout */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
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
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Campaign</span>
                  </button>
                </div>

                {/* Campaigns Grid - Responsive columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

                {/* Responsive table wrapper */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Campaign</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Generated</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generatedCodes.map((code, index) => (
                          <tr key={index}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-mono text-sm font-semibold text-black">{code.code}</span>
                                <span className="text-xs text-gray-500 sm:hidden">
                                  {campaigns.find(c => c.id === code.campaignId)?.name || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                              {campaigns.find(c => c.id === code.campaignId)?.name || 'Unknown'}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                              {code.generated}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                code.used 
                                  ? 'bg-gray-100 text-gray-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {code.used ? 'Used' : 'Active'}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-black hover:text-gray-700">Copy</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Create Campaign Modal - Responsive */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
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

          {/* Edit Campaign Modal - Responsive */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
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

          {/* Delete Campaign Modal - Responsive */}
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
                      <div className="flex justify-between">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium text-black">{selectedCampaign.usedCount}/{selectedCampaign.usageLimit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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

      {/* Chatbot - Responsive positioning */}
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

      {/* Chatbot toggle button - Responsive positioning */}
      <button 
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-30"
      >
        <Bot className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </button>

    </div>
  );
};export default DiscountPromotionsSystem;