
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Subservice } from './types';
import ClothingItemView from './ClothingItemView';

interface SubserviceViewProps {
  subservice: Subservice;
  serviceId: string;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
}

const SubserviceView: React.FC<SubserviceViewProps> = ({ 
  subservice, 
  serviceId, 
  onToggleSubservice 
}) => {
  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div 
        className="flex items-center justify-between py-2 cursor-pointer"
        onClick={() => onToggleSubservice(serviceId, subservice.id)}
      >
        <div className="flex items-center">
          {subservice.isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
          )}
          <h4 className="font-medium text-gray-700">{subservice.name}</h4>
          {subservice.pricePerUnit && (
            <span className="ml-2 text-sm text-gray-500">
              (₹{subservice.pricePerUnit} {subservice.unit})
            </span>
          )}
          <Badge variant="outline" className="ml-3 bg-gray-50">
            {subservice.items ? subservice.items.length : 0} items
          </Badge>
        </div>
      </div>
      
      {subservice.isExpanded && subservice.items && subservice.items.length > 0 && (
        <div className="ml-6 my-2 bg-gray-50 rounded-md p-3">
          {subservice.items.length === 0 ? (
            <div className="text-center py-2 text-gray-500 text-sm italic">
              No items found
            </div>
          ) : (
            <div className="space-y-2">
              {subservice.items.map(item => (
                <ClothingItemView key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubserviceView;
