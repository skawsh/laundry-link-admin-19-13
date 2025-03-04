
import React from 'react';
import { Shirt, Zap } from 'lucide-react';
import { ClothingItem } from './types';

interface ClothingItemViewProps {
  item: ClothingItem;
  serviceIndex?: number;
  subserviceIndex?: number;
  itemIndex?: number;
}

const ClothingItemView: React.FC<ClothingItemViewProps> = ({ 
  item,
  serviceIndex = 1,
  subserviceIndex = 1,
  itemIndex = 1
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-md p-4 border border-gray-100">
      <div className="flex items-center">
        <Shirt className="h-5 w-5 text-gray-400 mr-3" />
        <div className="font-medium text-gray-700">
          {item.name}
          <span className="sr-only">{serviceIndex}.{subserviceIndex}.{itemIndex}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-gray-700 mb-1">
          <span className="text-sm text-gray-500 mr-2">Standard:</span>
          <span className="font-semibold text-lg">₹{item.price}</span>
        </div>
        {item.expressPrice && (
          <div className="flex items-center text-amber-600">
            <span className="text-sm text-amber-500 mr-2">Express:</span>
            <Zap className="h-4 w-4 mr-1" />
            <span className="font-semibold text-lg">₹{item.expressPrice}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingItemView;
