
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Service } from './types';
import SubserviceView from './SubserviceView';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ServiceViewProps {
  service: Service;
  onToggleService: (serviceId: string) => void;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
  serviceIndex?: number;
}

const ServiceView: React.FC<ServiceViewProps> = ({ 
  service, 
  onToggleService,
  onToggleSubservice,
  serviceIndex = 1
}) => {
  // Calculate the actual number of subservices
  const subservicesCount = service.subservices ? service.subservices.length : 0;
  
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onToggleService(service.id);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden mb-4 shadow-sm">
      <Collapsible
        open={service.isExpanded}
        onOpenChange={() => onToggleService(service.id)}
      >
        <CollapsibleTrigger asChild>
          <div 
            className="flex items-center justify-between px-6 py-4 cursor-pointer"
            onClick={handleToggleClick}
            aria-expanded={service.isExpanded}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-3">
              {service.isExpanded ? (
                <ChevronDown className="h-6 w-6 text-gray-700" />
              ) : (
                <ChevronRight className="h-6 w-6 text-gray-700" />
              )}
              <h3 className="text-lg font-medium text-gray-800">
                {service.name}
                <span className="sr-only">{serviceIndex}</span>
              </h3>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1">
              {subservicesCount} {subservicesCount === 1 ? 'subservice' : 'subservices'}
            </Badge>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          {service.subservices && service.subservices.length > 0 && (
            <div className="px-4 py-2">
              <div className="space-y-0">
                {service.subservices.map((subservice, index) => (
                  <SubserviceView 
                    key={subservice.id} 
                    subservice={subservice} 
                    serviceId={service.id}
                    onToggleSubservice={onToggleSubservice}
                    serviceIndex={serviceIndex}
                    subserviceIndex={index + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ServiceView;
