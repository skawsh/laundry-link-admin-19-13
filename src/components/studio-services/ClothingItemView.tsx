
import React from 'react';
import { Shirt, Zap } from 'lucide-react';
import { ClothingItem } from './types';

interface ClothingItemViewProps {
  item: ClothingItem;
}

const ClothingItemView: React.FC<ClothingItemViewProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-100">
      <div className="flex items-center">
        <Shirt className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-700">{item.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-1">Standard:</span>
            <span className="font-medium text-gray-800">₹{item.price.toFixed(2)}</span>
          </div>
          {item.expressPrice && (
            <div className="flex items-center">
              <span className="text-xs text-amber-600 mr-1">Express:</span>
              <div className="flex items-center text-amber-600">
                <Zap className="h-3 w-3 mr-1" />
                <span>₹{item.expressPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothingItemView;
