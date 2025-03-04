
import React from 'react';
import { ClothingItem } from '@/types/serviceTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceModal } from './ServiceModals';

interface ClothingItemEditProps {
  item?: ClothingItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ClothingItem>) => void;
}

const ClothingItemEdit: React.FC<ClothingItemEditProps> = ({
  item,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Partial<ClothingItem>>({
    name: item?.name || '',
    standardPrice: item?.standardPrice || 0,
    expressPrice: item?.expressPrice || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'standardPrice' || name === 'expressPrice') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <ServiceModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={item ? 'Edit Clothing Item' : 'Add New Clothing Item'}
      description="Configure clothing item details"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Shirt"
          />
        </div>
        
        <div>
          <Label htmlFor="standardPrice">Standard Price (₹)</Label>
          <Input
            id="standardPrice"
            name="standardPrice"
            type="number"
            value={formData.standardPrice}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="expressPrice">Express Price (₹)</Label>
          <Input
            id="expressPrice"
            name="expressPrice"
            type="number"
            value={formData.expressPrice}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>
    </ServiceModal>
  );
};

export default ClothingItemEdit;
