
import React from 'react';
import { ClothingItem } from './types';

interface ClothingItemViewProps {
  item: ClothingItem;
}

const ClothingItemView: React.FC<ClothingItemViewProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-md p-2 shadow-sm">
      <div className="font-medium text-gray-700">{item.name}</div>
      <div className="flex flex-col text-right">
        <div className="text-gray-800">
          <span className="text-xs text-gray-500 mr-1">Standard:</span>
          <span className="font-semibold">₹{item.price}</span>
        </div>
        {item.expressPrice && (
          <div className="text-amber-600">
            <span className="text-xs text-amber-500 mr-1">Express:</span>
            <span className="font-semibold">₹{item.expressPrice}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingItemView;
