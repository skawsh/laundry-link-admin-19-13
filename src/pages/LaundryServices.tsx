
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import LaundryServices from '@/components/laundry/LaundryServices';

const LaundryServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Laundry Services"
        subtitle="Manage your laundry service offerings"
      />
      <LaundryServices />
    </div>
  );
};

export default LaundryServicesPage;
