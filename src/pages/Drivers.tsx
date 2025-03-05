import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Search, User, Package, Clock, Info, MoreHorizontal,
  Phone, Calendar, Truck, UserCog, XCircle, Filter,
  Users, CheckCircle2, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
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
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getAssignedOrdersForDriver, getDriverAssignments } from '@/store/driverAssignmentStore';

interface MockOrder {
  id: string;
  driver: string;
  status: string;
  customer: string;
  address: string;
}

interface DriverOrderDisplay extends MockOrder {
  phoneNumber?: string;
  date?: string;
}

const Drivers = () => {
  const navigate = useNavigate();
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
    id?: number;
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
    email?: string;
    address?: string;
    emergencyContact?: string;
    vehicleInfo?: string;
    licenseNumber?: string;
  }>(null);

  const [mockDrivers, setMockDrivers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@example.com",
      status: "active",
      totalOrders: 156,
      currentTask: "delivering",
      currentOrder: "ORD-7890",
      assignedOrders: ["ORD-7890", "ORD-7891"],
      location: "Gachibowli, Hyderabad",
      rating: 4.8,
      joinDate: "12 Jan 2023",
      address: "123 Jubilee Hills, Hyderabad",
      emergencyContact: "+91 87654 32109 (Brother)",
      vehicleInfo: "Hero Splendor Plus (TS 01 AB 1234)",
      licenseNumber: "DLHYD20230987654"
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya.sharma@example.com",
      status: "active",
      totalOrders: 143,
      currentTask: "idle",
      currentOrder: "",
      assignedOrders: [],
      location: "Madhapur, Hyderabad",
      rating: 4.9,
      joinDate: "05 Mar 2023",
      address: "456 KPHB Colony, Hyderabad",
      emergencyContact: "+91 76543 21098 (Husband)",
      vehicleInfo: "TVS XL (TS 02 CD 5678)",
      licenseNumber: "DLHYD20239876543"
    },
    {
      id: 3,
      name: "Vikram Singh",
      phone: "+91 76543 21098",
      email: "vikram.singh@example.com",
      status: "inactive",
      totalOrders: 87,
      currentTask: "off-duty",
      currentOrder: "",
      assignedOrders: [],
      location: "Kondapur, Hyderabad",
      rating: 4.5,
      joinDate: "18 May 2023",
      address: "789 Miyapur, Hyderabad",
      emergencyContact: "+91 65432 10987 (Wife)",
      vehicleInfo: "Bajaj Pulsar (TS 03 EF 9012)",
      licenseNumber: "DLHYD20238765432"
    },
    {
      id: 4,
      name: "Ananya Patel",
      phone: "+91 65432 10987",
      email: "ananya.patel@example.com",
      status: "active",
      totalOrders: 112,
      currentTask: "delivering",
      currentOrder: "ORD-7892",
      assignedOrders: ["ORD-7892", "ORD-7893"],
      location: "Kukatpally, Hyderabad",
      rating: 4.7,
      joinDate: "23 Jul 2023",
      address: "101 ECIL, Hyderabad",
      emergencyContact: "+91 54321 09876 (Father)",
      vehicleInfo: "Honda Activa (TS 04 GH 3456)",
      licenseNumber: "DLHYD20237654321"
    },
    {
      id: 5,
      name: "Sanjay Reddy",
      phone: "+91 54321 09876",
      email: "sanjay.reddy@example.com",
      status: "active",
      totalOrders: 78,
      currentTask: "idle",
      currentOrder: "",
      assignedOrders: [],
      location: "Secunderabad, Hyderabad",
      rating: 4.6,
      joinDate: "09 Sep 2023",
      address: "222 Uppal, Hyderabad",
      emergencyContact: "+91 43210 98765 (Mother)",
      vehicleInfo: "Bajaj Chetak (TS 05 IJ 7890)",
      licenseNumber: "DLHYD20236543210"
    },
    {
      id: 6,
      name: "Meera Joshi",
      phone: "+91 43210 98765",
      email: "meera.joshi@example.com",
      status: "inactive",
      totalOrders: 45,
      currentTask: "off-duty",
      currentOrder: "",
      assignedOrders: [],
      location: "Banjara Hills, Hyderabad",
      rating: 4.4,
      joinDate: "14 Nov 2023",
      address: "333 Manikonda, Hyderabad",
      emergencyContact: "+91 32109 87654 (Sister)",
      vehicleInfo: "Hero Pleasure (TS 06 KL 1234)",
      licenseNumber: "DLHYD20235432109"
    }
  ]);

  const mockOrders = useMemo(() => [
    {
      id: "ORD-7890",
      driver: "Rajesh Kumar",
      status: "in_delivery",
      customer: "Aditya Mehta",
      address: "504, Cyber Towers, Hitech City, Hyderabad"
    },
    {
      id: "ORD-7891",
      driver: "Rajesh Kumar",
      status: "picked_up",
      customer: "Kavita Reddy",
      address: "201, Devi Homes, Madhapur, Hyderabad"
    },
    {
      id: "ORD-7892",
      driver: "Ananya Patel",
      status: "in_delivery",
      customer: "Ravi Teja",
      address: "302, Sri Apartments, Jubilee Hills, Hyderabad"
    },
    {
      id: "ORD-7893",
      driver: "Ananya Patel",
      status: "picked_up",
      customer: "Sunita Sharma",
      address: "123, Lake View Apartments, Kondapur, Hyderabad"
    }
  ], []);

  const toggleDriverStatus = (driverId: number) => {
    setMockDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === driverId ? { ...driver, status: driver.status === 'active' ? 'inactive' : 'active' } : driver
      )
    );
    toast({
      title: "Driver status updated.",
      description: `Driver ${driverId} status has been updated.`,
    })
  };

  const handleActionMenuItem = (action: string, driverId: number) => {
    if (action === 'viewProfile') {
      const driver = mockDrivers.find(d => d.id === driverId);
      if (driver) {
        handleOpenDriverProfile(driver);
      }
    } else if (action === 'viewOrders') {
      const driver = mockDrivers.find(d => d.id === driverId);
      if (driver) {
        handleOpenOrderDetails(driver);
      }
    } else if (action === 'changeStatus') {
      toggleDriverStatus(driverId);
    } else if (action === 'removeDriver') {
      setMockDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== driverId));
      toast({
        title: "Driver removed.",
        description: `Driver ${driverId} has been removed.`,
      })
    }
  };

  const filteredDrivers = useMemo(() => {
    return mockDrivers.filter(driver => {
      if (searchQuery && searchQuery.length > 0) {
        const nameMatch = driver.name.toLowerCase().includes(searchQuery.toLowerCase());
        const phoneMatch = driver.phone.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = driver.email.toLowerCase().includes(searchQuery.toLowerCase());
        if (!nameMatch && !phoneMatch && !emailMatch) return false;
      }
      
      if (!filters.status[driver.status as 'active' | 'inactive']) return false;
      
      if (driver.assignedOrders.length === 0 && !filters.orders.none) return false;
      if (driver.assignedOrders.length === 1 && !filters.orders.any) return false;
      if (driver.assignedOrders.length > 1 && !filters.orders.multiple) return false;
      
      return true;
    });
  }, [mockDrivers, searchQuery, filters]);

  const handleOpenOrderDetails = (driver: any) => {
    setSelectedDriver({
      id: driver.id,
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

  const activeDriversCount = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'active').length;
  }, [mockDrivers]);

  const inactiveDriversCount = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'inactive').length;
  }, [mockDrivers]);
  
  const totalDriversCount = useMemo(() => {
    return activeDriversCount + inactiveDriversCount;
  }, [activeDriversCount, inactiveDriversCount]);

  const [driverOrderAssignments, setDriverOrderAssignments] = useState<any[]>();
  
  useEffect(() => {
    const storeAssignments = getDriverAssignments();
    
    const formattedAssignments = storeAssignments.map(assignment => {
      const mockDriver = mockDrivers.find(d => d.id.toString() === assignment.driverId) || {
        id: parseInt(assignment.driverId),
        name: assignment.driverName,
        phone: "N/A",
        email: `${assignment.driverName.toLowerCase().replace(' ', '.')}@example.com`,
        status: "active",
        totalOrders: assignment.orders.length,
        currentTask: assignment.orders.length > 0 ? "delivering" : "idle",
        currentOrder: assignment.orders.length > 0 ? assignment.orders[0].id : "",
        assignedOrders: assignment.orders.map((o: any) => o.id),
        location: "Unknown",
        rating: 4.5,
        joinDate: "Unknown",
      };
      
      return {
        ...mockDriver,
        ordersAssigned: assignment.orders.length,
        assignedOrdersDetails: assignment.orders
      };
    });
    
    const mockAssignments = driverOrderAssignments.filter(driver => 
      !formattedAssignments.some(a => a.id.toString() === driver.id.toString())
    );
    
    setDriverOrderAssignments([...formattedAssignments, ...mockAssignments]);
  }, [mockDrivers]);

  const getDriverOrderAssignments = useMemo(() => {
    const assignments = mockDrivers.map(driver => {
      const ordersAssigned = mockOrders.filter(order => 
        order.driver === driver.name
      ).length;
      
      const storeOrders = getAssignedOrdersForDriver(driver.id.toString());
      const totalOrdersAssigned = ordersAssigned + storeOrders.length;
      
      return {
        ...driver,
        ordersAssigned: totalOrdersAssigned,
        assignedOrdersDetails: [
          ...mockOrders.filter(order => order.driver === driver.name),
          ...storeOrders.map(order => ({
            id: order.id,
            driver: driver.name,
            status: order.status,
            customer: order.customer,
            address: order.address,
            phoneNumber: order.phoneNumber,
            date: order.date
          }))
        ]
      };
    });
    
    return assignments.sort((a, b) => b.ordersAssigned - a.ordersAssigned);
  }, [mockDrivers, mockOrders]);

  const availableDrivers = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'active');
  }, [mockDrivers]);

  const [driverOrders, setDriverOrders] = useState<DriverOrderDisplay[]>([]);

  useEffect(() => {
    if (selectedDriver && selectedDriver.id !== undefined) {
      const assignedOrders = getAssignedOrdersForDriver(selectedDriver.id.toString());
      
      if (assignedOrders.length > 0) {
        const formattedOrders: DriverOrderDisplay[] = assignedOrders.map(order => ({
          id: order.id,
          customer: order.customer,
          address: order.address,
          status: order.status,
          driver: selectedDriver.name,
          phoneNumber: order.phoneNumber,
          date: order.date
        }));
        
        setDriverOrders(formattedOrders);
      }
    }
  }, [selectedDriver]);

  useEffect(() => {
    setDriverOrderAssignments(getDriverOrderAssignments);
  }, [getDriverOrderAssignments]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader 
          title="Driver Management"
          subtitle="Manage and monitor your delivery staff"
          backButton={
            <Button 
              variant="back" 
              size="icon" 
              onClick={handleGoBack}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          }
          className="mb-6"
        />

        <div className="flex justify-end items-center mb-6">
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
            value={totalDriversCount.toString()}
            icon={<User className="h-5 w-5" />}
            change={{ value: "+3", trend: "up" }}
          />
          <StatsCard 
            title="Active Drivers"
            value={activeDriversCount.toString()}
            icon={<User className="h-5 w-5" />}
            change={{ value: "+5", trend: "up" }}
          />
          <StatsCard 
            title="Inactive Drivers"
            value={inactiveDriversCount.toString()}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: "-3", trend: "up" }}
          />
        </div>

        <Tabs defaultValue="drivers" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Drivers List
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Assignments
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Available Drivers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drivers">
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
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ToggleSwitch 
                            isEnabled={driver.status === 'active'}
                            onChange={() => toggleDriverStatus(driver.id)}
                            label="Active"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-gray-100">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleActionMenuItem('viewProfile', driver.id)}
                              >
                                <User className="mr-2 h-4 w-4" />
                                <span>Driver Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleActionMenuItem('viewOrders', driver.id)}
                              >
                                <Info className="mr-2 h-4 w-4" />
                                <span>Order Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleActionMenuItem('changeStatus', driver.id)}
                              >
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>Change Status</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center text-red-600 cursor-pointer"
                                onClick={() => handleActionMenuItem('removeDriver', driver.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Remove Driver</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="bg-white rounded-lg shadow-subtle overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Driver Order Assignments
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Overview of orders assigned to each driver
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {driverOrderAssignments.map((driver, index) => {
                      const driverOrders = mockOrders.filter(order => order.driver === driver.name);
                      const activeOrders = driverOrders.filter(order => order.status === 'in_delivery').length;
                      
                      return (
                        <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                <div className="text-sm text-gray-500">{driver.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                              {driver.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="font-medium">{driverOrders.length}</span>
                              <span className="text-gray-500 ml-1">orders total</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 text-green-500 mr-2" />
                              <span className="font-medium">{activeOrders}</span>
                              <span className="text-gray-500 ml-1">active deliveries</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleActionMenuItem('viewOrders', driver.id)}
                              className="flex items-center gap-1"
                            >
                              <Info className="h-4 w-4" />
                              View Orders
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Order Details by Driver</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {driverOrderAssignments.slice(0, 6).map((driver) => {
                  const driverOrders = mockOrders.filter(order => order.driver === driver.name);
                  if (driverOrders.length === 0) return null;
                  
                  return (
                    <Card key={driver.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap
