
import React, { useState } from 'react';
import { Service } from '@/types/serviceTypes';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SubserviceView from './SubserviceView';
import { Badge } from '@/components/ui/badge';

interface ServiceViewProps {
  service: Service;
}

const ServiceView: React.FC<ServiceViewProps> = ({ service }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Count total subservices
  const subserviceCount = service.subservices.length;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div 
        className="flex items-center cursor-pointer" 
        onClick={toggleExpanded}
      >
        <div className="mr-2">
          {expanded ? (
            <ChevronDown className="h-6 w-6 text-gray-700" />
          ) : (
            <ChevronRight className="h-6 w-6 text-gray-700" />
          )}
        </div>
        <div className="flex-1">
          <span className="text-lg font-semibold text-gray-800">{service.name}</span>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          {subserviceCount} {subserviceCount === 1 ? 'subservice' : 'subservices'}
        </Badge>
      </div>
      
      {expanded && (
        <div className="mt-4">
          {service.subservices.map(subservice => (
            <SubserviceView key={subservice.id} subservice={subservice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceView;
