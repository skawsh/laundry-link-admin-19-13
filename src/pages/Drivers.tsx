
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Search, User, Package, Clock, Info, MoreVertical, Phone, Calendar, Truck, UserCog, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StatsCard from '@/components/ui/StatsCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Drivers = () => {
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [driverProfileOpen, setDriverProfileOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<null | {
    name: string;
    totalOrders: number;
    currentTask: string;
    currentOrder: string;
    location: string;
    assignedOrders: string[];
    phone?: string;
    rating?: number;
    joinDate?: string;
    status?: string;
    lastActive?: string;
    email?: string;
    address?: string;
    emergencyContact?: string;
    vehicleInfo?: string;
    licenseNumber?: string;
  }>(null);

  const mockDrivers = [
    {
      id: 1,
      name: 'John Doe',
      status: 'active',
      assignedOrders: ['ORD-1234', 'ORD-5678', 'ORD-9012'],
      currentOrder: 'ORD-1234',
      currentTask: 'pickup',
      location: '1234 Market St, San Francisco, CA',
      phone: '+1 (555) 123-4567',
      totalOrders: 205,
      rating: 4.8,
      lastActive: '2 minutes ago',
      joinDate: 'Jan 15, 2023',
      email: 'john.doe@example.com',
      address: '1234 Market St, San Francisco, CA',
      emergencyContact: '+1 (555) 987-1234',
      vehicleInfo: 'Toyota Corolla (2020), White, License: ABC123',
      licenseNumber: 'DL98765432'
    },
    {
      id: 2,
      name: 'Jane Smith',
      status: 'inactive',
      assignedOrders: ['ORD-3456', 'ORD-7890'],
      currentOrder: 'ORD-3456',
      currentTask: 'deliver',
      location: '567 Mission St, San Francisco, CA',
      phone: '+1 (555) 987-6543',
      totalOrders: 121,
      rating: 4.6,
      lastActive: '1 hour ago',
      joinDate: 'Mar 22, 2023',
      email: 'jane.smith@example.com',
      address: '567 Mission St, San Francisco, CA',
      emergencyContact: '+1 (555) 345-6789',
      vehicleInfo: 'Honda Civic (2019), Silver, License: XYZ789',
      licenseNumber: 'DL12345678'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      status: 'active',
      assignedOrders: ['ORD-2345', 'ORD-6789', 'ORD-0123', 'ORD-4567'],
      currentOrder: 'ORD-2345',
      currentTask: 'collect',
      location: '890 Howard St, San Francisco, CA',
      phone: '+1 (555) 456-7890',
      totalOrders: 298,
      rating: 4.9,
      lastActive: '5 minutes ago',
      joinDate: 'Nov 3, 2022',
      email: 'mike.johnson@example.com',
      address: '890 Howard St, San Francisco, CA',
      emergencyContact: '+1 (555) 678-9012',
      vehicleInfo: 'Ford Focus (2021), Blue, License: DEF456',
      licenseNumber: 'DL56781234'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      status: 'active',
      assignedOrders: ['ORD-8765', 'ORD-4321'],
      currentOrder: 'ORD-8765',
      currentTask: 'drop',
      location: '123 Valencia St, San Francisco, CA',
      phone: '+1 (555) 234-5678',
      totalOrders: 175,
      rating: 4.7,
      lastActive: '15 minutes ago',
      joinDate: 'Feb 8, 2023',
      email: 'sarah.williams@example.com',
      address: '123 Valencia St, San Francisco, CA',
      emergencyContact: '+1 (555) 123-7890',
      vehicleInfo: 'Nissan Altima (2018), Black, License: GHI789',
      licenseNumber: 'DL34567890'
    },
    {
      id: 5,
      name: 'David Lee',
      status: 'active',
      assignedOrders: ['ORD-7654', 'ORD-3210', 'ORD-9876'],
      currentOrder: 'ORD-7654',
      currentTask: 'pickup',
      location: '456 Folsom St, San Francisco, CA',
      phone: '+1 (555) 345-6789',
      totalOrders: 231,
      rating: 4.5,
      lastActive: '30 minutes ago',
      joinDate: 'Apr 12, 2023',
      email: 'david.lee@example.com',
      address: '456 Folsom St, San Francisco, CA',
      emergencyContact: '+1 (555) 456-1234',
      vehicleInfo: 'Hyundai Elantra (2022), Red, License: JKL012',
      licenseNumber: 'DL90123456'
    },
    {
      id: 6,
      name: 'Emily Chen',
      status: 'inactive',
      assignedOrders: [],
      currentOrder: '',
      currentTask: '',
      location: '789 Bryant St, San Francisco, CA',
      phone: '+1 (555) 567-8901',
      totalOrders: 89,
      rating: 4.4,
      lastActive: '2 days ago',
      joinDate: 'May 19, 2023',
      email: 'emily.chen@example.com',
      address: '789 Bryant St, San Francisco, CA',
      emergencyContact: '+1 (555) 789-0123',
      vehicleInfo: 'Toyota Prius (2017), Green, License: MNO345',
      licenseNumber: 'DL78901234'
    },
    {
      id: 7,
      name: 'Robert Taylor',
      status: 'active',
      assignedOrders: ['ORD-5432', 'ORD-1098', 'ORD-7654'],
      currentOrder: 'ORD-5432',
      currentTask: 'deliver',
      location: '321 Harrison St, San Francisco, CA',
      phone: '+1 (555) 678-9012',
      totalOrders: 156,
      rating: 4.9,
      lastActive: '10 minutes ago',
      joinDate: 'Jun 5, 2023',
      email: 'robert.taylor@example.com',
      address: '321 Harrison St, San Francisco, CA',
      emergencyContact: '+1 (555) 890-1234',
      vehicleInfo: 'Honda Accord (2020), White, License: PQR678',
      licenseNumber: 'DL23456789'
    },
    {
      id: 8,
      name: 'Lisa Wang',
      status: 'active',
      assignedOrders: ['ORD-2109', 'ORD-8765'],
      currentOrder: 'ORD-2109',
      currentTask: 'collect',
      location: '654 Brannan St, San Francisco, CA',
      phone: '+1 (555) 789-0123',
      totalOrders: 134,
      rating: 4.6,
      lastActive: '45 minutes ago',
      joinDate: 'Jul 17, 2023',
      email: 'lisa.wang@example.com',
      address: '654 Brannan St, San Francisco, CA',
      emergencyContact: '+1 (555) 012-3456',
      vehicleInfo: 'Mazda 3 (2019), Gray, License: STU901',
      licenseNumber: 'DL67890123'
    },
    {
      id: 9,
      name: 'Michael Brown',
      status: 'inactive',
      assignedOrders: ['ORD-3456'],
      currentOrder: 'ORD-3456',
      currentTask: 'drop',
      location: '987 Townsend St, San Francisco, CA',
      phone: '+1 (555) 890-1234',
      totalOrders: 78,
      rating: 4.3,
      lastActive: '1 day ago',
      joinDate: 'Aug 29, 2023',
      email: 'michael.brown@example.com',
      address: '987 Townsend St, San Francisco, CA',
      emergencyContact: '+1 (555) 234-5678',
      vehicleInfo: 'Kia Forte (2018), Black, License: VWX234',
      licenseNumber: 'DL45678901'
    },
    {
      id: 10,
      name: 'Amanda Garcia',
      status: 'active',
      assignedOrders: ['ORD-6543', 'ORD-2109', 'ORD-7890'],
      currentOrder: 'ORD-6543',
      currentTask: 'pickup',
      location: '210 King St, San Francisco, CA',
      phone: '+1 (555) 012-3456',
      totalOrders: 189,
      rating: 4.8,
      lastActive: '7 minutes ago',
      joinDate: 'Sep 10, 2023',
      email: 'amanda.garcia@example.com',
      address: '210 King St, San Francisco, CA',
      emergencyContact: '+1 (555) 345-6789',
      vehicleInfo: 'Subaru Impreza (2021), Blue, License: YZA567',
      licenseNumber: 'DL89012345'
    }
  ];

  const handleOpenOrderDetails = (driver: any) => {
    setSelectedDriver({
      name: driver.name,
      totalOrders: driver.totalOrders,
      currentTask: driver.currentTask,
      currentOrder: driver.currentOrder,
      location: driver.location,
      assignedOrders: driver.assignedOrders,
      phone: driver.phone,
      rating: driver.rating,
      joinDate: driver.joinDate,
      status: driver.status
    });
    setOrderDetailsOpen(true);
  };

  const handleOpenDriverProfile = (driver: any) => {
    setSelectedDriver(driver);
    setDriverProfileOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search drivers..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button>Add Driver</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard 
            title="Total Drivers"
            value="37"
            icon={<User className="h-5 w-5" />}
            change={{ value: "+3", trend: "up" }}
          />
          <StatsCard 
            title="Active Orders"
            value="19"
            icon={<Package className="h-5 w-5" />}
            change={{ value: "+5", trend: "up" }}
          />
          <StatsCard 
            title="Average Delivery Time"
            value="42 min"
            icon={<Clock className="h-5 w-5" />}
            change={{ value: "-3 min", trend: "up" }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-subtle overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">Last active: {driver.lastActive}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                        {driver.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.assignedOrders.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{driver.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenOrderDetails(driver)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Order Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleOpenDriverProfile(driver)}
                              >
                                <User className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Driver Profile</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center">
                                    <UserCog className="mr-2 h-4 w-4" />
                                    <span>Change Status</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center text-red-600">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    <span>Remove Driver</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>More Actions</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Details for {selectedDriver?.name}'s current assignments
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Current Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Current Order</p>
                  <p className="text-sm font-medium">{selectedDriver?.currentOrder}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Task</p>
                  <p className="text-sm font-medium capitalize">{selectedDriver?.currentTask}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Assigned Orders ({selectedDriver?.assignedOrders.length})
              </h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {selectedDriver?.assignedOrders.map((order, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                    {order}
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Orders</p>
                <p className="text-sm font-medium">{selectedDriver?.totalOrders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Since</p>
                <p className="text-sm font-medium">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {selectedDriver?.joinDate}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={driverProfileOpen} onOpenChange={setDriverProfileOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Driver Profile</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedDriver?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedDriver?.name}</h3>
                <div className="flex items-center mt-1">
                  <Badge variant={selectedDriver?.status === 'active' ? 'default' : 'secondary'} className="mr-2">
                    {selectedDriver?.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-500">Last active: {selectedDriver?.lastActive}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  Phone Number
                </h4>
                <p className="text-sm">{selectedDriver?.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Joined
                </h4>
                <p className="text-sm">{selectedDriver?.joinDate}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
              <p className="text-sm">{selectedDriver?.email}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Home Address</h4>
              <p className="text-sm">{selectedDriver?.address}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Vehicle Information</h4>
              <p className="text-sm">{selectedDriver?.vehicleInfo}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">License Number</h4>
              <p className="text-sm">{selectedDriver?.licenseNumber}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Emergency Contact</h4>
              <p className="text-sm">{selectedDriver?.emergencyContact}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-900">{selectedDriver?.totalOrders}</p>
                <p className="text-xs text-gray-500">Total Orders</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-900">{selectedDriver?.rating} ★</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-900">{selectedDriver?.assignedOrders?.length || 0}</p>
                <p className="text-xs text-gray-500">Current Orders</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Drivers;
