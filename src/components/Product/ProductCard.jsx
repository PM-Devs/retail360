import { AlertTriangle } from 'lucide-react';

const ProductCard = ({ product, onClick }) => {
  const formatCurrency = (amount, currency = 'GHS') => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
    >
      {/* Product Image */}
      <div className="aspect-[4/3] relative bg-gray-100">
        <img
          src={product.images[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.stock.currentQuantity <= product.stock.minQuantity && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <AlertTriangle size={12} />
            <span>Low Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{product.category.name}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900">
            {formatCurrency(product.pricing.sellingPrice)}
          </span>
          <span className={`px-2 py-1 rounded-full ${
            product.stock.currentQuantity > product.stock.minQuantity
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            Stock: {product.stock.currentQuantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
