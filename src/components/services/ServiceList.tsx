import React, { useState, useEffect } from 'react';
import { Service, Subservice, ClothingItem } from '@/types/serviceTypes';
import { PlusCircle, ChevronRight, ChevronDown, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AddItemModal from './AddItemModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ServiceListProps {
  services: Service[];
  searchTerm: string;
  onAddItem: (serviceId: string, subserviceId: string, item: Omit<ClothingItem, "id">) => void;
  onToggleService: (serviceId: string) => void;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  searchTerm,
  onAddItem,
  onToggleService,
  onToggleSubservice
}) => {
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [expandedSubservices, setExpandedSubservices] = useState<Record<string, boolean>>({});
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const { toast } = useToast();
  
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [selectedSubservice, setSelectedSubservice] = useState<{
    serviceId: string;
    subserviceId: string;
  } | null>(null);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    const filtered = services.map(service => {
      const serviceMatches = service.name.toLowerCase().includes(lowerCaseSearchTerm);
      
      const matchedSubservices = service.subservices.filter(subservice => {
        const subserviceMatches = subservice.name.toLowerCase().includes(lowerCaseSearchTerm);
        
        const itemMatches = subservice.items.some(item => 
          item.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
        
        return subserviceMatches || itemMatches;
      });
      
      if (serviceMatches || matchedSubservices.length > 0) {
        if (matchedSubservices.length > 0) {
          setExpandedServices(prev => ({...prev, [service.id]: true}));
          
          matchedSubservices.forEach(sub => {
            setExpandedSubservices(prev => ({...prev, [sub.id]: true}));
          });
        }
        
        return {
          ...service,
          subservices: serviceMatches ? service.subservices : matchedSubservices
        };
      }
      
      return null;
    }).filter(Boolean) as Service[];
    
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const toggleServiceExpand = (serviceId: string) => {
    setExpandedServices(prev => ({...prev, [serviceId]: !prev[serviceId]}));
  };

  const toggleSubserviceExpand = (subserviceId: string) => {
    setExpandedSubservices(prev => ({...prev, [subserviceId]: !prev[subserviceId]}));
  };

  const openAddItemModal = (serviceId: string, subserviceId: string) => {
    setSelectedSubservice({ serviceId, subserviceId });
    setAddItemModalOpen(true);
  };

  const closeAddItemModal = () => {
    setAddItemModalOpen(false);
    setSelectedSubservice(null);
  };

  const handleAddItemSubmit = (newItem: Omit<ClothingItem, "id">) => {
    if (selectedSubservice) {
      onAddItem(selectedSubservice.serviceId, selectedSubservice.subserviceId, newItem);
      closeAddItemModal();
    }
  };

  const handleEditService = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Edit service functionality will be implemented soon.",
      duration: 3000,
    });
  };

  const handleDeleteService = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Delete service functionality will be implemented soon.",
      duration: 3000,
    });
  };

  const handleAddSubservice = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Add subservice functionality will be implemented soon.",
      duration: 3000,
    });
  };

  const handleEditSubservice = (subserviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Edit subservice functionality will be implemented soon.",
      duration: 3000,
    });
  };

  const handleDeleteSubservice = (subserviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Delete subservice functionality will be implemented soon.",
      duration: 3000,
    });
  };

  if (filteredServices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center mt-4">
        <p className="text-gray-500">No services found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 mt-4">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div 
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => toggleServiceExpand(service.id)}
              >
                {expandedServices[service.id] ? (
                  <ChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-500">
                    {service.subservices.length} subservices
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`enable-service-${service.id}`}
                    checked={service.enabled}
                    onCheckedChange={() => onToggleService(service.id)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Label htmlFor={`enable-service-${service.id}`} className="text-sm text-gray-600">
                    {service.enabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
                
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {service.subservices.length} Subservices
                </Badge>
                
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    handleEditService(service.id);
                  }}>
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteService(service.id);
                  }}>
                    <Trash className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
            
            {expandedServices[service.id] && (
              <div className="border-t border-gray-100">
                {service.subservices.map(subservice => (
                  <div key={subservice.id} className="border-b border-gray-100 last:border-b-0">
                    <div 
                      className="flex items-center justify-between p-3 pl-8 hover:bg-gray-50"
                    >
                      <div 
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => toggleSubserviceExpand(subservice.id)}
                      >
                        {expandedSubservices[subservice.id] ? (
                          <ChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400 mr-2" />
                        )}
                        <div>
                          <h4 className="font-medium">{subservice.name}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            {subservice.basePrice && (
                              <span>₹{subservice.basePrice} {subservice.priceUnit} • </span>
                            )}
                            <span>{subservice.items.length} items</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`enable-subservice-${subservice.id}`}
                            checked={subservice.enabled}
                            onCheckedChange={() => onToggleSubservice(service.id, subservice.id)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                          <Label htmlFor={`enable-subservice-${subservice.id}`} className="text-sm text-gray-600">
                            {subservice.enabled ? "Enabled" : "Disabled"}
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs px-2 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAddItemModal(service.id, subservice.id);
                            }}
                          >
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Add Item
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            handleEditSubservice(subservice.id);
                          }}>
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubservice(subservice.id);
                          }}>
                            <Trash className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {expandedSubservices[subservice.id] && (
                      <div className="p-3 pl-14 bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {subservice.items.map(item => (
                            <ClothingItemCard 
                              key={item.id} 
                              item={item}
                            />
                          ))}
                        </div>
                        
                        <button 
                          className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddItemModal(service.id, subservice.id);
                          }}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" /> 
                          Add New Item
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="p-3 pl-8">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddSubservice(service.id)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add New Subservice
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddItemModal
        isOpen={addItemModalOpen}
        onClose={closeAddItemModal}
        onAddItem={handleAddItemSubmit}
      />
    </>
  );
};

const ClothingItemCard: React.FC<{ item: ClothingItem }> = ({ item }) => {
  const { toast } = useToast();
  
  const handleEditItem = () => {
    toast({
      title: "Coming Soon",
      description: "Edit item functionality will be implemented soon.",
      duration: 3000,
    });
  };
  
  const handleDeleteItem = () => {
    toast({
      title: "Coming Soon",
      description: "Delete item functionality will be implemented soon.",
      duration: 3000,
    });
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleEditItem}>
          <Edit className="h-3 w-3 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDeleteItem}>
          <Trash className="h-3 w-3 text-gray-500" />
        </Button>
      </div>
      
      <div className="mb-2">
        <h5 className="font-medium">{item.name}</h5>
      </div>
      
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-500">Standard</p>
          <p className="font-medium">₹{item.standardPrice}</p>
        </div>
        <div>
          <p className="text-gray-500">Express</p>
          <p className="font-medium">₹{item.expressPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
