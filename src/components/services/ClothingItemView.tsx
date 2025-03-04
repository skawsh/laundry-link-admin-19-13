
import React from 'react';
import { ClothingItem } from '@/types/serviceTypes';
import { Shirt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ClothingItemViewProps {
  item: ClothingItem;
}

const ClothingItemView: React.FC<ClothingItemViewProps> = ({ item }) => {
  return (
    <Card className="mb-2 shadow-sm border border-gray-100">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Shirt className="h-5 w-5 text-gray-400 mr-3" />
          <span className="text-gray-700 font-medium">{item.name}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-700">
            Standard: <span className="font-semibold">₹{item.standardPrice}</span>
          </div>
          <div className="text-amber-500 flex items-center">
            Express: <span className="flex items-center ml-1">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold ml-1">₹{item.expressPrice}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClothingItemView;
