
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  getStudioById, 
  addServiceToStudio, 
  addSubserviceToService, 
  addItemToSubservice 
} from '@/data/mockServiceData';
import ServiceList from '@/components/services/ServiceList';
import SearchBox from '@/components/services/SearchBox';
import AddServiceModal from '@/components/services/AddServiceModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/ui/PageHeader';
import { ClothingItem, Service, Subservice } from '@/types/serviceTypes';

const StudioServices: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force re-fetch of studio data

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
    setAddServiceModalOpen(true);
  };

  const handleGoBack = () => {
    navigate(`/studios/details/${studioId}`);
  };

  const handleAddServiceSubmit = (serviceName: string, subservices: Omit<Subservice, "id">[]) => {
    try {
      // Create a new service
      const newService = addServiceToStudio(studioId || '', {
        name: serviceName,
        subservices: []
      });
      
      // Add all subservices
      subservices.forEach(subservice => {
        addSubserviceToService(studioId || '', newService.id, subservice);
      });

      toast({
        title: "Success",
        description: "Service added successfully",
        duration: 3000,
      });
      
      // Force refresh of studio data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddItem = (serviceId: string, subserviceId: string, newItem: Omit<ClothingItem, "id">) => {
    try {
      addItemToSubservice(studioId || '', serviceId, subserviceId, newItem);
      
      toast({
        title: "Success",
        description: "Item added successfully",
        duration: 3000,
      });
      
      // Force refresh of studio data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
        duration: 3000,
      });
    }
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
            key={refreshKey} // Force re-render when data changes
            services={studio.services}
            searchTerm={searchTerm}
            onAddItem={handleAddItem}
          />
        </div>
      </div>

      {/* Add Service Modal */}
      <AddServiceModal 
        isOpen={addServiceModalOpen}
        onClose={() => setAddServiceModalOpen(false)}
        onAddService={handleAddServiceSubmit}
      />
    </AdminLayout>
  );
};

export default StudioServices;
