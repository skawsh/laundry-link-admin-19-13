
import React, { useMemo } from 'react';
import { Service, Subservice, ClothingItem } from '@/types/serviceTypes';
import ServiceView from './ServiceView';

interface ServiceListProps {
  services: Service[];
  searchTerm: string;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, searchTerm }) => {
  // Filter services based on search term
  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) {
      return services;
    }

    const term = searchTerm.toLowerCase();

    return services.map(service => {
      // Check if service name matches
      const serviceMatches = service.name.toLowerCase().includes(term);
      
      // Filter subservices
      const matchedSubservices = service.subservices
        .map(subservice => {
          // Check if subservice name matches
          const subserviceMatches = subservice.name.toLowerCase().includes(term);
          
          // Filter items
          const matchedItems = subservice.items.filter(item => 
            item.name.toLowerCase().includes(term)
          );
          
          // Return subservice with filtered items
          if (subserviceMatches || matchedItems.length > 0) {
            return {
              ...subservice,
              items: matchedItems.length > 0 ? matchedItems : subservice.items
            };
          }
          return null;
        })
        .filter(Boolean) as Subservice[];
      
      // If service name matches or has matched subservices, return service
      if (serviceMatches || matchedSubservices.length > 0) {
        return {
          ...service,
          subservices: matchedSubservices
        };
      }
      return null;
    }).filter(Boolean) as Service[];
  }, [services, searchTerm]);

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No services found matching "{searchTerm}"
      </div>
    );
  }

  return (
    <div>
      {filteredServices.map(service => (
        <ServiceView key={service.id} service={service} />
      ))}
    </div>
  );
};

export default ServiceList;
