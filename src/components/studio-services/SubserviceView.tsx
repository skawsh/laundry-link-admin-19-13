
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
  
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the parent
    onToggleSubservice(serviceId, subservice.id);
  };
  
  return (
    <div className="border-l-2 border-gray-200 pl-4 ml-4">
      <div 
        className="flex items-center justify-between py-2 cursor-pointer"
        onClick={handleToggleClick}
        aria-expanded={subservice.isExpanded}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <div>
            {subservice.isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <h4 className="font-medium text-gray-700">
            {subservice.name}
          </h4>
          {subservice.pricePerUnit && (
            <span className="ml-1 text-sm text-gray-500">
              (₹{subservice.pricePerUnit} {subservice.unit})
            </span>
          )}
          <Badge variant="outline" className="ml-1 text-xs bg-gray-50">
            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>
      
      {subservice.isExpanded && subservice.items && subservice.items.length > 0 && (
        <div className="ml-6 my-2 space-y-2 animate-accordion-down">
          {subservice.items.map(item => (
            <ClothingItemView key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubserviceView;
