
import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Search, User, Package, Clock, Info, MoreVertical, 
  Phone, Calendar, Truck, UserCog, XCircle, Filter
} from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import DataTable from '@/components/ui/DataTable';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const Drivers = () => {
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [driverProfileOpen, setDriverProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: {
      active: true,
      inactive: true
    },
    orders: {
      any: true,
      none: true,
      multiple: true
    }
  });
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
    },
    {
      id: 11,
      name: 'Daniel Chen',
      status: 'active',
      assignedOrders: ['ORD-9876', 'ORD-5432'],
      currentOrder: 'ORD-9876',
      currentTask: 'deliver',
      location: '123 Main St, San Francisco, CA',
      phone: '+1 (555) 234-5678',
      totalOrders: 157,
      rating: 4.7,
      lastActive: '23 minutes ago',
      joinDate: 'Jan 5, 2023',
      email: 'daniel.chen@example.com',
      address: '123 Main St, San Francisco, CA',
      emergencyContact: '+1 (555) 432-1098',
      vehicleInfo: 'Chevrolet Cruze (2019), Silver, License: BCD123',
      licenseNumber: 'DL12309876'
    },
    {
      id: 12,
      name: 'Rachel Park',
      status: 'active',
      assignedOrders: ['ORD-4321', 'ORD-8765', 'ORD-1234'],
      currentOrder: 'ORD-4321',
      currentTask: 'collect',
      location: '456 Oak St, San Francisco, CA',
      phone: '+1 (555) 876-5432',
      totalOrders: 211,
      rating: 4.9,
      lastActive: '12 minutes ago',
      joinDate: 'Feb 15, 2023',
      email: 'rachel.park@example.com',
      address: '456 Oak St, San Francisco, CA',
      emergencyContact: '+1 (555) 210-9876',
      vehicleInfo: 'Honda Accord (2021), White, License: EFG456',
      licenseNumber: 'DL87654321'
    },
    {
      id: 13,
      name: 'Thomas Wilson',
      status: 'inactive',
      assignedOrders: [],
      currentOrder: '',
      currentTask: '',
      location: '789 Pine St, San Francisco, CA',
      phone: '+1 (555) 543-2109',
      totalOrders: 93,
      rating: 4.2,
      lastActive: '3 days ago',
      joinDate: 'Mar 21, 2023',
      email: 'thomas.wilson@example.com',
      address: '789 Pine St, San Francisco, CA',
      emergencyContact: '+1 (555) 109-8765',
      vehicleInfo: 'Toyota Camry (2018), Black, License: HIJ789',
      licenseNumber: 'DL54321098'
    },
    {
      id: 14,
      name: 'Jessica Kim',
      status: 'active',
      assignedOrders: ['ORD-7890', 'ORD-2345'],
      currentOrder: 'ORD-7890',
      currentTask: 'pickup',
      location: '321 Elm St, San Francisco, CA',
      phone: '+1 (555) 321-0987',
      totalOrders: 178,
      rating: 4.8,
      lastActive: '35 minutes ago',
      joinDate: 'Apr 7, 2023',
      email: 'jessica.kim@example.com',
      address: '321 Elm St, San Francisco, CA',
      emergencyContact: '+1 (555) 098-7654',
      vehicleInfo: 'Nissan Sentra (2020), Red, License: KLM012',
      licenseNumber: 'DL21098765'
    },
    {
      id: 15,
      name: 'James Rodriguez',
      status: 'active',
      assignedOrders: ['ORD-5678', 'ORD-1234', 'ORD-9012'],
      currentOrder: 'ORD-5678',
      currentTask: 'deliver',
      location: '654 Cedar St, San Francisco, CA',
      phone: '+1 (555) 210-9876',
      totalOrders: 224,
      rating: 4.6,
      lastActive: '18 minutes ago',
      joinDate: 'May 12, 2023',
      email: 'james.rodriguez@example.com',
      address: '654 Cedar St, San Francisco, CA',
      emergencyContact: '+1 (555) 987-6543',
      vehicleInfo: 'Hyundai Sonata (2021), Blue, License: NOP345',
      licenseNumber: 'DL65432109'
    },
    {
      id: 16,
      name: 'Sophia Martinez',
      status: 'active',
      assignedOrders: ['ORD-3456'],
      currentOrder: 'ORD-3456',
      currentTask: 'drop',
      location: '987 Maple St, San Francisco, CA',
      phone: '+1 (555) 109-8765',
      totalOrders: 145,
      rating: 4.7,
      lastActive: '40 minutes ago',
      joinDate: 'Jun 18, 2023',
      email: 'sophia.martinez@example.com',
      address: '987 Maple St, San Francisco, CA',
      emergencyContact: '+1 (555) 876-5432',
      vehicleInfo: 'Ford Fusion (2019), Silver, License: QRS678',
      licenseNumber: 'DL43210987'
    },
    {
      id: 17,
      name: 'William Nguyen',
      status: 'inactive',
      assignedOrders: ['ORD-0123'],
      currentOrder: 'ORD-0123',
      currentTask: 'pickup',
      location: '210 Birch St, San Francisco, CA',
      phone: '+1 (555) 098-7654',
      totalOrders: 102,
      rating: 4.4,
      lastActive: '1 day ago',
      joinDate: 'Jul 25, 2023',
      email: 'william.nguyen@example.com',
      address: '210 Birch St, San Francisco, CA',
      emergencyContact: '+1 (555) 765-4321',
      vehicleInfo: 'Chevrolet Malibu (2020), White, License: TUV901',
      licenseNumber: 'DL32109876'
    },
    {
      id: 18,
      name: 'Olivia Jones',
      status: 'active',
      assignedOrders: ['ORD-6789', 'ORD-2345', 'ORD-8765'],
      currentOrder: 'ORD-6789',
      currentTask: 'collect',
      location: '543 Walnut St, San Francisco, CA',
      phone: '+1 (555) 987-6543',
      totalOrders: 192,
      rating: 4.9,
      lastActive: '8 minutes ago',
      joinDate: 'Aug 9, 2023',
      email: 'olivia.jones@example.com',
      address: '543 Walnut St, San Francisco, CA',
      emergencyContact: '+1 (555) 654-3210',
      vehicleInfo: 'Toyota Corolla (2022), Black, License: WXY234',
      licenseNumber: 'DL10987654'
    },
    {
      id: 19,
      name: 'Ethan Kim',
      status: 'active',
      assignedOrders: ['ORD-4567', 'ORD-0123'],
      currentOrder: 'ORD-4567',
      currentTask: 'deliver',
      location: '876 Cherry St, San Francisco, CA',
      phone: '+1 (555) 876-5432',
      totalOrders: 165,
      rating: 4.5,
      lastActive: '25 minutes ago',
      joinDate: 'Sep 14, 2023',
      email: 'ethan.kim@example.com',
      address: '876 Cherry St, San Francisco, CA',
      emergencyContact: '+1 (555) 543-2109',
      vehicleInfo: 'Honda Civic (2021), Red, License: ZAB567',
      licenseNumber: 'DL09876543'
    },
    {
      id: 20,
      name: 'Ava Thomas',
      status: 'active',
      assignedOrders: ['ORD-9012', 'ORD-5678', 'ORD-1234'],
      currentOrder: 'ORD-9012',
      currentTask: 'drop',
      location: '109 Spruce St, San Francisco, CA',
      phone: '+1 (555) 765-4321',
      totalOrders: 208,
      rating: 4.8,
      lastActive: '15 minutes ago',
      joinDate: 'Oct 22, 2023',
      email: 'ava.thomas@example.com',
      address: '109 Spruce St, San Francisco, CA',
      emergencyContact: '+1 (555) 432-1098',
      vehicleInfo: 'Mazda 6 (2020), Silver, License: CDE890',
      licenseNumber: 'DL98765432'
    }
  ];

  const filteredDrivers = useMemo(() => {
    return mockDrivers.filter(driver => {
      // Filter by search query
      if (searchQuery && searchQuery.length > 0) {
        const nameMatch = driver.name.toLowerCase().includes(searchQuery.toLowerCase());
        const phoneMatch = driver.phone.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = driver.email.toLowerCase().includes(searchQuery.toLowerCase());
        if (!nameMatch && !phoneMatch && !emailMatch) return false;
      }
      
      // Filter by status
      if (!filters.status[driver.status as 'active' | 'inactive']) return false;
      
      // Filter by orders
      if (driver.assignedOrders.length === 0 && !filters.orders.none) return false;
      if (driver.assignedOrders.length === 1 && !filters.orders.any) return false;
      if (driver.assignedOrders.length > 1 && !filters.orders.multiple) return false;
      
      return true;
    });
  }, [mockDrivers, searchQuery, filters]);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
              />
              {searchQuery.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="py-1 text-sm text-gray-700 max-h-60 overflow-auto">
                    {mockDrivers
                      .filter(driver => 
                        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        driver.phone.includes(searchQuery) ||
                        driver.email.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((driver) => (
                        <li 
                          key={driver.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setSearchQuery(driver.name)}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">{driver.name}</span>
                            <span className="ml-2 text-gray-500 text-xs">{driver.phone}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter Drivers</h3>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status-active" 
                          checked={filters.status.active}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              status: {...prev.status, active: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="status-active" className="text-sm">
                          Active
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status-inactive" 
                          checked={filters.status.inactive}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              status: {...prev.status, inactive: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="status-inactive" className="text-sm">
                          Inactive
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Assigned Orders</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="orders-any" 
                          checked={filters.orders.any}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              orders: {...prev.orders, any: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="orders-any" className="text-sm">
                          With any orders
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="orders-multiple" 
                          checked={filters.orders.multiple}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              orders: {...prev.orders, multiple: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="orders-multiple" className="text-sm">
                          With multiple orders
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="orders-none" 
                          checked={filters.orders.none}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              orders: {...prev.orders, none: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="orders-none" className="text-sm">
                          No orders
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setFilters({
                        status: { active: true, inactive: true },
                        orders: { any: true, none: true, multiple: true }
                      })}
                    >
                      Reset
                    </Button>
                    <Button onClick={() => setFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
                {filteredDrivers.map((driver) => (
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
