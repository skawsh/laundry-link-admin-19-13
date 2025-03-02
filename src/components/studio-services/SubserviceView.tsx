
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
  // Calculate the actual number of items
  const itemsCount = subservice.items ? subservice.items.length : 0;
  
  const handleToggleClick = () => {
    onToggleSubservice(serviceId, subservice.id);
  };
  
  return (
    <div className={`border-l-2 pl-4 ${subservice.isExpanded ? 'border-blue-200' : 'border-gray-200'}`}>
      <div 
        className={`flex items-center justify-between py-2 cursor-pointer rounded-md ${subservice.isExpanded ? 'bg-gray-50' : ''}`}
        onClick={handleToggleClick}
        aria-expanded={subservice.isExpanded}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            {subservice.isExpanded ? (
              <ChevronDown className="h-4 w-4 text-blue-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <h4 className={`font-medium ${subservice.isExpanded ? 'text-blue-600' : 'text-gray-700'}`}>
            {subservice.name}
          </h4>
          {subservice.pricePerUnit && (
            <span className="ml-2 text-sm text-gray-500">
              (₹{subservice.pricePerUnit} {subservice.unit})
            </span>
          )}
          <Badge variant="outline" className={`ml-1 text-xs ${subservice.isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-gray-50'}`}>
            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>
      
      {subservice.isExpanded && subservice.items && subservice.items.length > 0 && (
        <div className="ml-6 my-2 bg-gray-50 rounded-md p-3 animate-accordion-down">
          <div className="space-y-3">
            {subservice.items.map(item => (
              <ClothingItemView key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubserviceView;
