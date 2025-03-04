
import React from 'react';
import { Service } from '@/types/serviceTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceModal } from './ServiceModals';

interface ServiceEditProps {
  service?: Service;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}

const ServiceEdit: React.FC<ServiceEditProps> = ({
  service,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Partial<Service>>({
    name: service?.name || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <ServiceModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={service ? 'Edit Service' : 'Add New Service'}
      description="Configure service details"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Service Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Core Laundry Services"
          />
        </div>
      </div>
    </ServiceModal>
  );
};

export default ServiceEdit;
