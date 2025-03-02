import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ServiceList from '@/components/studio-services/ServiceList';
import ServiceModals from '@/components/studio-services/ServiceModals';
import { Service, ItemToDelete, FilterType } from '@/components/studio-services/types';

import { initialServices } from '@/data/mockServiceData';

const StudioServices: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete>(null);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddSubserviceModalOpen, setIsAddSubserviceModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedSubserviceId, setSelectedSubserviceId] = useState<string | null>(null);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newSubserviceName, setNewSubserviceName] = useState('');
  const [newSubservicePricePerUnit, setNewSubservicePricePerUnit] = useState('');
  const [newSubserviceUnit, setNewSubserviceUnit] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { toast } = useToast();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredServices(services);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = services.map(service => {
      const matchedSubservices = service.subservices
        .map(subservice => {
          const matchedItems = subservice.items.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.price.toString().includes(query)
          );

          if (matchedItems.length > 0 || subservice.name.toLowerCase().includes(query)) {
            return {
              ...subservice,
              items: matchedItems.length > 0 ? matchedItems : subservice.items,
              isExpanded: matchedItems.length > 0 || subservice.name.toLowerCase().includes(query)
            };
          }
          return null;
        })
        .filter((subservice): subservice is any => subservice !== null);

      if (matchedSubservices.length > 0 || service.name.toLowerCase().includes(query)) {
        return {
          ...service,
          subservices: matchedSubservices.length > 0 ? matchedSubservices : [],
          isExpanded: matchedSubservices.length > 0 || service.name.toLowerCase().includes(query)
        };
      }
      return null;
    }).filter((service): service is Service => service !== null);

    setFilteredServices(filtered);
  }, [searchQuery, services]);

  const toggleServiceExpansion = (serviceId: string) => {
    setServices(prev => 
      prev.map(service => {
        if (service.id === serviceId) {
          return { ...service, isExpanded: !service.isExpanded };
        }
        return service;
      })
    );
  };

  const toggleSubserviceExpansion = (serviceId: string, subserviceId: string) => {
    setServices(prev => 
      prev.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            subservices: service.subservices.map(subservice => {
              if (subservice.id === subserviceId) {
                return { ...subservice, isExpanded: !subservice.isExpanded };
              }
              return subservice;
            })
          };
        }
        return service;
      })
    );
  };

  const handleDeleteClick = (type: 'service' | 'subservice' | 'item', id: string, name: string, parentId?: string, subParentId?: string) => {
    setItemToDelete({ type, id, name, parentId, subParentId });
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = () => {
    if (!itemToDelete) return;

    const { type, id, parentId, subParentId } = itemToDelete;

    switch (type) {
      case 'service':
        setServices(prev => prev.filter(service => service.id !== id));
        toast({
          title: "Service Deleted",
          description: `${itemToDelete.name} has been successfully removed.`,
          duration: 3000,
        });
        break;
      case 'subservice':
        if (parentId) {
          setServices(prev => 
            prev.map(service => {
              if (service.id === parentId) {
                return {
                  ...service,
                  subservices: service.subservices.filter(subservice => subservice.id !== id)
                };
              }
              return service;
            })
          );
          toast({
            title: "Subservice Deleted",
            description: `${itemToDelete.name} has been successfully removed.`,
            duration: 3000,
          });
        }
        break;
      case 'item':
        if (parentId && subParentId) {
          setServices(prev => 
            prev.map(service => {
              if (service.id === parentId) {
                return {
                  ...service,
                  subservices: service.subservices.map(subservice => {
                    if (subservice.id === subParentId) {
                      return {
                        ...subservice,
                        items: subservice.items.filter(item => item.id !== id)
                      };
                    }
                    return subservice;
                  })
                };
              }
              return service;
            })
          );
          toast({
            title: "Item Deleted",
            description: `${itemToDelete.name} has been successfully removed.`,
            duration: 3000,
          });
        }
        break;
    }

    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleAddService = () => {
    if (newServiceName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Service name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newService: Service = {
      id: `service-${Date.now()}`,
      name: newServiceName.trim(),
      subservices: [],
      isExpanded: false
    };

    setServices(prev => [...prev, newService]);
    setIsAddServiceModalOpen(false);
    setNewServiceName('');
    
    setSuccessMessage({
      title: "Service Added",
      message: `${newServiceName.trim()} has been successfully added.`
    });
    setIsSuccessDialogOpen(true);
  };

  const handleAddSubservice = () => {
    if (newSubserviceName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Subservice name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!currentParentId) return;

    const newSubservice = {
      id: `subservice-${Date.now()}`,
      name: newSubserviceName.trim(),
      pricePerUnit: newSubservicePricePerUnit.trim() || undefined,
      unit: newSubserviceUnit.trim() || undefined,
      items: [],
      isExpanded: false
    };

    setServices(prev => 
      prev.map(service => {
        if (service.id === currentParentId) {
          return {
            ...service,
            subservices: [...service.subservices, newSubservice],
            isExpanded: true
          };
        }
        return service;
      })
    );

    setIsAddSubserviceModalOpen(false);
    setNewSubserviceName('');
    setNewSubservicePricePerUnit('');
    setNewSubserviceUnit('');
    setCurrentParentId(null);
    
    setSuccessMessage({
      title: "Subservice Added",
      message: `${newSubserviceName.trim()} has been successfully added.`
    });
    setIsSuccessDialogOpen(true);
  };

  const handleAddItem = () => {
    if (newItemName.trim() === '' || !newItemPrice) {
      toast({
        title: "Validation Error",
        description: "Item name and price are required",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!currentParentId || !selectedSubserviceId) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      price: parseFloat(newItemPrice) || 0,
      expressPrice: parseFloat(newItemPrice) * 1.5 || 0
    };

    setServices(prev => 
      prev.map(service => {
        if (service.id === currentParentId) {
          return {
            ...service,
            isExpanded: true,
            subservices: service.subservices.map(subservice => {
              if (subservice.id === selectedSubserviceId) {
                return {
                  ...subservice,
                  isExpanded: true,
                  items: [...subservice.items, newItem]
                };
              }
              return subservice;
            })
          };
        }
        return service;
      })
    );

    setIsAddItemModalOpen(false);
    setNewItemName('');
    setNewItemPrice('');
    setCurrentParentId(null);
    setSelectedSubserviceId(null);
    
    setSuccessMessage({
      title: "Item Added",
      message: `${newItemName.trim()} has been successfully added.`
    });
    setIsSuccessDialogOpen(true);
  };

  const toggleItemEditMode = (serviceId: string, subserviceId: string, itemId: string) => {
    setServices(prev => 
      prev.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            subservices: service.subservices.map(subservice => {
              if (subservice.id === subserviceId) {
                return {
                  ...subservice,
                  items: subservice.items.map(item => {
                    if (item.id === itemId) {
                      return { ...item, isEditing: !item.isEditing };
                    }
                    return { ...item, isEditing: false };
                  })
                };
              }
              return {
                ...subservice,
                items: subservice.items.map(item => ({ ...item, isEditing: false }))
              };
            })
          };
        }
        return {
          ...service,
          subservices: service.subservices.map(subservice => ({
            ...subservice,
            items: subservice.items.map(item => ({ ...item, isEditing: false }))
          }))
        };
      })
    );
  };

  const updateItemName = (serviceId: string, subserviceId: string, itemId: string, newName: string) => {
    setServices(prev => 
      prev.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            subservices: service.subservices.map(subservice => {
              if (subservice.id === subserviceId) {
                return {
                  ...subservice,
                  items: subservice.items.map(item => {
                    if (item.id === itemId) {
                      return { ...item, name: newName };
                    }
                    return item;
                  })
                };
              }
              return subservice;
            })
          };
        }
        return service;
      })
    );
  };

  const updateItemPrice = (serviceId: string, subserviceId: string, itemId: string, newPriceStr: string) => {
    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice)) return;

    setServices(prev => 
      prev.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            subservices: service.subservices.map(subservice => {
              if (subservice.id === subserviceId) {
                return {
                  ...subservice,
                  items: subservice.items.map(item => {
                    if (item.id === itemId) {
                      return { ...item, price: newPrice };
                    }
                    return item;
                  })
                };
              }
              return subservice;
            })
          };
        }
        return service;
      })
    );
  };

  const updateItemExpressPrice = (serviceId: string, subserviceId: string, itemId: string, newPriceStr: string) => {
    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice)) return;

    setServices(prev => 
      prev.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            subservices: service.subservices.map(subservice => {
              if (subservice.id === subserviceId) {
                return {
                  ...subservice,
                  items: subservice.items.map(item => {
                    if (item.id === itemId) {
                      return { ...item, expressPrice: newPrice };
                    }
                    return item;
                  })
                };
              }
              return subservice;
            })
          };
        }
        return service;
      })
    );
  };

  const saveItemEdit = (serviceId: string, subserviceId: string, itemId: string) => {
    setServices(prev => 
      prev.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            subservices: service.subservices.map(subservice => {
              if (subservice.id === subserviceId) {
                return {
                  ...subservice,
                  items: subservice.items.map(item => {
                    if (item.id === itemId) {
                      return { ...item, isEditing: false };
                    }
                    return item;
                  })
                };
              }
              return subservice;
            })
          };
        }
        return service;
      })
    );

    toast({
      title: "Item Updated",
      description: "Item has been successfully updated.",
      duration: 2000,
    });
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    
    setServices(prev => 
      prev.map(service => ({
        ...service,
        isExpanded: filter === 'all' ? false : 
                    filter === 'services' ? true :
                    filter === 'subservices' || filter === 'items',
        subservices: service.subservices.map(subservice => ({
          ...subservice,
          isExpanded: filter === 'all' ? false :
                      filter === 'services' ? false :
                      filter === 'subservices' ? true :
                      filter === 'items'
        }))
      }))
    );
  };

  const handleEditServiceToggle = (newMode: 'list' | 'edit') => {
    setViewMode(newMode);
    
    setServices(prev => 
      prev.map(service => ({
        ...service,
        isEditing: false,
        subservices: service.subservices.map(subservice => ({
          ...subservice,
          isEditing: false,
          items: subservice.items.map(item => ({
            ...item,
            isEditing: false
          }))
        }))
      }))
    );
  };

  return (
    <AdminLayout>
      <PageHeader 
        title="Studio Services" 
        subtitle={`Manage services for Studio ID: ${studioId}`}
        backButton={
          <Button
            variant="back"
            size="icon"
            onClick={() => navigate('/studios')}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      >
        <Tabs value={viewMode} onValueChange={(v) => handleEditServiceToggle(v as 'list' | 'edit')} className="ml-4">
          <TabsList>
            <TabsTrigger value="list">View Services</TabsTrigger>
            <TabsTrigger value="edit">Edit Services</TabsTrigger>
          </TabsList>
        </Tabs>
      </PageHeader>

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6">
          <Tabs value={viewMode} onValueChange={(v) => handleEditServiceToggle(v as 'list' | 'edit')}>
            <TabsContent value="list" className="mt-0">
              <ServiceList 
                mode="list"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchInputRef={searchInputRef}
                filteredServices={filteredServices}
                activeFilter={activeFilter}
                handleFilterChange={handleFilterChange}
                toggleServiceExpansion={toggleServiceExpansion}
                toggleSubserviceExpansion={toggleSubserviceExpansion}
                toggleItemEditMode={toggleItemEditMode}
                updateItemName={updateItemName}
                updateItemPrice={updateItemPrice}
                updateItemExpressPrice={updateItemExpressPrice}
                saveItemEdit={saveItemEdit}
                handleDeleteClick={handleDeleteClick}
                setIsAddServiceModalOpen={setIsAddServiceModalOpen}
                setCurrentParentId={setCurrentParentId}
                setIsAddSubserviceModalOpen={setIsAddSubserviceModalOpen}
                setCurrentParentId2={setCurrentParentId}
                setSelectedSubserviceId={setSelectedSubserviceId}
                setIsAddItemModalOpen={setIsAddItemModalOpen}
              />
            </TabsContent>

            <TabsContent value="edit" className="mt-0">
              <ServiceList 
                mode="edit"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchInputRef={searchInputRef}
                filteredServices={filteredServices}
                activeFilter={activeFilter}
                handleFilterChange={handleFilterChange}
                toggleServiceExpansion={toggleServiceExpansion}
                toggleSubserviceExpansion={toggleSubserviceExpansion}
                toggleItemEditMode={toggleItemEditMode}
                updateItemName={updateItemName}
                updateItemPrice={updateItemPrice}
                updateItemExpressPrice={updateItemExpressPrice}
                saveItemEdit={saveItemEdit}
                handleDeleteClick={handleDeleteClick}
                setIsAddServiceModalOpen={setIsAddServiceModalOpen}
                setCurrentParentId={setCurrentParentId}
                setIsAddSubserviceModalOpen={setIsAddSubserviceModalOpen}
                setCurrentParentId2={setCurrentParentId}
                setSelectedSubserviceId={setSelectedSubserviceId}
                setIsAddItemModalOpen={setIsAddItemModalOpen}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ServiceModals 
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        itemToDelete={itemToDelete}
        executeDelete={executeDelete}
        isAddServiceModalOpen={isAddServiceModalOpen}
        setIsAddServiceModalOpen={setIsAddServiceModalOpen}
        newServiceName={newServiceName}
        setNewServiceName={setNewServiceName}
        handleAddService={handleAddService}
        isAddSubserviceModalOpen={isAddSubserviceModalOpen}
        setIsAddSubserviceModalOpen={setIsAddSubserviceModalOpen}
        newSubserviceName={newSubserviceName}
        setNewSubserviceName={setNewSubserviceName}
        newSubservicePricePerUnit={newSubservicePricePerUnit}
        setNewSubservicePricePerUnit={setNewSubservicePricePerUnit}
        newSubserviceUnit={newSubserviceUnit}
        setNewSubserviceUnit={setNewSubserviceUnit}
        handleAddSubservice={handleAddSubservice}
        isAddItemModalOpen={isAddItemModalOpen}
        setIsAddItemModalOpen={setIsAddItemModalOpen}
        newItemName={newItemName}
        setNewItemName={setNewItemName}
        newItemPrice={newItemPrice}
        setNewItemPrice={setNewItemPrice}
        handleAddItem={handleAddItem}
        isSuccessDialogOpen={isSuccessDialogOpen}
        setIsSuccessDialogOpen={setIsSuccessDialogOpen}
        successMessage={successMessage}
      />
    </AdminLayout>
  );
};

export default StudioServices;
