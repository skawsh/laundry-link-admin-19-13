
import React from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Subservice } from './types';
import ClothingItemEdit from './ClothingItemEdit';

interface SubserviceEditProps {
  subservice: Subservice;
  serviceId: string;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
  onToggleItemEdit: (serviceId: string, subserviceId: string, itemId: string) => void;
  onUpdateItemName: (serviceId: string, subserviceId: string, itemId: string, newName: string) => void;
  onUpdateItemPrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  onUpdateItemExpressPrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  onSaveItemEdit: (serviceId: string, subserviceId: string, itemId: string) => void;
  onDeleteClick: (type: 'service' | 'subservice' | 'item', id: string, name: string, parentId?: string, subParentId?: string) => void;
  onAddItem: (serviceId: string, subserviceId: string) => void;
}

const SubserviceEdit: React.FC<SubserviceEditProps> = ({ 
  subservice, 
  serviceId, 
  onToggleSubservice,
  onToggleItemEdit,
  onUpdateItemName,
  onUpdateItemPrice,
  onUpdateItemExpressPrice,
  onSaveItemEdit,
  onDeleteClick,
  onAddItem
}) => {
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the parent
    onToggleSubservice(serviceId, subservice.id);
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-center justify-between py-2">
        <div 
          className="flex items-center cursor-pointer"
          onClick={handleToggleClick}
        >
          {subservice.isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
          )}
          <h4 className="font-medium text-gray-700">{subservice.name}</h4>
          {subservice.pricePerUnit && (
            <span className="ml-2 text-sm text-gray-500">
              (₹{subservice.pricePerUnit} {subservice.unit})
            </span>
          )}
          <Badge variant="outline" className="ml-3 bg-gray-50">
            {subservice.items.length} items
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="edit" 
            size="xs"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up
              // Subservice edit logic here (future enhancement)
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
              onDeleteClick('subservice', subservice.id, subservice.name, serviceId);
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span>Delete</span>
          </Button>
          <Button
            variant="item"
            size="xs"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up
              onAddItem(serviceId, subservice.id);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>
      
      {subservice.isExpanded && (
        <div className="ml-6 my-2 bg-gray-50 rounded-md p-3 animate-accordion-down">
          {subservice.items.length === 0 ? (
            <div className="text-center py-2 text-gray-500 text-sm italic">
              No items found
            </div>
          ) : (
            <div className="space-y-2">
              {subservice.items.map(item => (
                <ClothingItemEdit 
                  key={item.id} 
                  item={item} 
                  serviceId={serviceId}
                  subserviceId={subservice.id}
                  onToggleEdit={onToggleItemEdit}
                  onUpdateName={onUpdateItemName}
                  onUpdatePrice={onUpdateItemPrice}
                  onUpdateExpressPrice={onUpdateItemExpressPrice}
                  onSaveEdit={onSaveItemEdit}
                  onDeleteClick={onDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubserviceEdit;
