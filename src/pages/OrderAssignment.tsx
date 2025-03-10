import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Clock,
  Calendar,
  UserPlus,
  Package,
  Truck,
  AlertTriangle,
  Filter,
  ShirtIcon,
  WashingMachine,
  RefreshCcw,
  CheckSquare,
  Check,
  Square
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import DataTable from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { assignOrdersToDriver, getDriverAssignments } from '@/store/driverAssignmentStore';

const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-500' },
  in_progress: { label: 'In Progress', color: 'bg-blue-500' },
  completed: { label: 'Completed', color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
  refunded: { label: 'Refunded', color: 'bg-purple-500' },
  in_delivery: { label: 'In Delivery', color: 'bg-teal-500' },
  picked_up: { label: 'Picked Up', color: 'bg-indigo-500' },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'bg-emerald-500' },
  rescheduled: { label: 'Rescheduled', color: 'bg-orange-500' },
};

const WASH_TYPES = {
  standard: { label: 'Standard Wash', icon: WashingMachine },
  quick: { label: 'Quick Wash', icon: ShirtIcon },
};

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  service: keyof typeof WASH_TYPES;
}

interface Order {
  id: string;
  date: string;
  customer: string;
  address: string;
  status: keyof typeof ORDER_STATUS;
  studio: string;
  items: OrderItem[];
  total: string;
  driver: string | null;
  paymentMethod: string;
  estimatedCompletion: string;
  notes: string;
  washType: keyof typeof WASH_TYPES;
  rescheduleReason?: string;
  rescheduleDate?: string;
  priority: 'low' | 'medium' | 'high';
  distance: string;
  phoneNumber: string;
}

interface Driver {
  id: string;
  name: string;
  available: boolean;
  location: string;
  rating: number;
  ordersCompleted: number;
  currentlyDelivering?: boolean;
  phone: string;
  email: string;
  address: string;
  vehicleType: string;
  vehicleNumber: string;
}

const mockDrivers: Driver[] = [
  { 
    id: 'driver1', 
    name: 'Raj Kumar', 
    available: true, 
    location: 'Banjara Hills, Hyderabad', 
    rating: 4.8, 
    ordersCompleted: 245,
    phone: '+91 9876543210',
    email: 'raj.kumar@example.com',
    address: '14-7-125, Road No. 12, Banjara Hills, Hyderabad',
    vehicleType: 'Scooter',
    vehicleNumber: 'TS 10 AB 1234'
  },
  { 
    id: 'driver2', 
    name: 'Priya Sharma', 
    available: true, 
    location: 'Jubilee Hills, Hyderabad', 
    rating: 4.9, 
    ordersCompleted: 189,
    phone: '+91 9876543211',
    email: 'priya.sharma@example.com',
    address: '8-2-293/82/A, Jubilee Hills, Hyderabad',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'TS 11 CD 5678'
  },
  { 
    id: 'driver3', 
    name: 'Arjun Reddy', 
    available: false, 
    location: 'Gachibowli, Hyderabad', 
    rating: 4.7, 
    ordersCompleted: 302,
    phone: '+91 9876543212',
    email: 'arjun.reddy@example.com',
    address: '2-53/1, Gachibowli Main Road, Hyderabad',
    vehicleType: 'Scooter',
    vehicleNumber: 'TS 12 EF 9012'
  },
  { 
    id: 'driver4', 
    name: 'Ananya Patel', 
    available: true, 
    location: 'Ameerpet, Hyderabad', 
    rating: 4.6, 
    ordersCompleted: 156,
    phone: '+91 9876543213',
    email: 'ananya.patel@example.com',
    address: '7-1-621/A, Ameerpet, Hyderabad',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'TS 13 GH 3456'
  },
  { 
    id: 'driver5', 
    name: 'Vikram Singh', 
    available: true, 
    location: 'Hitech City, Hyderabad', 
    rating: 4.9, 
    ordersCompleted: 278,
    phone: '+91 9876543214',
    email: 'vikram.singh@example.com',
    address: '4-98/3, Hitech City Main Road, Hyderabad',
    vehicleType: 'Scooter',
    vehicleNumber: 'TS 14 IJ 7890'
  },
  { 
    id: 'driver6', 
    name: 'Meera Iyer', 
    available: false, 
    location: 'Kukatpally, Hyderabad', 
    rating: 4.8, 
    ordersCompleted: 198,
    phone: '+91 9876543215',
    email: 'meera.iyer@example.com',
    address: '3-6-254, KPHB Colony, Kukatpally, Hyderabad',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'TS 15 KL 1234'
  },
  { 
    id: 'driver7', 
    name: 'Ramesh Rao', 
    available: true, 
    location: 'Madhapur, Hyderabad', 
    rating: 4.7, 
    ordersCompleted: 231,
    phone: '+91 9876543216',
    email: 'ramesh.rao@example.com',
    address: '1-74/1, Ayyappa Society, Madhapur, Hyderabad',
    vehicleType: 'Scooter',
    vehicleNumber: 'TS 16 MN 5678'
  },
  { 
    id: 'driver8', 
    name: 'Deepika Nair', 
    available: true, 
    location: 'Kondapur, Hyderabad', 
    rating: 4.9, 
    ordersCompleted: 167,
    phone: '+91 9876543217',
    email: 'deepika.nair@example.com',
    address: '5-12/9, Kondapur Main Road, Hyderabad',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'TS 17 OP 9012'
  },
  { 
    id: 'driver9', 
    name: 'Sanjay Kapoor', 
    available: true, 
    location: 'Secunderabad, Hyderabad', 
    rating: 4.8, 
    ordersCompleted: 213,
    phone: '+91 9876543218',
    email: 'sanjay.kapoor@example.com',
    address: '10-3-287, MG Road, Secunderabad, Hyderabad',
    vehicleType: 'Scooter',
    vehicleNumber: 'TS 18 QR 3456'
  },
  { 
    id: 'driver10', 
    name: 'Lakshmi Devi', 
    available: true, 
    location: 'Begumpet, Hyderabad', 
    rating: 4.8, 
    ordersCompleted: 190,
    phone: '+91 9876543219',
    email: 'lakshmi.devi@example.com',
    address: '6-3-345, Begumpet Main Road, Hyderabad',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'TS 19 ST 7890'
  }
];

const hyderabadAddresses = [
  "12-1-509, Road No. 2, Banjara Hills, Hyderabad",
  "8-2-120/86, Jubilee Hills, Hyderabad",
  "2-10/92, Financial District, Gachibowli, Hyderabad",
  "7-1-397, Ameerpet Main Road, Hyderabad",
  "4-51/17, Hitech City, Hyderabad",
  "3-6-111, KPHB Phase 3, Kukatpally, Hyderabad",
  "1-98/4, Ayyappa Society, Madhapur, Hyderabad",
  "5-9/214, Kondapur Main Road, Hyderabad",
  "10-3-156, Paradise Circle, Secunderabad, Hyderabad",
  "6-3-248, Panjagutta, Hyderabad",
  "9-1-87, Toli Chowki, Hyderabad",
  "11-4-163, Masab Tank, Hyderabad"
];

const indianCustomers = [
  "Ankit Sharma", "Neha Gupta", "Ravi Patel", "Divya Reddy",
  "Siddharth Iyer", "Pooja Mehta", "Karthik Nair", "Aarti Kapoor",
  "Vijay Kumar", "Shweta Singh", "Mohit Verma", "Swati Joshi",
  "Rahul Malhotra", "Priyanka Desai", "Suresh Choudhary", "Nandini Rao"
];

const generateMockOrders = (): Order[] => {
  const statuses = Object.keys(ORDER_STATUS) as Array<keyof typeof ORDER_STATUS>;
  const studios = [
    "Swift Wash", "Clean Express", "Fresh Fold", "Wash & Go", 
    "Premium Cleaners", "City Laundry", "SparkleWash", "Quick Clean",
    "Elite Laundry", "Eco Wash"
  ];
  
  const indianPhoneNumbers = [
    "+91 9876123456", "+91 9871234567", "+91 8876543210", "+91 7776543210",
    "+91 9988776655", "+91 8866554433", "+91 7744332211", "+91 9900112233",
    "+91 8877665544", "+91 7766554433", "+91 9865432170", "+91 8954321678"
  ];
  
  const distances = ["1.2 km", "2.5 km", "3.7 km", "0.8 km", "1.5 km", "2.8 km", "0.5 km", "4.2 km"];
  const priorities = ["low", "medium", "high"] as const;
  const washTypes = Object.keys(WASH_TYPES) as Array<keyof typeof WASH_TYPES>;

  const getRandomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const calculateTotal = (items: OrderItem[]): string => {
    return items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  const orders: Order[] = [];

  for (let i = 1; i <= 100; i++) {
    const orderDate = getRandomDate(new Date(2023, 0, 1), new Date());
    const washType = washTypes[Math.floor(Math.random() * washTypes.length)];
    const items: OrderItem[] = [];
    const itemCount = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 1; j <= itemCount; j++) {
      items.push({
        id: `item-${i}-${j}`,
        name: `${['Shirt', 'Pants', 'Dress', 'Suit', 'Jacket', 'Coat', 'Blanket', 'Bedsheet'][Math.floor(Math.random() * 8)]}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: (Math.random() * 20 + 5).toFixed(2),
        service: washType
      });
    }

    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];

    let rescheduleReason, rescheduleDate;
    if (status === 'rescheduled') {
      const reasons = [
        "Customer requested later time",
        "Studio equipment malfunction",
        "Driver unavailable",
        "Weather conditions",
        "Customer not at home during delivery attempt"
      ];
      rescheduleReason = reasons[Math.floor(Math.random() * reasons.length)];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 7) + 1);
      rescheduleDate = futureDate.toISOString();
    }
    
    const driver = ['in_progress', 'in_delivery', 'picked_up'].includes(status) ? 
      mockDrivers[Math.floor(Math.random() * mockDrivers.length)].name : null;
    
    orders.push({
      id: `ORD-${10000 + i}`,
      date: orderDate.toISOString(),
      customer: indianCustomers[Math.floor(Math.random() * indianCustomers.length)],
      address: hyderabadAddresses[Math.floor(Math.random() * hyderabadAddresses.length)],
      status: status,
      studio: studios[Math.floor(Math.random() * studios.length)],
      items: items,
      total: calculateTotal(items),
      driver: driver,
      paymentMethod: Math.random() > 0.7 ? 'Credit Card' : 'PayPal',
      estimatedCompletion: new Date(orderDate.getTime() + Math.random() * 86400000 * 3).toISOString(),
      notes: Math.random() > 0.7 ? "Customer requested extra care with silk items." : "",
      washType: washType,
      rescheduleReason: rescheduleReason,
      rescheduleDate: rescheduleDate,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      distance: distances[Math.floor(Math.random() * distances.length)],
      phoneNumber: indianPhoneNumbers[Math.floor(Math.random() * indianPhoneNumbers.length)]
    });
  }

  return orders;
};

const mockOrders = generateMockOrders();

const OrderAssignment: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDriverSelection, setShowDriverSelection] = useState(false);
  const [washTypeFilter, setWashTypeFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [orderIdsForToast, setOrderIdsForToast] = useState<string[]>([]);
  const [assignedDriverName, setAssignedDriverName] = useState<string>('');

  const driversWithStatus = useMemo(() => {
    return mockDrivers.map(driver => ({
      ...driver,
      currentlyDelivering: mockOrders.some(order => 
        order.status === 'in_delivery' && order.driver === driver.name
      )
    }));
  }, [mockDrivers, mockOrders]);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      if (selectedTab === 'new' && order.status !== 'pending') {
        return false;
      }
      if (selectedTab === 'ready' && order.status !== 'ready_for_pickup') {
        return false;
      }
      if (selectedTab === 'rescheduled' && order.status !== 'rescheduled') {
        return false;
      }
      
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesID = order.id.toLowerCase().includes(searchLower);
        const matchesCustomer = order.customer.toLowerCase().includes(searchLower);
        const matchesStudio = order.studio.toLowerCase().includes(searchLower);
        
        if (!matchesID && !matchesCustomer && !matchesStudio) {
          return false;
        }
      }
      
      if (washTypeFilter !== 'all' && order.washType !== washTypeFilter) {
        return false;
      }
      
      return true;
    });
  }, [mockOrders, selectedTab, searchQuery, washTypeFilter]);

  const availableDrivers = useMemo(() => {
    return driversWithStatus.filter(driver => driver.available);
  }, [driversWithStatus]);

  const handleAssignDriver = () => {
    if (selectedOrders.length === 0 || !selectedDriver) {
      toast({
        title: "Error",
        description: "Please select both orders and a driver",
        variant: "destructive",
      });
      return;
    }

    const driverName = mockDrivers.find(d => d.id === selectedDriver)?.name || '';
    const orderIds = selectedOrders.map(order => order.id);
    
    setOrderIdsForToast(orderIds);
    setAssignedDriverName(driverName);

    const ordersForStore = selectedOrders.map(order => ({
      id: order.id,
      customer: order.customer,
      address: order.address,
      status: 'in_delivery',
      date: order.date,
      phoneNumber: order.phoneNumber
    }));

    assignOrdersToDriver(selectedDriver, driverName, ordersForStore);

    toast({
      title: "Driver Assigned",
      description: `${driverName} has been assigned to ${orderIds.join(', ')}`,
    });

    setSelectedOrder(null);
    setSelectedOrders([]);
    setSelectedDriver('');
    setShowDriverSelection(false);
    setSelectMode(false);
    setAssignmentDialogOpen(false);
  };

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const handleOrderSelect = (order: Order) => {
    if (selectMode) {
      return;
    }
    setSelectedOrder(order);
    setSelectedOrders([order]);
    setShowDriverSelection(true);
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (!selectMode) {
      setSelectedOrder(null);
      setSelectedOrders([]);
    } else {
      setSelectedOrders([]);
    }
  };

  const toggleOrderSelection = (order: Order) => {
    const orderIndex = selectedOrders.findIndex(o => o.id === order.id);
    if (orderIndex >= 0) {
      setSelectedOrders(prevOrders => prevOrders.filter(o => o.id !== order.id));
    } else {
      setSelectedOrders(prevOrders => [...prevOrders, order]);
    }
  };

  const isOrderSelected = (orderId: string) => {
    return selectedOrders.some(order => order.id === orderId);
  };

  const assignSelectedOrders = () => {
    if (selectedOrders.length > 0) {
      setAssignmentDialogOpen(true);
    } else {
      toast({
        title: "No Orders Selected",
        description: "Please select at least one order to assign a driver",
        variant: "destructive",
      });
    }
  };

  const serialNumberColumn = {
    header: "#",
    accessor: (_: Order, index: number) => <span>{index + 1}</span>,
    width: "60px",
  };

  const selectColumn = {
    header: (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedOrders(filteredOrders);
            } else {
              setSelectedOrders([]);
            }
          }}
        />
      </div>
    ),
    accessor: (row: Order) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isOrderSelected(row.id)}
          onCheckedChange={() => toggleOrderSelection(row)}
        />
      </div>
    ),
    width: "60px",
  };

  const newOrdersColumns = [
    serialNumberColumn,
    selectColumn,
    {
      header: "Order ID",
      accessor: "id" as keyof Order,
      width: "120px",
    },
    {
      header: "Date",
      accessor: (row: Order) => new Date(row.date).toLocaleDateString(),
      width: "120px",
    },
    {
      header: "Customer",
      accessor: "customer" as keyof Order,
    },
    {
      header: "Phone",
      accessor: "phoneNumber" as keyof Order,
    },
    {
      header: "Address",
      accessor: "address" as keyof Order,
    },
    {
      header: "Studio",
      accessor: "studio" as keyof Order,
    },
    {
      header: "Wash Type",
      accessor: (row: Order) => (
        <div className="flex items-center">
          {row.washType === 'standard' ? 
            <WashingMachine className="mr-2 h-4 w-4" /> : 
            <ShirtIcon className="mr-2 h-4 w-4" />
          }
          {WASH_TYPES[row.washType].label}
        </div>
      ),
    },
    {
      header: "Priority",
      accessor: (row: Order) => (
        <Badge className={
          row.priority === 'high' ? 'bg-red-500' : 
          row.priority === 'medium' ? 'bg-yellow-500' : 
          'bg-blue-500'
        }>
          {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Distance",
      accessor: "distance" as keyof Order,
      width: "120px",
    },
    {
      header: "Action",
      accessor: (row: Order) => (
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => handleOrderSelect(row)}
        >
          <UserPlus className="h-4 w-4" />
          Assign
        </Button>
      ),
      width: "120px",
    },
  ];

  const readyOrdersColumns = [
    serialNumberColumn,
    selectColumn,
    {
      header: "Order ID",
      accessor: "id" as keyof Order,
      width: "120px",
    },
    {
      header: "Date",
      accessor: (row: Order) => new Date(row.date).toLocaleDateString(),
      width: "120px",
    },
    {
      header: "Customer",
      accessor: "customer" as keyof Order,
    },
    {
      header: "Studio",
      accessor: "studio" as keyof Order,
    },
    {
      header: "Wash Type",
      accessor: (row: Order) => (
        <div className="flex items-center">
          {row.washType === 'standard' ? 
            <WashingMachine className="mr-2 h-4 w-4" /> : 
            <ShirtIcon className="mr-2 h-4 w-4" />
          }
          {WASH_TYPES[row.washType].label}
        </div>
      ),
    },
    {
      header: "Priority",
      accessor: (row: Order) => (
        <Badge className={
          row.priority === 'high' ? 'bg-red-500' : 
          row.priority === 'medium' ? 'bg-yellow-500' : 
          'bg-blue-500'
        }>
          {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Ready Since",
      accessor: (row: Order) => {
        const readyDate = new Date(row.date);
        readyDate.setHours(readyDate.getHours() + 4);
        return readyDate.toLocaleString();
      },
    },
    {
      header: "Action",
      accessor: (row: Order) => (
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => handleOrderSelect(row)}
        >
          <UserPlus className="h-4 w-4" />
          Assign
        </Button>
      ),
      width: "120px",
    },
  ];

  const rescheduledOrdersColumns = [
    serialNumberColumn,
    selectColumn,
    {
      header: "Order ID",
      accessor: "id" as keyof Order,
      width: "120px",
    },
    {
      header: "Original Date",
      accessor: (row: Order) => new Date(row.date).toLocaleDateString(),
      width: "120px",
    },
    {
      header: "Rescheduled To",
      accessor: (row: Order) => row.rescheduleDate ? new Date(row.rescheduleDate).toLocaleDateString() : "N/A",
      width: "140px",
    },
    {
      header: "Customer",
      accessor: "customer" as keyof Order,
    },
    {
      header: "Reason",
      accessor: (row: Order) => row.rescheduleReason || "Not specified",
    },
    {
      header: "Wash Type",
      accessor: (row: Order) => (
        <div className="flex items-center">
          {row.washType === 'standard' ? 
            <WashingMachine className="mr-2 h-4 w-4" /> : 
            <ShirtIcon className="mr-2 h-4 w-4" />
          }
          {WASH_TYPES[row.washType].label}
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (row: Order) => (
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => handleOrderSelect(row)}
        >
          <UserPlus className="h-4 w-4" />
          Assign
        </Button>
      ),
      width: "120px",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader
          title="Order Assignment"
          subtitle="Assign drivers to orders and manage order dispatch"
        >
          <div className="flex items-center gap-2">
            <Link to="/orders">
              <Button 
                variant="back" 
                size="icon" 
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant={selectMode ? "default" : "outline"} 
              size="sm"
              onClick={toggleSelectMode}
              className="flex items-center gap-1"
            >
              {selectMode ? (
                <>
                  <Check className="h-4 w-4" />
                  Exit Select Mode
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4" />
                  Select Multiple
                </>
              )}
            </Button>
            
            {selectedOrders.length > 0 && (
              <Button 
                variant="default" 
                size="sm"
                onClick={assignSelectedOrders}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Assign Selected ({selectedOrders.length})
              </Button>
            )}
            
            <Select
              value={washTypeFilter}
              onValueChange={setWashTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Wash Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wash Types</SelectItem>
                <SelectItem value="standard">Standard Wash</SelectItem>
                <SelectItem value="quick">Quick Wash</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </PageHeader>

        <div className="bg-white rounded-lg shadow-subtle mb-6">
          <Tabs defaultValue="new" onValueChange={setSelectedTab}>
            <TabsList className="mb-0 p-4 bg-gray-50 border-b border-gray-100 rounded-t-lg">
              <TabsTrigger value="new" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                New Orders
              </TabsTrigger>
              <TabsTrigger value="ready" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Ready for Pickup
              </TabsTrigger>
              <TabsTrigger value="rescheduled" className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Rescheduled
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">New Order Assignments</h3>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {filteredOrders.length} Orders Pending
                </Badge>
              </div>
              <DataTable
                columns={newOrdersColumns}
                data={filteredOrders}
                keyField="id"
                searchPlaceholder="Search new orders..."
                onSearch={setSearchQuery}
                initialSearchQuery={searchQuery}
                emptyMessage="No new orders found"
                selectedRows={selectedOrders.map(order => order.id)}
              />
            </TabsContent>

            <TabsContent value="ready" className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Orders Ready for Pickup</h3>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {filteredOrders.length} Orders Ready
                </Badge>
              </div>
              <DataTable
                columns={readyOrdersColumns}
                data={filteredOrders}
                keyField="id"
                searchPlaceholder="Search ready orders..."
                onSearch={setSearchQuery}
                initialSearchQuery={searchQuery}
                emptyMessage="No orders ready for pickup"
                selectedRows={selectedOrders.map(order => order.id)}
              />
            </TabsContent>

            <TabsContent value="rescheduled" className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-medium">Rescheduled Orders</h3>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {filteredOrders.length} Orders Rescheduled
                </Badge>
              </div>
              <DataTable
                columns={rescheduledOrdersColumns}
                data={filteredOrders}
                keyField="id"
                searchPlaceholder="Search rescheduled orders..."
                onSearch={setSearchQuery}
                initialSearchQuery={searchQuery}
                emptyMessage="No rescheduled orders found"
                selectedRows={selectedOrders.map(order => order.id)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {showDriverSelection && (
          <Card className="mb-6">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                Driver Assignment
              </CardTitle>
              <CardDescription>
                {selectedOrders.length > 1 
                  ? `Assign a driver to ${selectedOrders.length} selected orders` 
                  : selectedOrder 
                    ? `Assign a driver to order ${selectedOrder.id} for ${selectedOrder.customer}`
                    : selectedOrders.length === 1 
                      ? `Assign a driver to order ${selectedOrders[0].id} for ${selectedOrders[0].customer}`
                      : "Assign a driver to selected orders"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <h3 className="font-medium mb-2">Order Details</h3>
                  {selectedOrders.length > 1 ? (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Selected Orders:</span>
                        <span className="text-sm font-medium">{selectedOrders.length}</span>
                      </div>
                      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md mb-2">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Order ID</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Customer</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedOrders.map(order => (
                              <tr key={order.id}>
                                <td className="px-3 py-2 text-sm text-gray-700">{order.id}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{order.customer}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      {selectedOrder || selectedOrders.length === 1 ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Order ID:</span>
                            <span className="text-sm font-medium">{selectedOrder ? selectedOrder.id : selectedOrders[0].id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Customer:</span>
                            <span className="text-sm font-medium">{selectedOrder ? selectedOrder.customer : selectedOrders[0].customer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Address:</span>
                            <span className="text-sm font-medium">{selectedOrder ? selectedOrder.address : selectedOrders[0].address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Phone:</span>
                            <span className="text-sm font-medium">{selectedOrder ? selectedOrder.phoneNumber : selectedOrders[0].phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Studio:</span>
                            <span className="text-sm font-medium">{selectedOrder ? selectedOrder.studio : selectedOrders[0].studio}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Wash Type:</span>
                            <span className="text-sm font-medium flex items-center">
                              {(selectedOrder ? selectedOrder.washType : selectedOrders[0].washType) === 'standard' ? 
                                <WashingMachine className="mr-1 h-3 w-3" /> : 
                                <ShirtIcon className="mr-1 h-3 w-3" />
                              }
                              {WASH_TYPES[selectedOrder ? selectedOrder.washType : selectedOrders[0].washType].label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total:</span>
                            <span className="text-sm font-medium">${selectedOrder ? selectedOrder.total : selectedOrders[0].total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Distance:</span>
                            <span className="text-sm font-medium">{selectedOrder ? selectedOrder.distance : selectedOrders[0].distance}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No orders selected
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Available Drivers</h3>
                    <Badge variant="outline" className="text-sm">
                      {availableDrivers.length} Drivers Available
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableDrivers.map((driver) => (
                      <div 
                        key={driver.id}
                        className={`border p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedDriver === driver.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
                        }`}
                        onClick={() => handleDriverSelect(driver.id)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{driver.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {driver.rating} ★
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                          <Truck className="h-3 w-3" />
                          {driver.ordersCompleted} deliveries completed
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {driver.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedOrder(null);
                    setSelectedOrders([]);
                    setSelectedDriver('');
                    setShowDriverSelection(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!selectedDriver || selectedOrders.length === 0}
                  onClick={handleAssignDriver}
                  className="flex items-center gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Assign Driver
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Order Assignment Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded-lg p-3">
                  <div className="text-3xl font-bold text-blue-600">
                    {mockOrders.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-500">New Orders</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-3xl font-bold text-green-600">
                    {mockOrders.filter(o => o.status === 'ready_for_pickup').length}
                  </div>
                  <div className="text-sm text-gray-500">Ready for Pickup</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-3xl font-bold text-orange-600">
                    {mockOrders.filter(o => o.status === 'rescheduled').length}
                  </div>
                  <div className="text-sm text-gray-500">Rescheduled</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-3xl font-bold text-indigo-600">
                    {mockOrders.filter(o => o.status === 'in_delivery').length}
                  </div>
                  <div className="text-sm text-gray-500">In Delivery</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Wash Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WashingMachine className="h-5 w-5 text-blue-500" />
                    <span>Standard Wash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {mockOrders.filter(o => o.washType === 'standard').length}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(mockOrders.filter(o => o.washType === 'standard').length / mockOrders.length * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.round(mockOrders.filter(o => o.washType === 'standard').length / mockOrders.length * 100)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShirtIcon className="h-5 w-5 text-green-500" />
                    <span>Quick Wash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {mockOrders.filter(o => o.washType === 'quick').length}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(mockOrders.filter(o => o.washType === 'quick').length / mockOrders.length * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.round(mockOrders.filter(o => o.washType === 'quick').length / mockOrders.length * 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Driver Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Available Drivers</span>
                <span className="font-medium">{mockDrivers.filter(d => d.available).length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.round(mockDrivers.filter(d => d.available).length / mockDrivers.length * 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Unavailable Drivers</span>
                <span className="font-medium">{mockDrivers.filter(d => !d.available).length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.round(mockDrivers.filter(d => !d.available).length / mockDrivers.length * 100)}%` }}
                ></div>
              </div>
              
              <Button variant="outline" className="w-full mt-2 text-sm">
                View All Drivers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Assign Driver to Orders
            </DialogTitle>
            <DialogDescription>
              Select a driver to assign {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Selected Orders</h3>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Order ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Customer</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Address</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrders.map(order => (
                      <tr key={order.id}>
                        <td className="px-3 py-2 text-sm text-gray-700">{order.id}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{order.customer}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{order.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Available Drivers</h3>
                <Badge variant="outline" className="text-xs">
                  {driversWithStatus.filter(d => d.available).length} Available / {driversWithStatus.length} Total
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {driversWithStatus.map((driver) => (
                  <div 
                    key={driver.id}
                    className={`border p-3 rounded-lg cursor-pointer transition-colors ${
                      !driver.available ? 'opacity-60 bg-gray-50' : 
                      selectedDriver === driver.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => driver.available && handleDriverSelect(driver.id)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{driver.name}</span>
                      <div className="flex gap-1">
                        {driver.currentlyDelivering && (
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                            Delivering
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {driver.rating} ★
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                      <Truck className="h-3 w-3" />
                      {driver.ordersCompleted} deliveries completed
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {driver.location}
                    </div>
                    {!driver.available && (
                      <Badge className="mt-2 w-full justify-center text-xs bg-red-100 text-red-800 hover:bg-red-100">
                        Currently Unavailable
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={!selectedDriver || selectedOrders.length === 0}
              onClick={handleAssignDriver}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Assign Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const MapPin = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export default OrderAssignment;
