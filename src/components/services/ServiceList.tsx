import React, { useState, useEffect } from 'react';
import { Service, Subservice, ClothingItem } from '@/types/serviceTypes';
import { PlusCircle, ChevronRight, ChevronDown, Edit, Trash, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';

interface ServiceListProps {
  services: Service[];
  searchTerm: string;
  onAddItem: (serviceId: string, subserviceId: string, item: any) => void;
  onEditItem?: (serviceId: string, subserviceId: string, itemId: string, updatedItem: Partial<ClothingItem>) => void;
  onToggleService: (serviceId: string) => void;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  searchTerm,
  onAddItem,
  onEditItem,
  onToggleService,
  onToggleSubservice
}) => {
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [expandedSubservices, setExpandedSubservices] = useState<Record<string, boolean>>({});
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedSubserviceId, setSelectedSubserviceId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
      return;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    const filtered = services.map(service => {
      const serviceMatches = service.name.toLowerCase().includes(lowerCaseSearchTerm);
      
      const matchedSubservices = service.subservices.filter(subservice => {
        return subservice.name.toLowerCase().includes(lowerCaseSearchTerm);
      });
      
      if (serviceMatches || matchedSubservices.length > 0) {
        if (matchedSubservices.length > 0) {
          setExpandedServices(prev => ({
            ...prev,
            [service.id]: true
          }));
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
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const toggleSubserviceExpand = (subserviceId: string) => {
    setExpandedSubservices(prev => ({
      ...prev,
      [subserviceId]: !prev[subserviceId]
    }));
  };

  const handleEditService = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Edit service functionality will be implemented soon.",
      duration: 3000
    });
  };

  const handleDeleteService = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Delete service functionality will be implemented soon.",
      duration: 3000
    });
  };

  const handleAddSubservice = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Add subservice functionality will be implemented soon.",
      duration: 3000
    });
  };

  const handleEditSubservice = (subserviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Edit subservice functionality will be implemented soon.",
      duration: 3000
    });
  };

  const handleDeleteSubservice = (subserviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Delete subservice functionality will be implemented soon.",
      duration: 3000
    });
  };

  const handleOpenAddItemModal = (serviceId: string, subserviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedSubserviceId(subserviceId);
    setIsAddItemModalOpen(true);
  };

  const handleAddItemSubmit = (newItem: Omit<ClothingItem, "id">) => {
    if (selectedServiceId && selectedSubserviceId) {
      onAddItem(selectedServiceId, selectedSubserviceId, newItem);
      setIsAddItemModalOpen(false);
    }
  };

  const handleEditItem = (serviceId: string, subserviceId: string, item: ClothingItem) => {
    if (!onEditItem) {
      toast({
        title: "Coming Soon",
        description: "Edit item functionality will be implemented soon.",
        duration: 3000
      });
      return;
    }
    
    setSelectedServiceId(serviceId);
    setSelectedSubserviceId(subserviceId);
    setSelectedItem(item);
    setIsEditItemModalOpen(true);
  };

  const handleEditItemSubmit = (itemId: string, updatedItem: Partial<ClothingItem>) => {
    if (selectedServiceId && selectedSubserviceId && onEditItem) {
      onEditItem(selectedServiceId, selectedSubserviceId, itemId, updatedItem);
      setIsEditItemModalOpen(false);
    }
  };

  if (filteredServices.length === 0) {
    return <div className="bg-white rounded-lg shadow-sm p-6 text-center mt-4">
        <p className="text-gray-500">No services found. Try adjusting your search.</p>
      </div>;
  }

  return (
    <div className="space-y-4 mt-4">
      {filteredServices.map(service => (
        <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleServiceExpand(service.id)}>
              {expandedServices[service.id] ? 
                <ChevronDown className="h-5 w-5 text-gray-400 mr-2" /> : 
                <ChevronRight className="h-5 w-5 text-gray-400 mr-2" />
              }
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-500">
                  {service.subservices.length} subservices
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rounded-md">
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
                  <div className="flex items-center justify-between p-3 pl-8 hover:bg-gray-50">
                    <div 
                      className="flex items-center flex-1 cursor-pointer" 
                      onClick={() => toggleSubserviceExpand(subservice.id)}
                    >
                      {expandedSubservices[subservice.id] ? 
                        <ChevronDown className="h-4 w-4 text-gray-400 mr-2" /> : 
                        <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                      }
                      <div className="ml-2">
                        <h4 className="font-medium">{subservice.name}</h4>
                        <p className="text-xs text-gray-500">
                          {subservice.items.length} items
                        </p>
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
                    <div className="pl-14 pr-4 pb-3 pt-1">
                      {subservice.items.length > 0 ? (
                        <div className="space-y-2">
                          {subservice.items.map(item => (
                            <div key={item.id} className="px-3 py-2 bg-gray-50 rounded-md flex justify-between items-center">
                              <span className="text-sm font-medium">{item.name}</span>
                              <div className="flex items-center space-x-4">
                                <div className="text-sm">Standard: ₹{item.standardPrice}</div>
                                <div className="text-sm text-amber-600">Express: ₹{item.expressPrice}</div>
                                
                                {onEditItem && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditItem(service.id, subservice.id, item);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-gray-500" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No clothing items added yet</p>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3" 
                        onClick={() => handleOpenAddItemModal(service.id, subservice.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="p-3 pl-8">
                <Button variant="outline" size="sm" onClick={() => handleAddSubservice(service.id)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add New Subservice
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onAddItem={handleAddItemSubmit}
      />

      {selectedItem && (
        <EditItemModal
          isOpen={isEditItemModalOpen}
          onClose={() => setIsEditItemModalOpen(false)}
          item={selectedItem}
          onEditItem={handleEditItemSubmit}
        />
      )}
    </div>
  );
};

export default ServiceList;
