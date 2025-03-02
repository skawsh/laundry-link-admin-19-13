
import React from 'react';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Subservice } from './types';
import ClothingItemView from './ClothingItemView';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

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
    e.stopPropagation(); // Prevent event bubbling
    onToggleSubservice(serviceId, subservice.id);
  };
  
  return (
    <div className="border-l-2 border-gray-200 pl-4 ml-4">
      <Collapsible
        open={subservice.isExpanded}
        onOpenChange={() => onToggleSubservice(serviceId, subservice.id)}
      >
        <CollapsibleTrigger asChild>
          <div 
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
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
              
              <Button 
                variant="ghost" 
                size="xs" 
                className="ml-1 flex gap-1" 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSubservice(serviceId, subservice.id);
                }}
              >
                <Eye className="h-3 w-3" />
                <span className="text-xs">{subservice.isExpanded ? 'Hide' : 'View'} Items</span>
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          {subservice.items && subservice.items.length > 0 && (
            <div className="ml-6 my-2 space-y-2.5">
              {subservice.items.map(item => (
                <ClothingItemView key={item.id} item={item} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SubserviceView;
