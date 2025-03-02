
import React from 'react';
import { Plus, PackageOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Service } from './types';
import ServiceView from './ServiceView';
import ServiceEdit from './ServiceEdit';
import SearchBox from './SearchBox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceListProps {
  mode: 'list' | 'edit';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  filteredServices: Service[];
  activeFilter: 'services' | 'subservices' | 'items';
  handleFilterChange: (filter: 'services' | 'subservices' | 'items') => void;
  toggleServiceExpansion: (serviceId: string) => void;
  toggleSubserviceExpansion: (serviceId: string, subserviceId: string) => void;
  toggleItemEditMode: (serviceId: string, subserviceId: string, itemId: string) => void;
  updateItemName: (serviceId: string, subserviceId: string, itemId: string, newName: string) => void;
  updateItemPrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  updateItemExpressPrice: (serviceId: string, subserviceId: string, itemId: string, newPrice: string) => void;
  saveItemEdit: (serviceId: string, subserviceId: string, itemId: string) => void;
  handleDeleteClick: (type: 'service' | 'subservice' | 'item', id: string, name: string, parentId?: string, subParentId?: string) => void;
  setIsAddServiceModalOpen: (isOpen: boolean) => void;
  setCurrentParentId: (id: string) => void;
  setIsAddSubserviceModalOpen: (isOpen: boolean) => void;
  setCurrentParentId2: (id: string) => void;
  setSelectedSubserviceId: (id: string) => void;
  setIsAddItemModalOpen: (isOpen: boolean) => void;
  onSearch?: (query: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  mode,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  filteredServices,
  activeFilter,
  handleFilterChange,
  toggleServiceExpansion,
  toggleSubserviceExpansion,
  toggleItemEditMode,
  updateItemName,
  updateItemPrice,
  updateItemExpressPrice,
  saveItemEdit,
  handleDeleteClick,
  setIsAddServiceModalOpen,
  setCurrentParentId,
  setIsAddSubserviceModalOpen,
  setCurrentParentId2,
  setSelectedSubserviceId,
  setIsAddItemModalOpen,
  onSearch
}) => {

  const handleAddSubservice = (serviceId: string) => {
    setCurrentParentId(serviceId);
    setIsAddSubserviceModalOpen(true);
  };

  const handleAddItem = (serviceId: string, subserviceId: string) => {
    setCurrentParentId2(serviceId);
    setSelectedSubserviceId(subserviceId);
    setIsAddItemModalOpen(true);
  };

  const handleAddServiceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddServiceModalOpen(true);
  };

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <SearchBox 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          searchInputRef={searchInputRef}
          onSearch={onSearch}
        />
        <Button 
          variant="service" 
          className="w-full sm:w-auto"
          onClick={handleAddServiceClick}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-gray-50 p-3 rounded-md">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <div className="flex space-x-2 w-full sm:w-auto">
            <Select 
              value={activeFilter} 
              onValueChange={(value) => handleFilterChange(value as 'services' | 'subservices' | 'items')}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="subservices">Subservices</SelectItem>
                <SelectItem value="items">Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <PackageOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-600">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? "Try a different search term or add a new service." : "Add your first service to get started."}
          </p>
          <Button
            variant="service"
            className="mt-4"
            onClick={(e) => {
              e.preventDefault();
              setIsAddServiceModalOpen(true);
              setSearchQuery('');
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {mode === 'list' && filteredServices.map(service => (
            <ServiceView 
              key={service.id} 
              service={service} 
              onToggleService={toggleServiceExpansion}
              onToggleSubservice={toggleSubserviceExpansion}
            />
          ))}
          
          {mode === 'edit' && filteredServices.map(service => (
            <ServiceEdit 
              key={service.id} 
              service={service} 
              onToggleService={toggleServiceExpansion}
              onToggleSubservice={toggleSubserviceExpansion}
              onToggleItemEdit={toggleItemEditMode}
              onUpdateItemName={updateItemName}
              onUpdateItemPrice={updateItemPrice}
              onUpdateItemExpressPrice={updateItemExpressPrice}
              onSaveItemEdit={saveItemEdit}
              onDeleteClick={handleDeleteClick}
              onAddSubservice={handleAddSubservice}
              onAddItem={handleAddItem}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ServiceList;
