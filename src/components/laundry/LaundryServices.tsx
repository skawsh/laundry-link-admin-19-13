
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Sample data structure for our laundry services
const laundryServicesData = [
  {
    "name": "Core Laundry Services",
    "subservicesCount": 3,
    "subservices": [
      { "name": "Wash & Fold", "price": "₹59 per Kg", "itemsCount": 5 },
      { "name": "Wash & Iron", "price": "₹79 per Kg", "itemsCount": 3 },
      { "name": "Steam Press", "price": "₹39 per Item", "itemsCount": 3 }
    ]
  },
  {
    "name": "Dry Cleaning",
    "subservicesCount": 3,
    "subservices": [
      { "name": "Suits", "price": "₹99 per Item", "itemsCount": 2 },
      { "name": "Coats", "price": "₹89 per Item", "itemsCount": 4 },
      { "name": "Dresses", "price": "₹129 per Item", "itemsCount": 2 }
    ]
  },
  {
    "name": "Shoe Laundry",
    "subservicesCount": 2,
    "subservices": [
      { "name": "Sneaker Cleaning", "price": "₹199 per Pair", "itemsCount": 2 },
      { "name": "Leather Shoe Care", "price": "₹249 per Pair", "itemsCount": 1 }
    ]
  }
];

interface SubserviceProps {
  name: string;
  price: string;
  itemsCount: number;
}

const SubserviceItem: React.FC<SubserviceProps> = ({ name, price, itemsCount }) => {
  return (
    <div className="ml-6 py-2 px-3 border-l-2 border-gray-200">
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-700">{name}</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{price}</span>
          <Badge variant="outline" className="bg-gray-50 text-xs">
            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

const LaundryServices: React.FC = () => {
  // State to track which services are expanded
  const [expandedServices, setExpandedServices] = useState<string[]>([]);

  // Toggle expanded state for a service
  const toggleService = (serviceName: string) => {
    setExpandedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(name => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  // Check if a service is expanded
  const isServiceExpanded = (serviceName: string) => {
    return expandedServices.includes(serviceName);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-6">Laundry Services</h2>
      
      {laundryServicesData.map((service) => (
        <Collapsible
          key={service.name}
          open={isServiceExpanded(service.name)}
          onOpenChange={() => toggleService(service.name)}
          className="border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              {isServiceExpanded(service.name) ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
              <span className="font-semibold text-gray-800">{service.name}</span>
            </div>
            <Badge variant="outline" className="bg-gray-50">
              {service.subservicesCount} {service.subservicesCount === 1 ? 'subservice' : 'subservices'}
            </Badge>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="bg-gray-50 animate-accordion-down">
            <div className="divide-y divide-gray-100">
              {service.subservices.map((subservice) => (
                <SubserviceItem
                  key={subservice.name}
                  name={subservice.name}
                  price={subservice.price}
                  itemsCount={subservice.itemsCount}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default LaundryServices;
