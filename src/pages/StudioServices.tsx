
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit, Search, ChevronDown, ChevronRight, 
  ArrowLeft, Save, Check, X, PackageOpen, Shirt, Tag, 
  Filter, AlertCircle, CheckCircle 
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from "../hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClothingItem {
  id: string;
  name: string;
  price: number;
  isEditing?: boolean;
}

interface Subservice {
  id: string;
  name: string;
  pricePerUnit?: string;
  unit?: string;
  items: ClothingItem[];
  isExpanded: boolean;
  isEditing?: boolean;
}

interface Service {
  id: string;
  name: string;
  subservices: Subservice[];
  isExpanded: boolean;
  isEditing?: boolean;
}

// Mock data for services
const initialServices: Service[] = [
  {
    id: "service-1",
    name: "Core Laundry Services",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-1-1",
        name: "Wash & Fold",
        pricePerUnit: "59",
        unit: "per Kg",
        isExpanded: false,
        items: [
          { id: "item-1-1-1", name: "Shirt", price: 10 },
          { id: "item-1-1-2", name: "Pant", price: 20 },
          { id: "item-1-1-3", name: "Shorts", price: 30 },
          { id: "item-1-1-4", name: "T-shirt", price: 15 },
          { id: "item-1-1-5", name: "Jeans", price: 25 },
        ]
      },
      {
        id: "subservice-1-2",
        name: "Wash & Iron",
        pricePerUnit: "79",
        unit: "per Kg",
        isExpanded: false,
        items: [
          { id: "item-1-2-1", name: "Shirt", price: 15 },
          { id: "item-1-2-2", name: "Pant", price: 25 },
          { id: "item-1-2-3", name: "Shorts", price: 35 },
        ]
      }
    ]
  },
  {
    id: "service-2",
    name: "Dry Cleaning",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-2-1",
        name: "Upper Wear",
        isExpanded: false,
        items: [
          { id: "item-2-1-1", name: "Shirt", price: 99 },
          { id: "item-2-1-2", name: "T-shirt", price: 89 },
          { id: "item-2-1-3", name: "Sweater", price: 149 },
        ]
      },
      {
        id: "subservice-2-2",
        name: "Lower Wear",
        isExpanded: false,
        items: [
          { id: "item-2-2-1", name: "Jeans", price: 120 },
          { id: "item-2-2-2", name: "Trousers", price: 110 },
        ]
      }
    ]
  },
  {
    id: "service-3",
    name: "Shoe Laundry",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-3-1",
        name: "Sports Shoes",
        isExpanded: false,
        items: [
          { id: "item-3-1-1", name: "Casual Shoes", price: 149 },
          { id: "item-3-1-2", name: "Running Shoes", price: 179 },
        ]
      },
      {
        id: "subservice-3-2",
        name: "Formal Shoes",
        isExpanded: false,
        items: [
          { id: "item-3-2-1", name: "Leather Shoes", price: 199 },
          { id: "item-3-2-2", name: "Boots", price: 249 },
        ]
      }
    ]
  },
  {
    id: "service-4",
    name: "Premium Services",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-4-1",
        name: "Winter Wear",
        isExpanded: false,
        items: [
          { id: "item-4-1-1", name: "Coat", price: 299 },
          { id: "item-4-1-2", name: "Jacket", price: 249 },
          { id: "item-4-1-3", name: "Blanket", price: 399 },
        ]
      },
      {
        id: "subservice-4-2",
        name: "Accessories",
        isExpanded: false,
        items: [
          { id: "item-4-2-1", name: "Bag", price: 199 },
          { id: "item-4-2-2", name: "Cap", price: 79 },
        ]
      }
    ]
  }
];

const StudioServices: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'service' | 'subservice' | 'item', id: string, name: string, parentId?: string, subParentId?: string } | null>(null);
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'services' | 'subservices' | 'items'>('all');

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
        .filter((subservice): subservice is Subservice => subservice !== null);

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

    const newSubservice: Subservice = {
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
            isExpanded: true // Auto-expand parent service
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

    const newItem: ClothingItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      price: parseFloat(newItemPrice) || 0
    };

    setServices(prev => 
      prev.map(service => {
        if (service.id === currentParentId) {
          return {
            ...service,
            isExpanded: true, // Auto-expand parent service
            subservices: service.subservices.map(subservice => {
              if (subservice.id === selectedSubserviceId) {
                return {
                  ...subservice,
                  isExpanded: true, // Auto-expand parent subservice
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

  const handleFilterChange = (filter: 'all' | 'services' | 'subservices' | 'items') => {
    setActiveFilter(filter);
    
    // Expand services/subservices based on the selected filter
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
    
    // Reset editing states when switching modes
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
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/studios')}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Studios</span>
          </button>
          <Tabs value={viewMode} onValueChange={(v) => handleEditServiceToggle(v as 'list' | 'edit')} className="ml-4">
            <TabsList>
              <TabsTrigger value="list">View Services</TabsTrigger>
              <TabsTrigger value="edit">Edit Services</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </PageHeader>

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6">
          <Tabs value={viewMode} onValueChange={(v) => handleEditServiceToggle(v as 'list' | 'edit')}>
            <TabsContent value="list" className="mt-0">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search services, items or prices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button 
                  variant="service" 
                  className="w-full sm:w-auto"
                  onClick={() => setIsAddServiceModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Service</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeFilter === 'all' 
                      ? 'bg-admin-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('services')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeFilter === 'services' 
                      ? 'bg-admin-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => handleFilterChange('subservices')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeFilter === 'subservices' 
                      ? 'bg-admin-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Subservices
                </button>
                <button
                  onClick={() => handleFilterChange('items')}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeFilter === 'items' 
                      ? 'bg-admin-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Items
                </button>
              </div>

              {filteredServices.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <PackageOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-600">No services found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try a different search term or add a new service." : "Add your first service to get started."}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-admin-primary text-white rounded-md hover:bg-admin-primary/90 transition-colors"
                    onClick={() => {
                      setIsAddServiceModalOpen(true);
                      setSearchQuery('');
                    }}
                  >
                    <Plus className="inline-block h-4 w-4 mr-2" />
                    Add Service
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredServices.map(service => (
                    <div 
                      key={service.id} 
                      className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      <div 
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                        onClick={() => toggleServiceExpansion(service.id)}
                      >
                        <div className="flex items-center">
                          {service.isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                          )}
                          <h3 className="font-medium text-gray-800">{service.name}</h3>
                          <Badge variant="outline" className="ml-3 bg-gray-100">
                            {service.subservices.length} subservices
                          </Badge>
                        </div>
                      </div>
                      
                      {service.isExpanded && (
                        <div className="px-4 py-2 bg-white">
                          {service.subservices.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm italic">
                              No subservices found
                            </div>
                          ) : (
                            <div className="space-y-3 pl-6">
                              {service.subservices.map(subservice => (
                                <div key={subservice.id} className="border-l-2 border-gray-200 pl-4">
                                  <div 
                                    className="flex items-center justify-between py-2 cursor-pointer"
                                    onClick={() => toggleSubserviceExpansion(service.id, subservice.id)}
                                  >
                                    <div className="flex items-center">
                                      {subservice.isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                                      )}
                                      <h4 className="font-medium text-gray-700">{subservice.name}</h4>
                                      {subservice.pricePerUnit && (
                                        <span className="ml-2 text-sm text-gray-500">
                                          (₹{subservice.pricePerUnit} {subservice.unit})
                                        </span>
                                      )}
                                      <Badge variant="outline" className="ml-3 bg-gray-50">
                                        {subservice.items.length} items
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {subservice.isExpanded && (
                                    <div className="ml-6 my-2 bg-gray-50 rounded-md p-3">
                                      {subservice.items.length === 0 ? (
                                        <div className="text-center py-2 text-gray-500 text-sm italic">
                                          No items found
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          {subservice.items.map(item => (
                                            <div 
                                              key={item.id} 
                                              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-100"
                                            >
                                              <div className="flex items-center">
                                                <Shirt className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-gray-700">{item.name}</span>
                                              </div>
                                              <div className="flex items-center">
                                                <span className="font-medium text-gray-800">₹{item.price.toFixed(2)}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="edit" className="mt-0">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services, items or prices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button 
                  variant="service" 
                  className="w-full sm:w-auto"
                  onClick={() => setIsAddServiceModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Service</span>
                </Button>
              </div>

              {filteredServices.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <PackageOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-600">No services found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try a different search term or add a new service." : "Add your first service to get started."}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-admin-primary text-white rounded-md hover:bg-admin-primary/90 transition-colors"
                    onClick={() => {
                      setIsAddServiceModalOpen(true);
                      setSearchQuery('');
                    }}
                  >
                    <Plus className="inline-block h-4 w-4 mr-2" />
                    Add Service
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredServices.map(service => (
                    <Card key={service.id} className="transition-all duration-200 hover:shadow-md">
                      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                        <div 
                          className="flex items-center cursor-pointer flex-1"
                          onClick={() => toggleServiceExpansion(service.id)}
                        >
                          {service.isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                          )}
                          <h3 className="font-medium text-gray-800">{service.name}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentParentId(service.id);
                              setIsAddSubserviceModalOpen(true);
                            }}
                            className="text-admin-primary hover:text-admin-primary/90"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Subservice
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick('service', service.id, service.name)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {service.isExpanded && (
                        <div className="p-4">
                          {service.subservices.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm italic">
                              No subservices found. 
                              <Button
                                variant="link"
                                onClick={() => {
                                  setCurrentParentId(service.id);
                                  setIsAddSubserviceModalOpen(true);
                                }}
                                className="text-admin-primary font-medium"
                              >
                                Add one now
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4 pl-6">
                              {service.subservices.map(subservice => (
                                <div key={subservice.id} className="border-l-2 border-gray-200 pl-4">
                                  <div className="flex items-center justify-between py-2">
                                    <div 
                                      className="flex items-center cursor-pointer flex-1"
                                      onClick={() => toggleSubserviceExpansion(service.id, subservice.id)}
                                    >
                                      {subservice.isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                                      )}
                                      <h4 className="font-medium text-gray-700">{subservice.name}</h4>
                                      {subservice.pricePerUnit && (
                                        <span className="ml-2 text-sm text-gray-500">
                                          (₹{subservice.pricePerUnit} {subservice.unit})
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setCurrentParentId(service.id);
                                          setSelectedSubserviceId(subservice.id);
                                          setIsAddItemModalOpen(true);
                                        }}
                                        className="text-admin-primary hover:text-admin-primary/90"
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Item
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick('subservice', subservice.id, subservice.name, service.id)}
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {subservice.isExpanded && (
                                    <div className="ml-6 my-2 bg-gray-50 rounded-md p-3">
                                      {subservice.items.length === 0 ? (
                                        <div className="text-center py-2 text-gray-500 text-sm italic">
                                          No items found. 
                                          <Button
                                            variant="link"
                                            onClick={() => {
                                              setCurrentParentId(service.id);
                                              setSelectedSubserviceId(subservice.id);
                                              setIsAddItemModalOpen(true);
                                            }}
                                            className="text-admin-primary font-medium"
                                          >
                                            Add one now
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          {subservice.items.map(item => (
                                            <div 
                                              key={item.id} 
                                              className={`p-2 rounded-md ${item.isEditing ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}`}
                                            >
                                              {item.isEditing ? (
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
                                                  <div className="flex items-center gap-2 flex-1">
                                                    <Shirt className="h-4 w-4 text-gray-400" />
                                                    <input
                                                      type="text"
                                                      value={item.name}
                                                      onChange={(e) => updateItemName(service.id, subservice.id, item.id, e.target.value)}
                                                      className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                                                      placeholder="Item name"
                                                    />
                                                  </div>
                                                  <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <Tag className="h-4 w-4 text-gray-400" />
                                                    <div className="relative flex items-center">
                                                      <span className="absolute left-2 text-gray-500">₹</span>
                                                      <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => updateItemPrice(service.id, subservice.id, item.id, e.target.value)}
                                                        className="pl-6 pr-2 py-1 border rounded text-sm w-24 focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                                                        placeholder="Price"
                                                        min="0"
                                                        step="0.01"
                                                      />
                                                    </div>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => saveItemEdit(service.id, subservice.id, item.id)}
                                                      className="text-green-600 hover:text-green-700"
                                                    >
                                                      <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => toggleItemEditMode(service.id, subservice.id, item.id)}
                                                      className="text-gray-500 hover:text-gray-600"
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center">
                                                    <Shirt className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-gray-700">{item.name}</span>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <span className="font-medium text-gray-800">₹{item.price.toFixed(2)}</span>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => toggleItemEditMode(service.id, subservice.id, item.id)}
                                                      className="text-blue-500 hover:text-blue-600"
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleDeleteClick('item', item.id, item.name, service.id, subservice.id)}
                                                      className="text-red-500 hover:text-red-600"
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={executeDelete}
        title={`Delete ${itemToDelete?.type === 'service' ? 'Service' : itemToDelete?.type === 'subservice' ? 'Subservice' : 'Item'}`}
        description={
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.</span>
          </div>
        }
        confirmText="Delete"
        confirmWithTimer={3}
      />

      {/* Add Service Modal */}
      <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Add a new service category. You can add subservices to it later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="serviceName" className="text-sm font-medium">
                Service Name
              </label>
              <input
                id="serviceName"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="e.g., Dry Cleaning, Shoe Laundry"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subservice Modal */}
      <Dialog open={isAddSubserviceModalOpen} onOpenChange={setIsAddSubserviceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Subservice</DialogTitle>
            <DialogDescription>
              Add a new subservice to the selected service category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subserviceName" className="text-sm font-medium">
                Subservice Name
              </label>
              <input
                id="subserviceName"
                value={newSubserviceName}
                onChange={(e) => setNewSubserviceName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="e.g., Wash & Fold, Upper Wear"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="pricePerUnit" className="text-sm font-medium">
                  Price Per Unit (Optional)
                </label>
                <input
                  id="pricePerUnit"
                  value={newSubservicePricePerUnit}
                  onChange={(e) => setNewSubservicePricePerUnit(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g., 59"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="unit" className="text-sm font-medium">
                  Unit (Optional)
                </label>
                <input
                  id="unit"
                  value={newSubserviceUnit}
                  onChange={(e) => setNewSubserviceUnit(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g., per Kg"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubserviceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubservice}>Add Subservice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new clothing item to the selected subservice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="itemName" className="text-sm font-medium">
                Item Name
              </label>
              <input
                id="itemName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="e.g., Shirt, Jeans, Coat"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="itemPrice" className="text-sm font-medium">
                Price (₹)
              </label>
              <input
                id="itemPrice"
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="e.g., 99"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{successMessage.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{successMessage.message}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StudioServices;
