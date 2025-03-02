
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
    e.stopPropagation(); // Prevent event from bubbling up
    onToggleService(service.id);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={handleToggleClick}
      >
        <div className="flex items-center">
          <div 
            className="cursor-pointer p-1 hover:bg-gray-200 rounded-full transition-colors"
            onClick={handleToggleClick}
          >
            {service.isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <h3 className="font-medium text-gray-800 ml-1">{service.name}</h3>
          <Badge variant="outline" className="ml-3 bg-gray-100">
            {subservicesCount} subservices
          </Badge>
        </div>
      </div>
      
      {service.isExpanded && service.subservices && service.subservices.length > 0 && (
        <div className="px-4 py-2 bg-white">
          <div className="space-y-3 pl-6">
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
