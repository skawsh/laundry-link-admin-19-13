
import React, { useState } from 'react';
import { Subservice } from '@/types/serviceTypes';
import { ChevronDown, ChevronRight } from 'lucide-react';
import ClothingItemView from './ClothingItemView';
import { Badge } from '@/components/ui/badge';

interface SubserviceViewProps {
  subservice: Subservice;
}

const SubserviceView: React.FC<SubserviceViewProps> = ({ subservice }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="ml-6 mb-4">
      <div 
        className="flex items-center cursor-pointer py-2" 
        onClick={toggleExpanded}
      >
        <div className="mr-2">
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <span className="font-medium text-gray-700">
            {subservice.name}
            {subservice.basePrice && (
              <span className="text-gray-500 ml-2">
                (₹{subservice.basePrice} {subservice.priceUnit})
              </span>
            )}
          </span>
        </div>
        <Badge variant="outline" className="bg-gray-100 text-gray-700 ml-2">
          {subservice.items.length} {subservice.items.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>
      
      {expanded && (
        <div className="ml-6 mt-2">
          {subservice.items.map(item => (
            <ClothingItemView key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubserviceView;
