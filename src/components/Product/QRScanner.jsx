import { useState, useRef } from 'react';
import { Camera, X, Search } from 'lucide-react';
import QrScanner from 'qr-scanner';

const QRScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState('');
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    try {
      if (!videoRef.current) return;
      
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          if (result) {
            onScan(result.data);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      await scannerRef.current.start();
    } catch (err) {
      setError('Failed to start camera. Please ensure camera permissions are granted.');
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
  };

  const handleManualSearch = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
    }
  };

  // Start scanner when component mounts
  useState(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Scan Product QR Code</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="aspect-square w-full bg-black rounded-lg overflow-hidden mb-4">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter QR code manually..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualSearch}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Search size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
