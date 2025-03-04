
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getStudioById } from '@/data/mockServiceData';
import ServiceList from '@/components/services/ServiceList';
import SearchBox from '@/components/services/SearchBox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/ui/PageHeader';

const StudioServices: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Get studio data
  const studio = getStudioById(studioId || '');

  if (!studio) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-500">Studio not found</h1>
          <p className="text-gray-600 mt-2">The requested studio could not be found.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/studios')}
            variant="outline"
          >
            Back to Studios
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleAddService = () => {
    toast({
      title: "Coming Soon",
      description: "Add service functionality will be implemented soon.",
      duration: 3000,
    });
  };

  const handleGoBack = () => {
    navigate(`/studios/details/${studioId}`);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader
          title={`${studio.name} - Services`}
          subtitle="Manage all laundry services offered by this studio"
          backButton={
            <Button 
              onClick={handleGoBack} 
              variant="back" 
              size="icon"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          }
        >
          <Button onClick={handleAddService} variant="service">
            <Plus className="h-4 w-4 mr-1" />
            Add Service
          </Button>
        </PageHeader>

        <div className="mt-6">
          <SearchBox 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search services, subservices or items..."
          />
          
          <ServiceList 
            services={studio.services}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudioServices;
