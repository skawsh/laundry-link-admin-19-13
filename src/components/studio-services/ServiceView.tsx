
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Service } from './types';
import SubserviceView from './SubserviceView';

interface ServiceViewProps {
  service: Service;
  onToggleService: (serviceId: string) => void;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
}

const ServiceView: React.FC<ServiceViewProps> = ({ 
  service, 
  onToggleService,
  onToggleSubservice
}) => {
  // Calculate the actual number of subservices
  const subservicesCount = service.subservices ? service.subservices.length : 0;
  
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onToggleService(service.id);
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${service.isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}>
      <div 
        className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors ${service.isExpanded ? 'bg-gray-100' : 'bg-gray-50'}`}
        onClick={handleToggleClick}
        aria-expanded={service.isExpanded}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <div className="p-1">
            {service.isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <h3 className={`font-medium transition-colors ${service.isExpanded ? 'text-gray-900' : 'text-gray-800'}`}>
            {service.name}
          </h3>
          <Badge variant="outline" className={`ml-1 ${service.isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'}`}>
            {subservicesCount} {subservicesCount === 1 ? 'subservice' : 'subservices'}
          </Badge>
        </div>
      </div>
      
      {service.isExpanded && service.subservices && service.subservices.length > 0 && (
        <div className="px-2 py-2 bg-white animate-accordion-down">
          <div className="space-y-2">
            {service.subservices.map(subservice => (
              <SubserviceView 
                key={subservice.id} 
                subservice={subservice} 
                serviceId={service.id}
                onToggleSubservice={onToggleSubservice}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceView;
