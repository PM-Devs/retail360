import { X } from 'lucide-react';

const WelcomeModal = ({ isVisible, onClose, dashboardData }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Welcome to Retail360! 👋</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              Here's a quick summary of your store's current status:
            </p>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Today's Revenue: {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'GHS'
                  }).format(dashboardData?.todayStats?.revenue || 0)}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Transactions Today: {dashboardData?.todayStats?.transactions || 0}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-800">
                  Total Customers: {dashboardData?.customers?.totalCustomers || 0}
                </p>
              </div>

              {dashboardData?.inventory?.lowStockCount > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-800">
                    Alert: {dashboardData.inventory.lowStockCount} items are running low on stock
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mt-4">
              Need help? Click the chat button in the bottom right corner to talk to our AI assistant!
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
