
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Search, User, Package, Clock, Info, MoreHorizontal,
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
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import { toast } from '@/hooks/use-toast';

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

  // Add a state for drivers that can be modified
  const [mockDrivers, setMockDrivers] = useState([
    {
      id: 1,
      name: 'Ravi Kumar',
      status: 'active',
      assignedOrders: ['ORD-1234', 'ORD-5678', 'ORD-9012'],
      currentOrder: 'ORD-1234',
      currentTask: 'pickup',
      location: 'Banjara Hills, Hyderabad',
      phone: '+91 9876543210',
      totalOrders: 205,
      rating: 4.8,
      lastActive: '2 minutes ago',
      joinDate: 'Jan 15, 2023',
      email: 'ravi.kumar@example.com',
      address: 'Flat 301, Sunshine Apartments, Banjara Hills, Hyderabad',
      emergencyContact: '+91 9876543211',
      vehicleInfo: 'Maruti Swift (2020), White, License: TS09AB1234',
      licenseNumber: 'DLAP20221234567'
    },
    {
      id: 2,
      name: 'Priya Reddy',
      status: 'inactive',
      assignedOrders: ['ORD-3456', 'ORD-7890'],
      currentOrder: 'ORD-3456',
      currentTask: 'deliver',
      location: 'Gachibowli, Hyderabad',
      phone: '+91 9876543212',
      totalOrders: 121,
      rating: 4.6,
      lastActive: '1 hour ago',
      joinDate: 'Mar 22, 2023',
      email: 'priya.reddy@example.com',
      address: 'Plot 45, Tech Park Colony, Gachibowli, Hyderabad',
      emergencyContact: '+91 9876543213',
      vehicleInfo: 'Honda Activa (2019), Silver, License: TS10CD5678',
      licenseNumber: 'DLAP20191234568'
    },
    {
      id: 3,
      name: 'Venkat Rao',
      status: 'active',
      assignedOrders: ['ORD-2345', 'ORD-6789', 'ORD-0123', 'ORD-4567'],
      currentOrder: 'ORD-2345',
      currentTask: 'collect',
      location: 'Madhapur, Hyderabad',
      phone: '+91 9876543214',
      totalOrders: 298,
      rating: 4.9,
      lastActive: '5 minutes ago',
      joinDate: 'Nov 3, 2022',
      email: 'venkat.rao@example.com',
      address: 'D-404, Silicon Heights, Madhapur, Hyderabad',
      emergencyContact: '+91 9876543215',
      vehicleInfo: 'Bajaj Pulsar (2021), Blue, License: TS11EF9012',
      licenseNumber: 'DLAP20223456789'
    },
    {
      id: 4,
      name: 'Sravani Devi',
      status: 'active',
      assignedOrders: ['ORD-8765', 'ORD-4321'],
      currentOrder: 'ORD-8765',
      currentTask: 'drop',
      location: 'Kukatpally, Hyderabad',
      phone: '+91 9876543216',
      totalOrders: 175,
      rating: 4.7,
      lastActive: '15 minutes ago',
      joinDate: 'Feb 8, 2023',
      email: 'sravani.devi@example.com',
      address: '123 KPHB Colony, Kukatpally, Hyderabad',
      emergencyContact: '+91 9876543217',
      vehicleInfo: 'TVS Jupiter (2018), Black, License: TS12GH3456',
      licenseNumber: 'DLAP20185678901'
    },
    {
      id: 5,
      name: 'Kiran Naidu',
      status: 'active',
      assignedOrders: ['ORD-7654', 'ORD-3210', 'ORD-9876'],
      currentOrder: 'ORD-7654',
      currentTask: 'pickup',
      location: 'Secunderabad, Hyderabad',
      phone: '+91 9876543218',
      totalOrders: 231,
      rating: 4.5,
      lastActive: '30 minutes ago',
      joinDate: 'Apr 12, 2023',
      email: 'kiran.naidu@example.com',
      address: '456 Paradise Circle, Secunderabad, Hyderabad',
      emergencyContact: '+91 9876543219',
      vehicleInfo: 'Royal Enfield (2022), Red, License: TS13IJ7890',
      licenseNumber: 'DLAP20227890123'
    },
    {
      id: 6,
      name: 'Lakshmi Sharma',
      status: 'inactive',
      assignedOrders: [],
      currentOrder: '',
      currentTask: '',
      location: 'Ameerpet, Hyderabad',
      phone: '+91 9876543220',
      totalOrders: 89,
      rating: 4.4,
      lastActive: '2 days ago',
      joinDate: 'May 19, 2023',
      email: 'lakshmi.sharma@example.com',
      address: '789 SR Nagar, Ameerpet, Hyderabad',
      emergencyContact: '+91 9876543221',
      vehicleInfo: 'Mahindra XUV (2017), Green, License: TS14KL1234',
      licenseNumber: 'DLAP20178901234'
    },
    {
      id: 7,
      name: 'Suresh Babu',
      status: 'active',
      assignedOrders: ['ORD-5432', 'ORD-1098', 'ORD-7654'],
      currentOrder: 'ORD-5432',
      currentTask: 'deliver',
      location: 'Dilsukhnagar, Hyderabad',
      phone: '+91 9876543222',
      totalOrders: 156,
      rating: 4.9,
      lastActive: '10 minutes ago',
      joinDate: 'Jun 5, 2023',
      email: 'suresh.babu@example.com',
      address: '321 Chaitanyapuri, Dilsukhnagar, Hyderabad',
      emergencyContact: '+91 9876543223',
      vehicleInfo: 'Honda City (2020), White, License: TS15MN5678',
      licenseNumber: 'DLAP20229012345'
    },
    {
      id: 8,
      name: 'Ananya Reddy',
      status: 'active',
      assignedOrders: ['ORD-2109', 'ORD-8765'],
      currentOrder: 'ORD-2109',
      currentTask: 'collect',
      location: 'Jubilee Hills, Hyderabad',
      phone: '+91 9876543224',
      totalOrders: 134,
      rating: 4.6,
      lastActive: '45 minutes ago',
      joinDate: 'Jul 17, 2023',
      email: 'ananya.reddy@example.com',
      address: '654 Road No. 10, Jubilee Hills, Hyderabad',
      emergencyContact: '+91 9876543225',
      vehicleInfo: 'Hyundai i20 (2019), Gray, License: TS16OP9012',
      licenseNumber: 'DLAP20196789012'
    },
    {
      id: 9,
      name: 'Mohan Chowdary',
      status: 'inactive',
      assignedOrders: ['ORD-3456'],
      currentOrder: 'ORD-3456',
      currentTask: 'drop',
      location: 'Miyapur, Hyderabad',
      phone: '+91 9876543226',
      totalOrders: 78,
      rating: 4.3,
      lastActive: '1 day ago',
      joinDate: 'Aug 29, 2023',
      email: 'mohan.chowdary@example.com',
      address: '987 Phase 1, Miyapur, Hyderabad',
      emergencyContact: '+91 9876543227',
      vehicleInfo: 'Tata Nexon (2018), Black, License: TS17QR3456',
      licenseNumber: 'DLAP20184567890'
    },
    {
      id: 10,
      name: 'Divya Lakshmi',
      status: 'active',
      assignedOrders: ['ORD-6543', 'ORD-2109', 'ORD-7890'],
      currentOrder: 'ORD-6543',
      currentTask: 'pickup',
      location: 'Hitech City, Hyderabad',
      phone: '+91 9876543228',
      totalOrders: 189,
      rating: 4.8,
      lastActive: '7 minutes ago',
      joinDate: 'Sep 10, 2023',
      email: 'divya.lakshmi@example.com',
      address: '210 Cyber Towers, Hitech City, Hyderabad',
      emergencyContact: '+91 9876543229',
      vehicleInfo: 'Maruti Baleno (2021), Blue, License: TS18ST7890',
      licenseNumber: 'DLAP20213456789'
    },
    {
      id: 11,
      name: 'Aravind Kumar',
      status: 'active',
      assignedOrders: ['ORD-9876', 'ORD-5432'],
      currentOrder: 'ORD-9876',
      currentTask: 'deliver',
      location: 'LB Nagar, Hyderabad',
      phone: '+91 9876543230',
      totalOrders: 157,
      rating: 4.7,
      lastActive: '23 minutes ago',
      joinDate: 'Jan 5, 2023',
      email: 'aravind.kumar@example.com',
      address: '123 Sagar Road, LB Nagar, Hyderabad',
      emergencyContact: '+91 9876543231',
      vehicleInfo: 'Kia Sonet (2019), Silver, License: TS19UV1234',
      licenseNumber: 'DLAP20191234567'
    },
    {
      id: 12,
      name: 'Swati Sharma',
      status: 'active',
      assignedOrders: ['ORD-4321', 'ORD-8765', 'ORD-1234'],
      currentOrder: 'ORD-4321',
      currentTask: 'collect',
      location: 'Uppal, Hyderabad',
      phone: '+91 9876543232',
      totalOrders: 211,
      rating: 4.9,
      lastActive: '12 minutes ago',
      joinDate: 'Feb 15, 2023',
      email: 'swati.sharma@example.com',
      address: '456 Uppal Bus Depot, Uppal, Hyderabad',
      emergencyContact: '+91 9876543233',
      vehicleInfo: 'Honda City (2021), White, License: TS20WX5678',
      licenseNumber: 'DLAP20218765432'
    },
    {
      id: 13,
      name: 'Krishna Murthy',
      status: 'inactive',
      assignedOrders: [],
      currentOrder: '',
      currentTask: '',
      location: 'Mehdipatnam, Hyderabad',
      phone: '+91 9876543234',
      totalOrders: 93,
      rating: 4.2,
      lastActive: '3 days ago',
      joinDate: 'Mar 21, 2023',
      email: 'krishna.murthy@example.com',
      address: '789 Pillar No. 63, Mehdipatnam, Hyderabad',
      emergencyContact: '+91 9876543235',
      vehicleInfo: 'Suzuki Access (2018), Black, License: TS21YZ9012',
      licenseNumber: 'DLAP20185432109'
    },
    {
      id: 14,
      name: 'Meenakshi Devi',
      status: 'active',
      assignedOrders: ['ORD-7890', 'ORD-2345'],
      currentOrder: 'ORD-7890',
      currentTask: 'pickup',
      location: 'Koti, Hyderabad',
      phone: '+91 9876543236',
      totalOrders: 178,
      rating: 4.8,
      lastActive: '35 minutes ago',
      joinDate: 'Apr 7, 2023',
      email: 'meenakshi.devi@example.com',
      address: '321 Sultan Bazaar, Koti, Hyderabad',
      emergencyContact: '+91 9876543237',
      vehicleInfo: 'Nissan Magnite (2020), Red, License: TS22AB3456',
      licenseNumber: 'DLAP20202109876'
    },
    {
      id: 15,
      name: 'Rajesh Verma',
      status: 'active',
      assignedOrders: ['ORD-5678', 'ORD-1234', 'ORD-9012'],
      currentOrder: 'ORD-5678',
      currentTask: 'deliver',
      location: 'Tarnaka, Hyderabad',
      phone: '+91 9876543238',
      totalOrders: 224,
      rating: 4.6,
      lastActive: '18 minutes ago',
      joinDate: 'May 12, 2023',
      email: 'rajesh.verma@example.com',
      address: '654 Osmania University, Tarnaka, Hyderabad',
      emergencyContact: '+91 9876543239',
      vehicleInfo: 'Yamaha FZ (2021), Blue, License: TS23CD7890',
      licenseNumber: 'DLAP20216543210'
    },
    {
      id: 16,
      name: 'Padma Lakshmi',
      status: 'active',
      assignedOrders: ['ORD-3456'],
      currentOrder: 'ORD-3456',
      currentTask: 'drop',
      location: 'Abids, Hyderabad',
      phone: '+91 9876543240',
      totalOrders: 145,
      rating: 4.7,
      lastActive: '40 minutes ago',
      joinDate: 'Jun 18, 2023',
      email: 'padma.lakshmi@example.com',
      address: '987 GPO, Abids, Hyderabad',
      emergencyContact: '+91 9876543241',
      vehicleInfo: 'Ford EcoSport (2019), Silver, License: TS24EF1234',
      licenseNumber: 'DLAP20194321098'
    },
    {
      id: 17,
      name: 'Chaitanya Prasad',
      status: 'inactive',
      assignedOrders: ['ORD-0123'],
      currentOrder: 'ORD-0123',
      currentTask: 'pickup',
      location: 'Begumpet, Hyderabad',
      phone: '+91 9876543242',
      totalOrders: 102,
      rating: 4.4,
      lastActive: '1 day ago',
      joinDate: 'Jul 25, 2023',
      email: 'chaitanya.prasad@example.com',
      address: '210 Airport Road, Begumpet, Hyderabad',
      emergencyContact: '+91 9876543243',
      vehicleInfo: 'Maruti Ertiga (2020), White, License: TS25GH5678',
      licenseNumber: 'DLAP20203210987'
    },
    {
      id: 18,
      name: 'Sarita Reddy',
      status: 'active',
      assignedOrders: ['ORD-6789', 'ORD-2345', 'ORD-8765'],
      currentOrder: 'ORD-6789',
      currentTask: 'collect',
      location: 'Shamshabad, Hyderabad',
      phone: '+91 9876543244',
      totalOrders: 192,
      rating: 4.9,
      lastActive: '8 minutes ago',
      joinDate: 'Aug 9, 2023',
      email: 'sarita.reddy@example.com',
      address: '543 Airport Colony, Shamshabad, Hyderabad',
      emergencyContact: '+91 9876543245',
      vehicleInfo: 'Toyota Innova (2022), Black, License: TS26IJ9012',
      licenseNumber: 'DLAP20221098765'
    },
    {
      id: 19,
      name: 'Sunil Varma',
      status: 'active',
      assignedOrders: ['ORD-4567', 'ORD-0123'],
      currentOrder: 'ORD-4567',
      currentTask: 'deliver',
      location: 'Attapur, Hyderabad',
      phone: '+91 9876543246',
      totalOrders: 165,
      rating: 4.5,
      lastActive: '25 minutes ago',
      joinDate: 'Sep 14, 2023',
      email: 'sunil.varma@example.com',
      address: '876 Pillar No. 140, Attapur, Hyderabad',
      emergencyContact: '+91 9876543247',
      vehicleInfo: 'Bajaj Avenger (2021), Red, License: TS27KL3456',
      licenseNumber: 'DLAP20210987654'
    },
    {
      id: 20,
      name: 'Jyoti Rani',
      status: 'active',
      assignedOrders: ['ORD-9012', 'ORD-5678', 'ORD-1234'],
      currentOrder: 'ORD-9012',
      currentTask: 'drop',
      location: 'Kompally, Hyderabad',
      phone: '+91 9876543248',
      totalOrders: 208,
      rating: 4.8,
      lastActive: '15 minutes ago',
      joinDate: 'Oct 22, 2023',
      email: 'jyoti.rani@example.com',
      address: '109 Suchitra Junction, Kompally, Hyderabad',
      emergencyContact: '+91 9876543249',
      vehicleInfo: 'Mahindra Thar (2020), Silver, License: TS28MN7890',
      licenseNumber: 'DLAP20209876543'
    }
  ]);

  const toggleDriverStatus = (driverId: number) => {
    setMockDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId 
          ? { ...driver, status: driver.status === 'active' ? 'inactive' : 'active' } 
          : driver
      )
    );
    
    // Show toast notification for status change with shorter duration
    const driver = mockDrivers.find(d => d.id === driverId);
    const newStatus = driver?.status === 'active' ? 'inactive' : 'active';
    toast({
      title: `Status updated`,
      description: `${driver?.name}'s status changed to ${newStatus}`,
      duration: 2000,
    });
  };

  const handleActionMenuItem = (action: string, driverId: number) => {
    const driver = mockDrivers.find(d => d.id === driverId);
    
    if (!driver) return;
    
    switch(action) {
      case 'viewProfile':
        navigate(`/driver-profile/${driverId}`);
        break;
      case 'viewOrders':
        handleOpenOrderDetails(driver);
        break;
      case 'changeStatus':
        toggleDriverStatus(driverId);
        break;
      case 'removeDriver':
        // Implementation for removing driver
        toast({
          title: "Driver removed",
          description: `${driver.name} has been removed from the system`,
          variant: "destructive",
          duration: 2000,
        });
        setMockDrivers(prevDrivers => prevDrivers.filter(d => d.id !== driverId));
        break;
      default:
        break;
    }
  };

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

  // Calculate active and inactive driver counts
  const activeDriversCount = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'active').length;
  }, [mockDrivers]);

  const inactiveDriversCount = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'inactive').length;
  }, [mockDrivers]);
  
  // Calculate total drivers as sum of active and inactive
  const totalDriversCount = useMemo(() => {
    return activeDriversCount + inactiveDriversCount;
  }, [activeDriversCount, inactiveDriversCount]);

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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.assignedOrders.length}
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-900">{selectedDriver?.totalOrders}</p>
                <p className="text-xs text-gray-500">Total Orders</p>
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
