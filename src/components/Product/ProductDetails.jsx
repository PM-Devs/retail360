import { useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  QrCode,
  X,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle
} from 'lucide-react';

const ProductDetails = ({ product, onClose, onEdit, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!product) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const handleDelete = async () => {
    try {
      await onDelete(product.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Product Info Card */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(product)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={() => setShowConfirmDelete(true)}
                className="p-2 text-gray-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">SKU</p>
              <p className="font-medium">{product.sku}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Barcode</p>
              <p className="font-medium">{product.barcode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{product.category.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">QR Code</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <QrCode size={20} />
            </button>
          </div>
          {product.qrCode && (
            <div className="flex justify-center">
              <img 
                src={product.qrCode} 
                alt="Product QR Code"
                className="w-32 h-32"
              />
            </div>
          )}
        </div>

        {/* Stock & Pricing Card */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-4">Stock & Pricing</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Current Stock</p>
              <div className="flex items-center gap-2">
                <span className="font-medium">{product.stock.currentQuantity}</span>
                {product.stock.currentQuantity <= product.stock.minQuantity && (
                  <AlertTriangle size={16} className="text-orange-500" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Minimum Stock</p>
              <p className="font-medium">{product.stock.minQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cost Price</p>
              <p className="font-medium">{formatCurrency(product.pricing.costPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Selling Price</p>
              <p className="font-medium">{formatCurrency(product.pricing.sellingPrice)}</p>
            </div>
          </div>
        </div>

        {/* Stock Movement Card */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-4">Recent Stock Movements</h3>
          <div className="space-y-3">
            {/* Example movements - replace with actual data */}
            <div className="flex items-center gap-3">
              <ArrowUpCircle size={20} className="text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Stock Added</p>
                <p className="text-xs text-gray-500">+10 units on July 20, 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ArrowDownCircle size={20} className="text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sale</p>
                <p className="text-xs text-gray-500">-2 units on July 19, 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-2">Delete Product?</h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete {product.name}? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
