
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, ArrowLeft, ChevronDown, ChevronUp, Search, X, Save } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define interfaces for services data
interface ClothingItem {
  id: string;
  name: string;
  standardPrice: number;
  expressPrice?: number;
}

interface SubService {
  id: string;
  name: string;
  pricePerUnit?: number;
  priceUnit?: string;
  clothingItems: ClothingItem[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

interface Service {
  id: string;
  title: string;
  description?: string;
  subServices: SubService[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

interface StudioServices {
  studioId: string;
  studioName: string;
  services: Service[];
}

// Form schemas
const clothingItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  standardPrice: z.coerce.number().min(1, "Price must be at least 1"),
  expressPrice: z.coerce.number().optional(),
});

const subServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  pricePerUnit: z.coerce.number().optional(),
  priceUnit: z.string().optional(),
  clothingItems: z.array(clothingItemSchema).optional(),
});

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
});

// Mock data for services based on the provided structure
const mockServicesData: {[key: string]: StudioServices} = {
  "1": {
    studioId: "STU10001",
    studioName: "Saiteja Laundry",
    services: [
      {
        id: "serv1",
        title: "Core Laundry Services",
        description: "Basic washing and ironing services",
        subServices: [
          {
            id: "sub1",
            name: "Wash & Fold",
            pricePerUnit: 59,
            priceUnit: "Per Kg",
            clothingItems: [
              { id: "item1", name: "T-Shirt", standardPrice: 29, expressPrice: 40 },
              { id: "item2", name: "Trousers", standardPrice: 39, expressPrice: 59 },
              { id: "item3", name: "Shorts", standardPrice: 29, expressPrice: 45 }
            ],
          },
          {
            id: "sub2",
            name: "Premium Wash",
            pricePerUnit: 89,
            priceUnit: "Per Kg",
            clothingItems: [
              { id: "item4", name: "Formal Shirt", standardPrice: 35, expressPrice: 55 },
              { id: "item5", name: "Formal Trousers", standardPrice: 45, expressPrice: 65 }
            ],
          }
        ],
      },
      {
        id: "serv2",
        title: "Shoe Laundry",
        description: "Specialized cleaning for all types of footwear",
        subServices: [
          {
            id: "sub3",
            name: "Regular Shoes",
            clothingItems: [
              { id: "item6", name: "Casual Shoes", standardPrice: 149, expressPrice: 199 },
              { id: "item7", name: "Sports Shoes", standardPrice: 179, expressPrice: 249 }
            ],
          },
          {
            id: "sub4",
            name: "Premium Footwear",
            clothingItems: [
              { id: "item8", name: "Leather Shoes", standardPrice: 249, expressPrice: 349 },
              { id: "item9", name: "Boots", standardPrice: 299, expressPrice: 399 }
            ],
          }
        ],
      },
      {
        id: "serv3",
        title: "Dry Cleaning",
        description: "Professional dry cleaning services",
        subServices: [
          {
            id: "sub5",
            name: "Indian Ethnic Wear",
            clothingItems: [
              { id: "item10", name: "Saree", standardPrice: 249, expressPrice: 349 },
              { id: "item11", name: "Kurta", standardPrice: 149, expressPrice: 249 }
            ],
          },
          {
            id: "sub6",
            name: "Western Wear",
            clothingItems: [
              { id: "item12", name: "Coat", standardPrice: 349, expressPrice: 449 },
              { id: "item13", name: "Blazer", standardPrice: 299, expressPrice: 399 }
            ],
          }
        ],
      }
    ]
  },
  "2": {
    studioId: "STU10002",
    studioName: "Sparkle Clean Laundry",
    services: [
      {
        id: "serv1",
        title: "Core Laundry Services",
        description: "Basic washing and ironing services",
        subServices: [
          {
            id: "sub1",
            name: "Wash & Fold",
            pricePerUnit: 65,
            priceUnit: "Per Kg",
            clothingItems: [
              { id: "item1", name: "T-Shirt", standardPrice: 30, expressPrice: 45 },
              { id: "item2", name: "Trousers", standardPrice: 40, expressPrice: 60 }
            ],
          }
        ],
      }
    ]
  }
};

// For other studio IDs, we can provide default mock data
for (let i = 3; i <= 8; i++) {
  mockServicesData[i.toString()] = {
    studioId: `STU1000${i}`,
    studioName: `Studio ${i}`,
    services: [
      {
        id: "serv1",
        title: "Core Laundry Services",
        description: "Basic washing and ironing services",
        subServices: [
          {
            id: "sub1",
            name: "Wash & Fold",
            pricePerUnit: 60 + i,
            priceUnit: "Per Kg",
            clothingItems: [
              { id: "item1", name: "T-Shirt", standardPrice: 25 + i, expressPrice: 40 + i },
              { id: "item2", name: "Trousers", standardPrice: 35 + i, expressPrice: 55 + i }
            ],
          }
        ],
      }
    ]
  };
}

const StudioServices: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [loading, setLoading] = useState(true);
  const [studioServices, setStudioServices] = useState<StudioServices | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("view");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null);
  const [editingClothingItem, setEditingClothingItem] = useState<ClothingItem | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const serviceForm = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const subServiceForm = useForm<z.infer<typeof subServiceSchema>>({
    resolver: zodResolver(subServiceSchema),
    defaultValues: {
      name: "",
      pricePerUnit: undefined,
      priceUnit: "",
    },
  });

  const clothingItemForm = useForm<z.infer<typeof clothingItemSchema>>({
    resolver: zodResolver(clothingItemSchema),
    defaultValues: {
      name: "",
      standardPrice: 0,
      expressPrice: undefined,
    },
  });

  useEffect(() => {
    // Simulate API call to fetch studio services
    const fetchStudioServices = () => {
      setLoading(true);
      
      // Artificial delay to simulate API call
      setTimeout(() => {
        if (studioId && mockServicesData[studioId]) {
          const data = JSON.parse(JSON.stringify(mockServicesData[studioId]));
          
          // Initialize expansion state
          data.services.forEach((service: Service) => {
            service.isExpanded = false;
            service.subServices.forEach((subService: SubService) => {
              subService.isExpanded = false;
            });
          });
          
          setStudioServices(data);
        } else {
          toast({
            title: "Error",
            description: "Studio services not found",
            variant: "destructive",
          });
        }
        setLoading(false);
      }, 800);
    };

    fetchStudioServices();
  }, [studioId, toast]);

  const handleBackClick = () => {
    navigate('/studios');
  };

  const toggleServiceExpansion = (serviceId: string) => {
    if (!studioServices) return;
    
    const updatedServices = studioServices.services.map(service => {
      if (service.id === serviceId) {
        return { ...service, isExpanded: !service.isExpanded };
      }
      return service;
    });
    
    setStudioServices({
      ...studioServices,
      services: updatedServices
    });
  };

  const toggleSubServiceExpansion = (serviceId: string, subServiceId: string) => {
    if (!studioServices) return;
    
    const updatedServices = studioServices.services.map(service => {
      if (service.id === serviceId) {
        const updatedSubServices = service.subServices.map(subService => {
          if (subService.id === subServiceId) {
            return { ...subService, isExpanded: !subService.isExpanded };
          }
          return subService;
        });
        
        return { ...service, subServices: updatedSubServices };
      }
      return service;
    });
    
    setStudioServices({
      ...studioServices,
      services: updatedServices
    });
  };

  const handleAddNewService = () => {
    serviceForm.reset({
      title: "",
      description: "",
    });
    setEditingService({
      id: `new-service-${Date.now()}`,
      title: "",
      description: "",
      subServices: [],
      isEditing: true,
    });
  };

  const handleAddSubService = (serviceId: string) => {
    subServiceForm.reset({
      name: "",
      pricePerUnit: undefined,
      priceUnit: "",
    });
    
    setEditingSubService({
      id: `new-subservice-${Date.now()}`,
      name: "",
      clothingItems: [],
      isEditing: true,
    });
    
    // Find the service to add the subservice to
    const service = studioServices?.services.find(s => s.id === serviceId);
    if (service) {
      setEditingService(service);
    }
  };

  const handleAddClothingItem = (serviceId: string, subServiceId: string) => {
    clothingItemForm.reset({
      name: "",
      standardPrice: 0,
      expressPrice: undefined,
    });
    
    setEditingClothingItem({
      id: `new-clothing-${Date.now()}`,
      name: "",
      standardPrice: 0,
    });
    
    // Find the service and subservice to add the clothing item to
    const service = studioServices?.services.find(s => s.id === serviceId);
    if (service) {
      const subService = service.subServices.find(ss => ss.id === subServiceId);
      if (subService) {
        setEditingSubService(subService);
        setEditingService(service);
      }
    }
  };

  const handleEditService = (service: Service) => {
    serviceForm.reset({
      title: service.title,
      description: service.description || "",
    });
    setEditingService(service);
  };

  const handleEditSubService = (service: Service, subService: SubService) => {
    subServiceForm.reset({
      name: subService.name,
      pricePerUnit: subService.pricePerUnit,
      priceUnit: subService.priceUnit || "",
    });
    setEditingSubService(subService);
    setEditingService(service);
  };

  const handleEditClothingItem = (service: Service, subService: SubService, item: ClothingItem) => {
    clothingItemForm.reset({
      name: item.name,
      standardPrice: item.standardPrice,
      expressPrice: item.expressPrice,
    });
    setEditingClothingItem(item);
    setEditingSubService(subService);
    setEditingService(service);
  };

  const handleDeleteService = (serviceId: string) => {
    if (!studioServices) return;
    
    const updatedServices = studioServices.services.filter(service => service.id !== serviceId);
    
    setStudioServices({
      ...studioServices,
      services: updatedServices
    });
    
    toast({
      title: "Service Deleted",
      description: "The service has been removed successfully.",
    });
  };

  const handleDeleteSubService = (serviceId: string, subServiceId: string) => {
    if (!studioServices) return;
    
    const updatedServices = studioServices.services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          subServices: service.subServices.filter(subService => subService.id !== subServiceId)
        };
      }
      return service;
    });
    
    setStudioServices({
      ...studioServices,
      services: updatedServices
    });
    
    toast({
      title: "Subservice Deleted",
      description: "The subservice has been removed successfully.",
    });
  };

  const handleDeleteClothingItem = (serviceId: string, subServiceId: string, itemId: string) => {
    if (!studioServices) return;
    
    const updatedServices = studioServices.services.map(service => {
      if (service.id === serviceId) {
        const updatedSubServices = service.subServices.map(subService => {
          if (subService.id === subServiceId) {
            return {
              ...subService,
              clothingItems: subService.clothingItems.filter(item => item.id !== itemId)
            };
          }
          return subService;
        });
        
        return { ...service, subServices: updatedSubServices };
      }
      return service;
    });
    
    setStudioServices({
      ...studioServices,
      services: updatedServices
    });
    
    toast({
      title: "Item Deleted",
      description: "The clothing item has been removed successfully.",
    });
  };

  const saveService = (serviceData: z.infer<typeof serviceSchema>) => {
    if (!studioServices) return;
    
    if (editingService) {
      const isNew = editingService.id.startsWith('new-service');
      
      if (isNew) {
        // Add new service
        const newService: Service = {
          id: `serv-${Date.now()}`,
          title: serviceData.title,
          description: serviceData.description,
          subServices: [],
          isExpanded: true,
        };
        
        setStudioServices({
          ...studioServices,
          services: [...studioServices.services, newService]
        });
      } else {
        // Update existing service
        const updatedServices = studioServices.services.map(service => {
          if (service.id === editingService.id) {
            return {
              ...service,
              title: serviceData.title,
              description: serviceData.description,
            };
          }
          return service;
        });
        
        setStudioServices({
          ...studioServices,
          services: updatedServices
        });
      }
      
      setEditingService(null);
      toast({
        title: "Service Saved",
        description: isNew ? "New service added successfully." : "Service updated successfully.",
      });
    }
  };

  const saveSubService = (subServiceData: z.infer<typeof subServiceSchema>) => {
    if (!studioServices || !editingService) return;
    
    const isNew = editingSubService?.id.startsWith('new-subservice');
    
    const updatedServices = studioServices.services.map(service => {
      if (service.id === editingService.id) {
        let updatedSubServices;
        
        if (isNew) {
          // Add new subservice
          const newSubService: SubService = {
            id: `sub-${Date.now()}`,
            name: subServiceData.name,
            pricePerUnit: subServiceData.pricePerUnit,
            priceUnit: subServiceData.priceUnit,
            clothingItems: [],
            isExpanded: true,
          };
          
          updatedSubServices = [...service.subServices, newSubService];
        } else {
          // Update existing subservice
          updatedSubServices = service.subServices.map(subService => {
            if (subService.id === editingSubService?.id) {
              return {
                ...subService,
                name: subServiceData.name,
                pricePerUnit: subServiceData.pricePerUnit,
                priceUnit: subServiceData.priceUnit,
              };
            }
            return subService;
          });
        }
        
        return { ...service, subServices: updatedSubServices };
      }
      return service;
    });
    
    setStudioServices({
      ...studioServices,
      services: updatedServices
    });
    
    setEditingSubService(null);
    toast({
      title: "Subservice Saved",
      description: isNew ? "New subservice added successfully." : "Subservice updated successfully.",
    });
  };

  const saveClothingItem = (itemData: z.infer<typeof clothingItemSchema>) => {
    if (!studioServices || !editingService || !editingSubService) return;
    
    const isNew = editingClothingItem?.id.startsWith('new-clothing');
    
    const updatedServices = studioServices.services.map(service => {
      if (service.id === editingService.id) {
        const updatedSubServices = service.subServices.map(subService => {
          if (subService.id === editingSubService.id) {
            let updatedItems;
            
            if (isNew) {
              // Add new clothing item
              const newItem: ClothingItem = {
                id: `item-${Date.now()}`,
                name: itemData.name,
                standardPrice: itemData.standardPrice,
                expressPrice: itemData.expressPrice,
              };
              
              updatedItems = [...subService.clothingItems, newItem];
            } else {
              // Update existing clothing item
              updatedItems = subService.clothingItems.map(item => {
                if (item.id === editingClothingItem?.id) {
                  return {
                    ...item,
                    name: itemData.name,
                    standardPrice: itemData.standardPrice,
                    expressPrice: itemData.expressPrice,
                  };
                }
                return item;
              });
            }
            
            return { ...subService, clothingItems: updatedItems };
          }
          return subService;
        });
        
        return { ...service, subServices: updatedSubServices };
      }
      return service;
    });
    
    setStudioServices({
      ...studioServices,
      services: updatedServices
    });
    
    setEditingClothingItem(null);
    toast({
      title: "Clothing Item Saved",
      description: isNew ? "New clothing item added successfully." : "Clothing item updated successfully.",
    });
  };

  // Filter services based on search term
  const filteredServices = studioServices?.services.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check if service title or description matches
    if (service.title.toLowerCase().includes(searchLower) || 
        (service.description && service.description.toLowerCase().includes(searchLower))) {
      return true;
    }
    
    // Check if any subservice matches
    const subServiceMatch = service.subServices.some(subService => {
      if (subService.name.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Check if any clothing item matches
      return subService.clothingItems.some(item => 
        item.name.toLowerCase().includes(searchLower)
      );
    });
    
    return subServiceMatch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!studioServices) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Studio services not found</h2>
          <Button onClick={handleBackClick} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Studios
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader 
        title={`${studioServices.studioName} Services`}
        subtitle={`Manage services for ${studioServices.studioName} (ID: ${studioServices.studioId})`}
        backButton={
          <Button variant="outline" size="sm" onClick={handleBackClick} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        }
      >
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-2 top-2.5"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <Button className="bg-admin-primary text-white" onClick={handleAddNewService}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="view" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="w-full max-w-xs mb-6">
          <TabsTrigger value="view" className="flex-1">View Services</TabsTrigger>
          <TabsTrigger value="edit" className="flex-1">Edit Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-6">
          {filteredServices && filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardHeader 
                  className="bg-white pb-2 cursor-pointer"
                  onClick={() => toggleServiceExpansion(service.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">{service.title}</CardTitle>
                      {service.description && (
                        <CardDescription className="text-sm text-gray-500">{service.description}</CardDescription>
                      )}
                    </div>
                    {service.isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                
                {service.isExpanded && (
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {service.subServices.map((subService) => (
                        <div key={subService.id} className="border rounded-md">
                          <div 
                            className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                            onClick={() => toggleSubServiceExpansion(service.id, subService.id)}
                          >
                            <div className="flex items-center">
                              <h3 className="text-md font-medium">{subService.name}</h3>
                              {subService.pricePerUnit && (
                                <span className="ml-2 text-sm text-gray-500">
                                  (₹{subService.pricePerUnit} {subService.priceUnit})
                                </span>
                              )}
                            </div>
                            {subService.isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          
                          {subService.isExpanded && (
                            <div className="p-3">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-100">
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Standard Price (₹)</TableHead>
                                    <TableHead className="text-right">Express Price (₹)</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {subService.clothingItems.map((item) => (
                                    <TableRow key={item.id} className="border-b border-gray-100">
                                      <TableCell className="font-medium">{item.name}</TableCell>
                                      <TableCell className="text-right">{item.standardPrice}</TableCell>
                                      <TableCell className="text-right">{item.expressPrice || "-"}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-gray-50">
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No services match your search criteria." : "No services available for this studio."}
              </p>
              <Button onClick={handleAddNewService}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="edit" className="space-y-6">
          {/* Service Edit Form */}
          {editingService && (
            <Card className="mb-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingService.id.startsWith('new-service') ? "Add New Service" : "Edit Service"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...serviceForm}>
                  <form onSubmit={serviceForm.handleSubmit(saveService)} className="space-y-4">
                    <FormField
                      control={serviceForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter service title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={serviceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter service description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingService(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Service
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {/* SubService Edit Form */}
          {editingSubService && editingService && (
            <Card className="mb-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingSubService.id.startsWith('new-subservice') ? "Add New Subservice" : "Edit Subservice"}
                </CardTitle>
                <CardDescription>
                  For service: {editingService.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...subServiceForm}>
                  <form onSubmit={subServiceForm.handleSubmit(saveSubService)} className="space-y-4">
                    <FormField
                      control={subServiceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subservice Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter subservice name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={subServiceForm.control}
                        name="pricePerUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Per Unit (Optional)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={subServiceForm.control}
                        name="priceUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Unit (Optional)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Per Kg">Per Kg</SelectItem>
                                <SelectItem value="Per Unit">Per Unit</SelectItem>
                                <SelectItem value="Per Sq Ft">Per Sq Ft</SelectItem>
                                <SelectItem value="Per Pair">Per Pair</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingSubService(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Subservice
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {/* Clothing Item Edit Form */}
          {editingClothingItem && editingSubService && editingService && (
            <Card className="mb-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingClothingItem.id.startsWith('new-clothing') ? "Add New Clothing Item" : "Edit Clothing Item"}
                </CardTitle>
                <CardDescription>
                  For {editingService.title} / {editingSubService.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...clothingItemForm}>
                  <form onSubmit={clothingItemForm.handleSubmit(saveClothingItem)} className="space-y-4">
                    <FormField
                      control={clothingItemForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={clothingItemForm.control}
                        name="standardPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Standard Price (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={clothingItemForm.control}
                        name="expressPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Express Price (₹) (Optional)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingClothingItem(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Item
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {/* Services List for Editing */}
          <div className="space-y-6">
            {filteredServices && filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="bg-white pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">{service.title}</CardTitle>
                        {service.description && (
                          <CardDescription className="text-sm text-gray-500">{service.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddSubService(service.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Subservice
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500" 
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {service.subServices.map((subService) => (
                        <div key={subService.id} className="border rounded-md">
                          <div className="flex justify-between items-center p-3 bg-gray-50">
                            <div className="flex items-center">
                              <h3 className="text-md font-medium">{subService.name}</h3>
                              {subService.pricePerUnit && (
                                <span className="ml-2 text-sm text-gray-500">
                                  (₹{subService.pricePerUnit} {subService.priceUnit})
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleAddClothingItem(service.id, subService.id)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Item
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditSubService(service, subService)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500" 
                                onClick={() => handleDeleteSubService(service.id, subService.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-3">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-100">
                                  <TableHead>Item</TableHead>
                                  <TableHead className="text-right">Standard Price (₹)</TableHead>
                                  <TableHead className="text-right">Express Price (₹)</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subService.clothingItems.map((item) => (
                                  <TableRow key={item.id} className="border-b border-gray-100">
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-right">{item.standardPrice}</TableCell>
                                    <TableCell className="text-right">{item.expressPrice || "-"}</TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => handleEditClothingItem(service, subService, item)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="text-red-500" 
                                          onClick={() => handleDeleteClothingItem(service.id, subService.id, item.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-gray-50">
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "No services match your search criteria." : "No services available for this studio."}
                </p>
                <Button onClick={handleAddNewService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Service
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default StudioServices;

