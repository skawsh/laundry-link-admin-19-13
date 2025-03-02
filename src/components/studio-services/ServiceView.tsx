
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
  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => onToggleService(service.id)}
      >
        <div className="flex items-center">
          {service.isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
          )}
          <h3 className="font-medium text-gray-800">{service.name}</h3>
          <Badge variant="outline" className="ml-3 bg-gray-100">
            {service.subservices.length} subservices
          </Badge>
        </div>
      </div>
      
      {service.isExpanded && (
        <div className="px-4 py-2 bg-white">
          {service.subservices.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm italic">
              No subservices found
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceView;
