
import React from 'react';
import { Subservice } from '@/types/serviceTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceModal } from './ServiceModals';

interface SubserviceEditProps {
  subservice?: Subservice;
  isOpen: boolean;
  onClose: () => void;
  onSave: (subservice: Partial<Subservice>) => void;
}

const SubserviceEdit: React.FC<SubserviceEditProps> = ({
  subservice,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Partial<Subservice>>({
    name: subservice?.name || '',
    basePrice: subservice?.basePrice || 0,
    priceUnit: subservice?.priceUnit || 'per Kg',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'basePrice') {
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
      title={subservice ? 'Edit Subservice' : 'Add New Subservice'}
      description="Configure subservice details"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Subservice Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wash & Fold"
          />
        </div>
        
        <div>
          <Label htmlFor="basePrice">Base Price</Label>
          <Input
            id="basePrice"
            name="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="priceUnit">Price Unit</Label>
          <Input
            id="priceUnit"
            name="priceUnit"
            value={formData.priceUnit}
            onChange={handleChange}
            placeholder="e.g. per Kg, per piece"
          />
        </div>
      </div>
    </ServiceModal>
  );
};

export default SubserviceEdit;
