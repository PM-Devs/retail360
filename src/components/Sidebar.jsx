import { X, BarChart3, Package, ShoppingBag, Users, CreditCard, Bell, Settings, Store, FolderOpen, TrendingUp, Archive, Edit, Truck, FileText, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Store, label: 'Shop Management', path: '/shop' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: FolderOpen, label: 'Category', path: '/category' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingBag, label: 'Sales', path: '/sales' },
    { icon: TrendingUp, label: 'Stock Movement', path: '/stocksMove' },
    { icon: Edit, label: 'Stock Adjustment', path: '/editStocks' },
    { icon: Truck, label: 'Supplier', path: '/Supplier' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Tag, label: 'Promotions', path: '/promo' },
  
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-black transform transition-transform duration-300 ease-in-out ${isOpen ? 'lg:w-64' : 'lg:w-20'}`}>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <Link to="/" className="flex items-center">
              <img src="/src/assets/vite.svg" alt="Logo" className="w-10 h-10 bg-white rounded-lg p-1" />
              <span className={`ml-2 text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Retail360</span>
            </Link>
            <button onClick={onClose} className={`p-2 hover:bg-gray-800 rounded-lg transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <X size={20} className="text-white" />
            </button>
          </div>
          <nav className="flex-1 mt-8 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  location.pathname === item.path ? 'bg-gray-800 text-white border-r-4 border-white' : ''
                }`}
              >
                <item.icon size={20} />
                <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        />

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-black transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <Link to="/" className="flex items-center">
              <img src="/src/assets/vite.svg" alt="Logo" className="w-10 h-10 bg-white rounded-lg p-1" />
              <span className="ml-2 text-xl font-bold text-white">Retail360</span>
            </Link>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
              <X size={20} className="text-white" />
            </button>
          </div>
          <nav className="mt-8 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  location.pathname === item.path ? 'bg-gray-800 text-white border-r-4 border-white' : ''
                }`}
              >
                <item.icon size={20} />
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;