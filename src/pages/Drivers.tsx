
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Eye, ChevronDown, Search, Filter, MoreHorizontal, X, ArrowUpDown, Car, Clipboard, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Task type
type TaskType = 'pickup' | 'drop' | 'collect' | 'delivery' | 'none';

// Task details type
interface Task {
  id: string;
  type: TaskType;
  orderId: string;
  customerName: string;
  customerAddress: string;
  studioName?: string;
  studioAddress?: string;
  status: 'pending' | 'in-progress' | 'completed';
  scheduledTime: string;
}

// Order type
interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  studioId: string;
  studioName: string;
  studioAddress: string;
  items: number;
  totalAmount: number;
  currentTask: TaskType;
  allTasks: Task[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

// Driver data type
interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  vehicleType: 'Two Wheeler' | 'Three Wheeler' | 'Four Wheeler';
  vehicleNumber: string;
  status: 'active' | 'inactive' | 'on-duty';
  rating: number;
  completedOrders: number;
  joinDate: string;
  address?: string;
  city?: string;
  currentLocation?: string;
  earnings?: number;
  currentTask?: Task;
  assignedOrders?: Order[];
}

// Sample task data
const sampleTasks: Task[] = [
  {
    id: 'T1001',
    type: 'pickup',
    orderId: 'ORD-5678',
    customerName: 'Rahul Mehta',
    customerAddress: '123 Park Street, Connaught Place, Delhi',
    status: 'in-progress',
    scheduledTime: '2023-09-15T10:30:00'
  },
  {
    id: 'T1002',
    type: 'drop',
    orderId: 'ORD-5679',
    customerName: 'Priya Shah',
    customerAddress: '456 Marine Drive, Mumbai',
    studioName: 'Sparkle Clean Laundry',
    studioAddress: '789 Commercial Street, Mumbai',
    status: 'pending',
    scheduledTime: '2023-09-15T12:45:00'
  },
  {
    id: 'T1003',
    type: 'collect',
    orderId: 'ORD-5680',
    customerName: 'Vikram Patel',
    customerAddress: '123 Main Street, Koramangala, Bangalore',
    studioName: 'Fresh Fold Services',
    studioAddress: '567 MG Road, Bangalore',
    status: 'pending',
    scheduledTime: '2023-09-15T14:15:00'
  },
  {
    id: 'T1004',
    type: 'delivery',
    orderId: 'ORD-5681',
    customerName: 'Ananya Singh',
    customerAddress: '321 Hill View, Pune',
    studioName: 'Royal Wash',
    status: 'pending',
    scheduledTime: '2023-09-15T16:30:00'
  }
];

// Sample order data
const sampleOrders: Order[] = [
  {
    id: 'ORD-5678',
    customerId: 'CUST-001',
    customerName: 'Rahul Mehta',
    customerAddress: '123 Park Street, Connaught Place, Delhi',
    studioId: 'STD-001',
    studioName: 'Sparkle Clean Laundry',
    studioAddress: '789 Commercial Street, Delhi',
    items: 5,
    totalAmount: 750,
    currentTask: 'pickup',
    allTasks: [sampleTasks[0]],
    status: 'active',
    createdAt: '2023-09-15T08:30:00'
  },
  {
    id: 'ORD-5679',
    customerId: 'CUST-002',
    customerName: 'Priya Shah',
    customerAddress: '456 Marine Drive, Mumbai',
    studioId: 'STD-002',
    studioName: 'Sparkle Clean Laundry',
    studioAddress: '789 Commercial Street, Mumbai',
    items: 3,
    totalAmount: 450,
    currentTask: 'drop',
    allTasks: [sampleTasks[1]],
    status: 'active',
    createdAt: '2023-09-15T09:15:00'
  },
  {
    id: 'ORD-5680',
    customerId: 'CUST-003',
    customerName: 'Vikram Patel',
    customerAddress: '123 Main Street, Koramangala, Bangalore',
    studioId: 'STD-003',
    studioName: 'Fresh Fold Services',
    studioAddress: '567 MG Road, Bangalore',
    items: 7,
    totalAmount: 1200,
    currentTask: 'collect',
    allTasks: [sampleTasks[2]],
    status: 'active',
    createdAt: '2023-09-15T10:30:00'
  },
  {
    id: 'ORD-5681',
    customerId: 'CUST-004',
    customerName: 'Ananya Singh',
    customerAddress: '321 Hill View, Pune',
    studioId: 'STD-004',
    studioName: 'Royal Wash',
    studioAddress: '456 MG Road, Pune',
    items: 4,
    totalAmount: 600,
    currentTask: 'delivery',
    allTasks: [sampleTasks[3]],
    status: 'active',
    createdAt: '2023-09-15T11:45:00'
  }
];

// Sample data for drivers with assigned orders
const initialDrivers: Driver[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh@example.com',
    licenseNumber: 'DL-0123456789',
    vehicleType: 'Two Wheeler',
    vehicleNumber: 'DL 01 AB 1234',
    status: 'active',
    rating: 4.7,
    completedOrders: 325,
    joinDate: '2022-05-15',
    address: '123 Main Street, Sector 4',
    city: 'Delhi',
    currentLocation: 'Connaught Place',
    earnings: 45600,
    currentTask: sampleTasks[0],
    assignedOrders: [sampleOrders[0]]
  },
  {
    id: 2,
    name: 'Priya Sharma',
    phone: '8765432109',
    email: 'priya@example.com',
    licenseNumber: 'MH-9876543210',
    vehicleType: 'Two Wheeler',
    vehicleNumber: 'MH 02 CD 5678',
    status: 'on-duty',
    rating: 4.8,
    completedOrders: 412,
    joinDate: '2022-03-22',
    address: '456 Park Avenue, Andheri East',
    city: 'Mumbai',
    currentLocation: 'Bandra',
    earnings: 52300,
    currentTask: sampleTasks[1],
    assignedOrders: [sampleOrders[1]]
  },
  {
    id: 3,
    name: 'Vikram Singh',
    phone: '7654321098',
    email: 'vikram@example.com',
    licenseNumber: 'KA-5678901234',
    vehicleType: 'Four Wheeler',
    vehicleNumber: 'KA 03 EF 9012',
    status: 'inactive',
    rating: 3.9,
    completedOrders: 198,
    joinDate: '2022-06-10',
    address: '789 Garden Road, Koramangala',
    city: 'Bangalore',
    currentLocation: 'Unavailable',
    earnings: 28700,
    assignedOrders: []
  },
  {
    id: 4,
    name: 'Ananya Patel',
    phone: '6543210987',
    email: 'ananya@example.com',
    licenseNumber: 'GJ-4567890123',
    vehicleType: 'Three Wheeler',
    vehicleNumber: 'GJ 04 GH 3456',
    status: 'active',
    rating: 4.5,
    completedOrders: 276,
    joinDate: '2022-04-05',
    address: '321 River View, Navrangpura',
    city: 'Ahmedabad',
    currentLocation: 'Satellite',
    earnings: 38900,
    assignedOrders: []
  },
  {
    id: 5,
    name: 'Arjun Reddy',
    phone: '9876123450',
    email: 'arjun@example.com',
    licenseNumber: 'TN-3456789012',
    vehicleType: 'Two Wheeler',
    vehicleNumber: 'TN 05 IJ 7890',
    status: 'on-duty',
    rating: 4.6,
    completedOrders: 352,
    joinDate: '2022-02-18',
    address: '567 Temple Street, T Nagar',
    city: 'Chennai',
    currentLocation: 'Adyar',
    earnings: 47500,
    currentTask: sampleTasks[2],
    assignedOrders: [sampleOrders[2]]
  },
  {
    id: 6,
    name: 'Meera Kapoor',
    phone: '8901234567',
    email: 'meera@example.com',
    licenseNumber: 'UP-2345678901',
    vehicleType: 'Four Wheeler',
    vehicleNumber: 'UP 06 KL 1234',
    status: 'active',
    rating: 4.4,
    completedOrders: 243,
    joinDate: '2022-07-12',
    address: '890 Mall Road, Hazratganj',
    city: 'Lucknow',
    currentLocation: 'Gomti Nagar',
    earnings: 36200,
    assignedOrders: []
  },
  {
    id: 7,
    name: 'Rahul Verma',
    phone: '7890123456',
    email: 'rahul@example.com',
    licenseNumber: 'PB-1234567890',
    vehicleType: 'Two Wheeler',
    vehicleNumber: 'PB 07 MN 5678',
    status: 'inactive',
    rating: 3.7,
    completedOrders: 165,
    joinDate: '2022-08-03',
    address: '432 Green Park, Model Town',
    city: 'Chandigarh',
    currentLocation: 'Unavailable',
    earnings: 24800,
    assignedOrders: []
  },
  {
    id: 8,
    name: 'Neha Gupta',
    phone: '6789012345',
    email: 'neha@example.com',
    licenseNumber: 'WB-0987654321',
    vehicleType: 'Three Wheeler',
    vehicleNumber: 'WB 08 OP 9012',
    status: 'on-duty',
    rating: 4.3,
    completedOrders: 298,
    joinDate: '2022-05-25',
    address: '765 Lake Road, Salt Lake',
    city: 'Kolkata',
    currentLocation: 'Park Street',
    earnings: 41200,
    currentTask: sampleTasks[3],
    assignedOrders: [sampleOrders[3]]
  }
];

// Sample data for the performance chart
const performanceData = [
  { month: 'Jan', completedOrders: 45, cancelledOrders: 3 },
  { month: 'Feb', completedOrders: 52, cancelledOrders: 4 },
  { month: 'Mar', completedOrders: 48, cancelledOrders: 2 },
  { month: 'Apr', completedOrders: 70, cancelledOrders: 5 },
  { month: 'May', completedOrders: 63, cancelledOrders: 3 },
  { month: 'Jun', completedOrders: 82, cancelledOrders: 4 }
];

interface NewDriverFormData {
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  vehicleType: 'Two Wheeler' | 'Three Wheeler' | 'Four Wheeler';
  vehicleNumber: string;
  address: string;
  city: string;
}

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(initialDrivers);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [isEditDriverModalOpen, setIsEditDriverModalOpen] = useState(false);
  const [isViewDriverModalOpen, setIsViewDriverModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Driver[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [sortField, setSortField] = useState<keyof Driver | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'on-duty'>('all');
  const [filterVehicleType, setFilterVehicleType] = useState<'all' | 'Two Wheeler' | 'Three Wheeler' | 'Four Wheeler'>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showVehicleFilter, setShowVehicleFilter] = useState(false);
  const [newDriverForm, setNewDriverForm] = useState<NewDriverFormData>({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    vehicleType: 'Two Wheeler',
    vehicleNumber: '',
    address: '',
    city: ''
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const vehicleFilterRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
      if (vehicleFilterRef.current && !vehicleFilterRef.current.contains(event.target as Node)) {
        setShowVehicleFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...drivers];

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(driver => driver.status === filterStatus);
    }

    // Apply vehicle type filter
    if (filterVehicleType !== 'all') {
      result = result.filter(driver => driver.vehicleType === filterVehicleType);
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      result = result.filter(
        driver =>
          driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.phone.includes(searchQuery) ||
          driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredDrivers(result);
  }, [drivers, filterStatus, filterVehicleType, searchQuery, sortField, sortDirection]);

  // Toggle driver status
  const toggleDriverStatus = (id: number) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver => {
        if (driver.id === id) {
          const statuses: ('active' | 'inactive' | 'on-duty')[] = ['active', 'inactive', 'on-duty'];
          const currentIndex = statuses.indexOf(driver.status);
          const newStatus = statuses[(currentIndex + 1) % statuses.length];
          
          // Show toast notification
          toast({
            title: `Driver status updated`,
            description: `${driver.name} is now ${newStatus}`,
            duration: 3000,
          });
          
          return {
            ...driver,
            status: newStatus
          };
        }
        return driver;
      })
    );
  };

  // View driver details
  const viewDriverDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsViewDriverModalOpen(true);
  };

  // View order details
  const viewOrderDetails = (driver: Driver) => {
    if (!driver.currentTask && (!driver.assignedOrders || driver.assignedOrders.length === 0)) {
      toast({
        title: "No active orders",
        description: `${driver.name} doesn't have any assigned orders currently.`,
        duration: 3000,
      });
      return;
    }
    
    setSelectedDriver(driver);
    setIsOrderDetailsModalOpen(true);
  };

  // Edit driver
  const editDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditDriverModalOpen(true);
  };

  // Save edited driver
  const saveEditedDriver = () => {
    if (!selectedDriver) return;
    
    setDrivers(prevDrivers =>
      prevDrivers.map(driver => 
        driver.id === selectedDriver.id ? selectedDriver : driver
      )
    );
    
    setIsEditDriverModalOpen(false);
    
    toast({
      title: "Driver updated",
      description: `${selectedDriver.name} has been updated successfully`,
      duration: 3000,
    });
  };

  // Open add driver modal
  const openAddDriverModal = () => {
    setIsAddDriverModalOpen(true);
  };

  // Add new driver
  const addNewDriver = () => {
    // Validate form
    if (!newDriverForm.name || !newDriverForm.phone || !newDriverForm.licenseNumber || !newDriverForm.vehicleNumber) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Create new driver object
    const newDriver: Driver = {
      id: Math.max(...drivers.map(d => d.id)) + 1,
      name: newDriverForm.name,
      phone: newDriverForm.phone,
      email: newDriverForm.email,
      licenseNumber: newDriverForm.licenseNumber,
      vehicleType: newDriverForm.vehicleType,
      vehicleNumber: newDriverForm.vehicleNumber,
      address: newDriverForm.address,
      city: newDriverForm.city,
      status: 'active',
      rating: 0,
      completedOrders: 0,
      joinDate: new Date().toISOString().split('T')[0],
      earnings: 0,
      assignedOrders: []
    };
    
    // Add to drivers list
    setDrivers([...drivers, newDriver]);
    
    // Reset form and close modal
    setNewDriverForm({
      name: '',
      phone: '',
      email: '',
      licenseNumber: '',
      vehicleType: 'Two Wheeler',
      vehicleNumber: '',
      address: '',
      city: ''
    });
    setIsAddDriverModalOpen(false);
    
    toast({
      title: "Driver added",
      description: `${newDriver.name} has been added successfully`,
      duration: 3000,
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setShowSearchDropdown(false);
      return;
    }
    
    // Filter drivers based on query
    const results = drivers.filter(
      driver =>
        driver.name.toLowerCase().includes(query.toLowerCase()) ||
        driver.phone.includes(query) ||
        driver.email.toLowerCase().includes(query.toLowerCase()) ||
        driver.vehicleNumber.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results for dropdown
    
    setSearchResults(results);
    setShowSearchDropdown(results.length > 0);
  };

  // Handle search result selection
  const selectSearchResult = (driver: Driver) => {
    setSearchQuery(driver.name);
    setShowSearchDropdown(false);
    
    // Apply filter immediately
    setFilteredDrivers([driver]);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Handle sorting
  const handleSort = (field: keyof Driver) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    
    toast({
      title: "Sorting applied",
      description: `Sorting by ${field} (${sortDirection === 'asc' ? 'ascending' : 'descending'})`,
      duration: 2000,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus('all');
    setFilterVehicleType('all');
    setSearchQuery('');
    setSortField(null);
    
    toast({
      title: "Filters reset",
      description: "All filters have been cleared",
      duration: 2000,
    });
  };

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <StatusBadge status="active" />;
      case 'inactive':
        return <StatusBadge status="inactive" />;
      case 'on-duty':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            On Duty
          </span>
        );
      default:
        return <StatusBadge status={status} />;
    }
  };

  // Get task badge styles
  const getTaskBadge = (task?: Task) => {
    if (!task) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Task
        </span>
      );
    }

    switch (task.type) {
      case 'pickup':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pickup
          </span>
        );
      case 'drop':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Drop
          </span>
        );
      case 'collect':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Collect
          </span>
        );
      case 'delivery':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Delivery
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  // Table columns configuration
  const columns = [
    {
      header: 'ID',
      accessor: 'id' as keyof Driver,
      width: '60px'
    },
    {
      header: 'Driver Name',
      accessor: 'name' as keyof Driver,
    },
    {
      header: 'Phone',
      accessor: 'phone' as keyof Driver,
    },
    {
      header: 'Vehicle',
      accessor: (row: Driver) => (
        <div>
          <div className="font-medium">{row.vehicleType}</div>
          <div className="text-xs text-gray-500">{row.vehicleNumber}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Orders',
      accessor: (row: Driver) => (
        <div className="flex flex-col">
          {row.assignedOrders && row.assignedOrders.length > 0 ? (
            <>
              <div className="flex items-center">
                <span className="font-medium">{row.assignedOrders.length}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {row.assignedOrders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>
              {row.currentTask && (
                <div className="mt-1">
                  {getTaskBadge(row.currentTask)}
                </div>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-500">No assigned orders</span>
          )}
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: (row: Driver) => (
        <div className="flex items-center">
          <span className="font-medium">{row.rating}</span>
          <span className="ml-1 text-yellow-500">★</span>
        </div>
      ),
      width: '80px'
    },
    {
      header: 'Status',
      accessor: (row: Driver) => getStatusBadge(row.status),
      width: '100px'
    },
    {
      header: 'Actions',
      accessor: (row: Driver) => (
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => viewDriverDetails(row)}
                  className="p-1 text-gray-500 hover:text-admin-primary transition-colors"
                  aria-label="View driver details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View driver details</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => viewOrderDetails(row)}
                  className="p-1 text-gray-500 hover:text-admin-primary transition-colors"
                  aria-label="View order details"
                >
                  <Clipboard className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View order details</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => editDriver(row)}
                  className="p-1 text-gray-500 hover:text-admin-primary transition-colors"
                  aria-label="Edit driver"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit driver</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group">
                  <button
                    className="p-1 text-gray-500 hover:text-admin-primary transition-colors"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-48 hidden group-hover:block z-10">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => toggleDriverStatus(row.id)}
                    >
                      Change Status
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        setDrivers(drivers.filter(d => d.id !== row.id));
                        toast({
                          title: "Driver removed",
                          description: `${row.name} has been removed`,
                          duration: 3000,
                        });
                      }}
                    >
                      Remove Driver
                    </button>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      width: '160px'
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title="Drivers" 
        subtitle="Manage all drivers on your platform"
      >
        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={resetFilters}
                  className="flex items-center px-3 py-2 text-sm bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Reset Filters</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all applied filters</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={openAddDriverModal}
                  className="flex items-center bg-admin-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add New Driver</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Register a new driver</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </PageHeader>
      
      {/* Driver analytics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Total Drivers</p>
          <p className="text-2xl font-semibold mt-1">{drivers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Active Drivers</p>
          <p className="text-2xl font-semibold mt-1 text-green-600">
            {drivers.filter(d => d.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">On Duty</p>
          <p className="text-2xl font-semibold mt-1 text-blue-600">
            {drivers.filter(d => d.status === 'on-duty').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Avg. Rating</p>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-semibold">{(drivers.reduce((sum, driver) => sum + driver.rating, 0) / drivers.length).toFixed(1)}</p>
            <span className="ml-1 text-yellow-500 text-xl">★</span>
          </div>
        </div>
      </div>
      
      {/* Driver Performance Chart */}
      <div className="bg-white p-4 rounded-lg shadow-subtle mb-6">
        <h3 className="text-lg font-medium mb-4">Driver Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="completedOrders" name="Completed Orders" fill="#10b981" />
              <Bar dataKey="cancelledOrders" name="Cancelled Orders" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">Filter by:</span>
          
          {/* Status filter */}
          <div className="relative inline-block text-left" ref={statusFilterRef}>
            <button 
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white min-w-[100px]"
            >
              <span>{filterStatus === 'all' ? 'Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {showStatusFilter && (
              <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 min-w-[120px]">
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterStatus === 'all' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterStatus('all');
                    setShowStatusFilter(false);
                  }}
                >
                  All
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterStatus === 'active' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterStatus('active');
                    setShowStatusFilter(false);
                  }}
                >
                  Active
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterStatus === 'on-duty' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterStatus('on-duty');
                    setShowStatusFilter(false);
                  }}
                >
                  On Duty
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterStatus === 'inactive' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterStatus('inactive');
                    setShowStatusFilter(false);
                  }}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
          
          {/* Vehicle Type filter */}
          <div className="relative inline-block text-left" ref={vehicleFilterRef}>
            <button 
              onClick={() => setShowVehicleFilter(!showVehicleFilter)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white min-w-[120px]"
            >
              <span>{filterVehicleType === 'all' ? 'Vehicle Type' : filterVehicleType}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {showVehicleFilter && (
              <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 min-w-[150px]">
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterVehicleType === 'all' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterVehicleType('all');
                    setShowVehicleFilter(false);
                  }}
                >
                  All Vehicles
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterVehicleType === 'Two Wheeler' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterVehicleType('Two Wheeler');
                    setShowVehicleFilter(false);
                  }}
                >
                  Two Wheeler
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterVehicleType === 'Three Wheeler' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterVehicleType('Three Wheeler');
                    setShowVehicleFilter(false);
                  }}
                >
                  Three Wheeler
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterVehicleType === 'Four Wheeler' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterVehicleType('Four Wheeler');
                    setShowVehicleFilter(false);
                  }}
                >
                  Four Wheeler
                </button>
              </div>
            )}
          </div>
          
          {/* Sort button */}
          <div className="relative inline-block text-left">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => handleSort('name')}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white"
                  >
                    <span>Sort</span>
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort the drivers list</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Search with dropdown */}
        <div className="relative w-full sm:w-auto" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, email or vehicle number..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full sm:w-64 bg-white border border-gray-200 rounded-md py-2 pl-10 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Search results dropdown */}
          {showSearchDropdown && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
              {searchResults.length > 0 ? (
                searchResults.map((driver) => (
                  <button
                    key={driver.id}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => selectSearchResult(driver)}
                  >
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{driver.phone}</span>
                      <span>{driver.vehicleNumber}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No matching drivers found</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Drivers table */}
      <div className="bg-white rounded-lg shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: column.width }}
                  >
                    {typeof column.accessor === 'string' ? (
                      <button 
                        className="flex items-center"
                        onClick={() => column.accessor !== 'id' ? handleSort(column.accessor as keyof Driver) : null}
                      >
                        {column.header}
                        {sortField === column.accessor && (
                          <ChevronDown 
                            className={`ml-1 h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                          />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column, index) => (
                      <td key={index} className="px-4 py-3 text-sm text-gray-700">
                        {typeof column.accessor === 'function'
                          ? column.accessor(row)
                          : row[column.accessor] as React.ReactNode}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-sm text-center text-gray-400"
                  >
                    No drivers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add New Driver Modal */}
      {isAddDriverModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Driver</h3>
              <button onClick={() => setIsAddDriverModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDriverForm.name}
                  onChange={(e) => setNewDriverForm({...newDriverForm, name: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter driver's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDriverForm.phone}
                  onChange={(e) => setNewDriverForm({...newDriverForm, phone: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter contact number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newDriverForm.email}
                  onChange={(e) => setNewDriverForm({...newDriverForm, email: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDriverForm.licenseNumber}
                  onChange={(e) => setNewDriverForm({...newDriverForm, licenseNumber: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter license number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newDriverForm.vehicleType}
                  onChange={(e) => setNewDriverForm({
                    ...newDriverForm, 
                    vehicleType: e.target.value as 'Two Wheeler' | 'Three Wheeler' | 'Four Wheeler'
                  })}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Two Wheeler">Two Wheeler</option>
                  <option value="Three Wheeler">Three Wheeler</option>
                  <option value="Four Wheeler">Four Wheeler</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDriverForm.vehicleNumber}
                  onChange={(e) => setNewDriverForm({...newDriverForm, vehicleNumber: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter vehicle registration number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={newDriverForm.address}
                  onChange={(e) => setNewDriverForm({...newDriverForm, address: e.target.value})}
                  rows={2}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter residential address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={newDriverForm.city}
                  onChange={(e) => setNewDriverForm({...newDriverForm, city: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter city"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddDriverModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewDriver}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* View Driver Modal */}
      {isViewDriverModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Driver Details</h3>
              <button onClick={() => setIsViewDriverModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedDriver.name}</h2>
                {getStatusBadge(selectedDriver.status)}
              </div>
              <p className="text-sm text-gray-500 mt-1">{selectedDriver.city || 'No city specified'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedDriver.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedDriver.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">License</p>
                <p className="font-medium">{selectedDriver.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">{new Date(selectedDriver.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-3">Vehicle Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedDriver.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number</p>
                  <p className="font-medium">{selectedDriver.vehicleNumber}</p>
                </div>
              </div>
            </div>
            
            {/* Order Information Section */}
            {selectedDriver.assignedOrders && selectedDriver.assignedOrders.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Assigned Orders</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedDriver.assignedOrders.length} {selectedDriver.assignedOrders.length === 1 ? 'Order' : 'Orders'}
                  </span>
                </div>
                {selectedDriver.assignedOrders.map((order, index) => (
                  <div key={order.id} className={`p-3 border ${selectedDriver.currentTask && selectedDriver.currentTask.orderId === order.id ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} rounded-md ${index !== 0 ? 'mt-3' : ''}`}>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{order.id}</p>
                      {selectedDriver.currentTask && selectedDriver.currentTask.orderId === order.id && (
                        <span className="text-xs text-blue-600">Current Task</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-500">Customer:</span> {order.customerName}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Studio:</span> {order.studioName}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500 mr-2">Current Task:</span>
                        {getTaskBadge(selectedDriver.currentTask)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h4 className="font-medium mb-2">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Completed Orders</p>
                  <p className="text-lg font-semibold">{selectedDriver.completedOrders}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Earnings</p>
                  <p className="text-lg font-semibold">₹{selectedDriver.earnings?.toLocaleString() || "0"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold">{selectedDriver.rating}</p>
                    <span className="ml-1 text-yellow-500">★</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Current Location</p>
                  <p className="text-sm font-medium">{selectedDriver.currentLocation || "Unknown"}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsViewDriverModalOpen(false);
                  editDriver(selectedDriver);
                }}
                className="px-4 py-2 text-sm text-admin-primary border border-admin-primary rounded-md hover:bg-admin-primary hover:text-white transition-colors"
              >
                Edit Driver
              </button>
              <button
                onClick={() => toggleDriverStatus(selectedDriver.id)}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Change Status
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Driver Modal */}
      {isEditDriverModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Driver</h3>
              <button onClick={() => setIsEditDriverModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={selectedDriver.name}
                  onChange={(e) => setSelectedDriver({...selectedDriver, name: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={selectedDriver.phone}
                  onChange={(e) => setSelectedDriver({...selectedDriver, phone: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={selectedDriver.email}
                  onChange={(e) => setSelectedDriver({...selectedDriver, email: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  value={selectedDriver.licenseNumber}
                  onChange={(e) => setSelectedDriver({...selectedDriver, licenseNumber: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={selectedDriver.vehicleType}
                  onChange={(e) => setSelectedDriver({
                    ...selectedDriver, 
                    vehicleType: e.target.value as 'Two Wheeler' | 'Three Wheeler' | 'Four Wheeler'
                  })}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Two Wheeler">Two Wheeler</option>
                  <option value="Three Wheeler">Three Wheeler</option>
                  <option value="Four Wheeler">Four Wheeler</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={selectedDriver.vehicleNumber}
                  onChange={(e) => setSelectedDriver({...selectedDriver, vehicleNumber: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={selectedDriver.address || ''}
                  onChange={(e) => setSelectedDriver({...selectedDriver, address: e.target.value})}
                  rows={2}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={selectedDriver.city || ''}
                  onChange={(e) => setSelectedDriver({...selectedDriver, city: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedDriver.status === 'active'}
                      onChange={() => setSelectedDriver({...selectedDriver, status: 'active'})}
                      className="h-4 w-4 text-admin-primary focus:ring-admin-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedDriver.status === 'on-duty'}
                      onChange={() => setSelectedDriver({...selectedDriver, status: 'on-duty'})}
                      className="h-4 w-4 text-admin-primary focus:ring-admin-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">On Duty</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedDriver.status === 'inactive'}
                      onChange={() => setSelectedDriver({...selectedDriver, status: 'inactive'})}
                      className="h-4 w-4 text-admin-primary focus:ring-admin-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditDriverModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedDriver}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Details Modal */}
      {isOrderDetailsModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button onClick={() => setIsOrderDetailsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <Car className="h-10 w-10 text-admin-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedDriver.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">{selectedDriver.vehicleType} • </span>
                    <span className="text-sm text-gray-500 ml-1">{selectedDriver.vehicleNumber}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Assigned Orders Summary</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedDriver.assignedOrders?.length || 0} Orders
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Active Orders</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {selectedDriver.assignedOrders?.filter(o => o.status === 'active').length || 0}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Completed Today</p>
                  <p className="text-xl font-semibold text-green-600">
                    {selectedDriver.assignedOrders?.filter(o => o.status === 'completed').length || 0}
                  </p>
                </div>
              </div>
              
              {/* Task Timeline */}
              <div className="mb-3">
                <h5 className="text-sm font-medium mb-3">Order Process</h5>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${selectedDriver.currentTask?.type === 'pickup' || !selectedDriver.currentTask ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <div className="ml-2 text-sm">Pickup</div>
                  </div>
                  <div className="h-0.5 flex-grow mx-2 bg-gray-200"></div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${selectedDriver.currentTask?.type === 'drop' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <div className="ml-2 text-sm">Drop</div>
                  </div>
                  <div className="h-0.5 flex-grow mx-2 bg-gray-200"></div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${selectedDriver.currentTask?.type === 'collect' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <div className="ml-2 text-sm">Collect</div>
                  </div>
                  <div className="h-0.5 flex-grow mx-2 bg-gray-200"></div>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${selectedDriver.currentTask?.type === 'delivery' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <div className="ml-2 text-sm">Deliver</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Current Task Details */}
            {selectedDriver.currentTask && (
              <div className="bg-white border border-admin-primary/20 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-admin-primary">Current Task</h4>
                  {getTaskBadge(selectedDriver.currentTask)}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Task ID</p>
                    <p className="font-medium">{selectedDriver.currentTask.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedDriver.currentTask.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Time</p>
                    <p className="font-medium">
                      {new Date(selectedDriver.currentTask.scheduledTime).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{selectedDriver.currentTask.status}</p>
                  </div>
                  
                  {/* Conditionally show relevant addresses based on task type */}
                  {(selectedDriver.currentTask.type === 'pickup' || selectedDriver.currentTask.type === 'delivery') && (
                    <div>
                      <p className="text-sm text-gray-500">Customer Address</p>
                      <p className="font-medium">{selectedDriver.currentTask.customerAddress}</p>
                    </div>
                  )}
                  
                  {(selectedDriver.currentTask.type === 'drop' || selectedDriver.currentTask.type === 'collect') && (
                    <div>
                      <p className="text-sm text-gray-500">Studio Address</p>
                      <p className="font-medium">{selectedDriver.currentTask.studioAddress}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      // Update the task status to the next stage
                      if (selectedDriver && selectedDriver.currentTask) {
                        const task = selectedDriver.currentTask;
                        const newStatus = task.status === 'pending' ? 'in-progress' : 
                                        task.status === 'in-progress' ? 'completed' : task.status;
                        
                        // Only allow status changes if not already completed
                        if (task.status !== 'completed') {
                          setSelectedDriver({
                            ...selectedDriver,
                            currentTask: {
                              ...task,
                              status: newStatus
                            }
                          });
                          
                          // Update the driver in the list
                          setDrivers(drivers.map(d => 
                            d.id === selectedDriver.id ? {
                              ...d,
                              currentTask: d.currentTask ? {
                                ...d.currentTask,
                                status: newStatus
                              } : undefined
                            } : d
                          ));
                          
                          toast({
                            title: "Task status updated",
                            description: `Task is now ${newStatus}`,
                            duration: 3000,
                          });
                        }
                      }
                    }}
                    className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                    disabled={selectedDriver.currentTask.status === 'completed'}
                  >
                    {selectedDriver.currentTask.status === 'pending' ? 'Start Task' : 
                    selectedDriver.currentTask.status === 'in-progress' ? 'Complete Task' : 'Task Completed'}
                  </button>
                </div>
              </div>
            )}
            
            {/* All Assigned Orders List */}
            {selectedDriver.assignedOrders && selectedDriver.assignedOrders.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium">All Assigned Orders</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {selectedDriver.assignedOrders.map((order) => (
                    <div key={order.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div className="font-medium">{order.id}</div>
                        <div>
                          {order.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : order.status === 'completed' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Customer:</span> {order.customerName}
                        </div>
                        <div>
                          <span className="text-gray-500">Items:</span> {order.items}
                        </div>
                        <div>
                          <span className="text-gray-500">Studio:</span> {order.studioName}
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span> ₹{order.totalAmount}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </div>
                      {selectedDriver.currentTask && selectedDriver.currentTask.orderId === order.id && (
                        <div className="mt-2 text-xs font-medium text-admin-primary">
                          Current active task: {selectedDriver.currentTask.type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsOrderDetailsModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Drivers;

