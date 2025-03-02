
import React from 'react';
import { Shirt, Edit, Trash2, Check, X, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClothingItem } from './types';

interface ClothingItemEditProps {
  item: ClothingItem;
  serviceId: string;
  subserviceId: string;
  onToggleEdit: (serviceId: string, subserviceId: string, itemId: string) => void;
  onUpdateName: (serviceId: string, subserviceId: string, itemId: string, newName: string) => void;
  onUpdatePrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  onUpdateExpressPrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  onSaveEdit: (serviceId: string, subserviceId: string, itemId: string) => void;
  onDeleteClick: (type: 'service' | 'subservice' | 'item', id: string, name: string, parentId?: string, subParentId?: string) => void;
  serviceIndex?: number;
  subserviceIndex?: number;
  itemIndex?: number;
}

const ClothingItemEdit: React.FC<ClothingItemEditProps> = ({
  item,
  serviceId,
  subserviceId,
  onToggleEdit,
  onUpdateName,
  onUpdatePrice,
  onUpdateExpressPrice,
  onSaveEdit,
  onDeleteClick,
  serviceIndex = 1,
  subserviceIndex = 1,
  itemIndex = 1
}) => {
  if (item.isEditing) {
    return (
      <div className="flex-1 flex flex-col sm:flex-row gap-2 py-1.5 px-2">
        <div className="flex-1">
          <Input
            value={item.name}
            onChange={(e) => onUpdateName(serviceId, subserviceId, item.id, e.target.value)}
            placeholder="Item name"
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Standard Price</label>
            <Input
              value={item.price.toString()}
              onChange={(e) => onUpdatePrice(serviceId, subserviceId, item.id, e.target.value)}
              placeholder="Standard price"
              prefix="₹"
              className="w-28"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-amber-500 mb-1">Express Price</label>
            <Input
              value={item.expressPrice?.toString() || ''}
              onChange={(e) => onUpdateExpressPrice(serviceId, subserviceId, item.id, e.target.value)}
              placeholder="Express price"
              prefix="₹"
              className="w-28"
            />
          </div>
          <div className="flex items-end gap-1">
            <Button
              variant="success"
              size="xs"
              onClick={() => onSaveEdit(serviceId, subserviceId, item.id)}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="delete"
              size="xs"
              onClick={() => onToggleEdit(serviceId, subserviceId, item.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-100">
      <div className="flex items-center">
        <Shirt className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-700">
          {item.name}
          <span className="sr-only">{serviceIndex}.{subserviceIndex}.{itemIndex}</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-1">Standard:</span>
            <span className="font-medium text-gray-800">₹{item.price.toFixed(2)}</span>
          </div>
          {item.expressPrice && (
            <div className="flex items-center">
              <span className="text-xs text-amber-600 mr-1">Express:</span>
              <div className="flex items-center text-amber-600">
                <Zap className="h-3 w-3 mr-1" />
                <span>₹{item.expressPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Button
            variant="edit"
            size="icon"
            className="h-7 w-7"
            onClick={() => onToggleEdit(serviceId, subserviceId, item.id)}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="delete"
            size="icon"
            className="h-7 w-7 ml-1"
            onClick={() => onDeleteClick('item', item.id, item.name, serviceId, subserviceId)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClothingItemEdit;
