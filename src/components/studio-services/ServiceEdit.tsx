
import React from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from './types';
import SubserviceEdit from './SubserviceEdit';

interface ServiceEditProps {
  service: Service;
  onToggleService: (serviceId: string) => void;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
  onToggleItemEdit: (serviceId: string, subserviceId: string, itemId: string) => void;
  onUpdateItemName: (serviceId: string, subserviceId: string, itemId: string, newName: string) => void;
  onUpdateItemPrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  onUpdateItemExpressPrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  onSaveItemEdit: (serviceId: string, subserviceId: string, itemId: string) => void;
  onDeleteClick: (type: 'service' | 'subservice' | 'item', id: string, name: string, parentId?: string, subParentId?: string) => void;
  onAddSubservice: (serviceId: string) => void;
  onAddItem: (serviceId: string, subserviceId: string) => void;
  serviceIndex?: number; // Add the serviceIndex prop
}

const ServiceEdit: React.FC<ServiceEditProps> = ({ 
  service, 
  onToggleService,
  onToggleSubservice,
  onToggleItemEdit,
  onUpdateItemName,
  onUpdateItemPrice,
  onUpdateItemExpressPrice,
  onSaveItemEdit,
  onDeleteClick,
  onAddSubservice,
  onAddItem,
  serviceIndex = 1 // Default to 1 if not provided
}) => {
  const handleToggleClick = (e: React.MouseEvent) => {
    // Call the toggle service function when the header is clicked
    onToggleService(service.id);
  };

  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <div 
          className="flex items-center cursor-pointer"
          onClick={handleToggleClick}
        >
          {service.isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
          )}
          <h3 className="font-medium text-gray-800">
            {service.name}
            <span className="sr-only">{serviceIndex}</span>
          </h3>
          <Badge variant="outline" className="ml-3 bg-gray-100">
            {service.subservices.length} subservices
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="edit" 
            size="xs"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up
              // Service edit logic here (future enhancement)
            }}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            <span>Edit</span>
          </Button>
          <Button
            variant="delete"
            size="xs"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up
              onDeleteClick('service', service.id, service.name);
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span>Delete</span>
          </Button>
          <Button
            variant="subservice"
            size="xs"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up
              onAddSubservice(service.id);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Subservice</span>
          </Button>
        </div>
      </div>
      
      {service.isExpanded && (
        <div className="px-4 py-2 bg-white animate-accordion-down">
          {service.subservices.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm italic">
              No subservices found
            </div>
          ) : (
            <div className="space-y-3 pl-6">
              {service.subservices.map((subservice, index) => (
                <SubserviceEdit 
                  key={subservice.id} 
                  subservice={subservice} 
                  serviceId={service.id}
                  onToggleSubservice={onToggleSubservice}
                  onToggleItemEdit={onToggleItemEdit}
                  onUpdateItemName={onUpdateItemName}
                  onUpdateItemPrice={onUpdateItemPrice}
                  onUpdateItemExpressPrice={onUpdateItemExpressPrice}
                  onSaveItemEdit={onSaveItemEdit}
                  onDeleteClick={onDeleteClick}
                  onAddItem={onAddItem}
                  serviceIndex={serviceIndex}
                  subserviceIndex={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceEdit;
