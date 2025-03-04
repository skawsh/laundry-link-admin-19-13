
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Subservice } from './types';
import ClothingItemView from './ClothingItemView';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubserviceViewProps {
  subservice: Subservice;
  serviceId: string;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
  serviceIndex?: number;
  subserviceIndex?: number;
}

const SubserviceView: React.FC<SubserviceViewProps> = ({ 
  subservice, 
  serviceId, 
  onToggleSubservice,
  serviceIndex = 1,
  subserviceIndex = 1
}) => {
  // Calculate the actual number of items
  const itemsCount = subservice.items ? subservice.items.length : 0;
  
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onToggleSubservice(serviceId, subservice.id);
  };
  
  return (
    <div className="border-l-2 border-gray-200 ml-6">
      <Collapsible
        open={subservice.isExpanded}
        onOpenChange={() => onToggleSubservice(serviceId, subservice.id)}
      >
        <CollapsibleTrigger asChild>
          <div 
            className="flex items-center justify-between py-3 pl-6 pr-4 cursor-pointer"
            onClick={handleToggleClick}
            aria-expanded={subservice.isExpanded}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3">
              {subservice.isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
              <h4 className="font-medium text-gray-700">
                {subservice.name}
                <span className="sr-only">{serviceIndex}.{subserviceIndex}</span>
              </h4>
              {subservice.pricePerUnit && (
                <span className="text-gray-500 ml-1">
                  (₹{subservice.pricePerUnit} {subservice.unit})
                </span>
              )}
            </div>
            <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          {subservice.items && subservice.items.length > 0 && (
            <div className="ml-12 my-3 space-y-3">
              {subservice.items.map((item, index) => (
                <ClothingItemView 
                  key={item.id} 
                  item={item} 
                  serviceIndex={serviceIndex}
                  subserviceIndex={subserviceIndex}
                  itemIndex={index + 1}
                />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SubserviceView;
