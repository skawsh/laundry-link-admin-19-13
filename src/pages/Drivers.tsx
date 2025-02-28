
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Search, User, Package, Clock, Info, MapPin, Calendar, Truck } from 'lucide-react';
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

const Drivers = () => {
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<null | {
    name: string;
    totalOrders: number;
    currentTask: string;
    currentOrder: string;
    location: string;
    assignedOrders: string[];
  }>(null);

  const mockDrivers = [
    {
      id: 1,
      name: 'John Doe',
      status: 'active',
      completedOrders: 143,
      assignedOrders: ['ORD-1234', 'ORD-5678', 'ORD-9012'],
      currentOrder: 'ORD-1234',
      currentTask: 'pickup',
      location: '1234 Market St, San Francisco, CA',
      phone: '+1 (555) 123-4567',
      totalOrders: 205,
      rating: 4.8,
      lastActive: '2 minutes ago',
      joinDate: 'Jan 15, 2023'
    },
    {
      id: 2,
      name: 'Jane Smith',
      status: 'inactive',
      completedOrders: 98,
      assignedOrders: ['ORD-3456', 'ORD-7890'],
      currentOrder: 'ORD-3456',
      currentTask: 'deliver',
      location: '567 Mission St, San Francisco, CA',
      phone: '+1 (555) 987-6543',
      totalOrders: 121,
      rating: 4.6,
      lastActive: '1 hour ago',
      joinDate: 'Mar 22, 2023'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      status: 'active',
      completedOrders: 211,
      assignedOrders: ['ORD-2345', 'ORD-6789', 'ORD-0123', 'ORD-4567'],
      currentOrder: 'ORD-2345',
      currentTask: 'collect',
      location: '890 Howard St, San Francisco, CA',
      phone: '+1 (555) 456-7890',
      totalOrders: 298,
      rating: 4.9,
      lastActive: '5 minutes ago',
      joinDate: 'Nov 3, 2022'
    }
  ];

  const handleOpenOrderDetails = (driver: any) => {
    setSelectedDriver({
      name: driver.name,
      totalOrders: driver.totalOrders,
      currentTask: driver.currentTask,
      currentOrder: driver.currentOrder,
      location: driver.location,
      assignedOrders: driver.assignedOrders
    });
    setOrderDetailsOpen(true);
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
                    Completed Orders
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
                      {driver.completedOrders}
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
                              <Button size="sm" variant="outline">
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Track Location</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline">
                                <User className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Driver Profile</p>
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
                <MapPin className="h-4 w-4 mr-2" />
                Current Location
              </h3>
              <p className="text-sm text-gray-600">{selectedDriver?.location}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Assigned Orders
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
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
                  {mockDrivers.find(d => d.name === selectedDriver?.name)?.joinDate}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Drivers;
