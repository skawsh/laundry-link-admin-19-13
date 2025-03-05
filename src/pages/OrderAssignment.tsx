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
  CheckSquare
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

const mockDrivers = [
  { id: 'driver1', name: 'John Doe', available: true, location: 'San Francisco Downtown', rating: 4.8, ordersCompleted: 245 },
  { id: 'driver2', name: 'Jane Smith', available: true, location: 'Mission District', rating: 4.9, ordersCompleted: 189 },
  { id: 'driver3', name: 'Mike Johnson', available: false, location: 'Sunset District', rating: 4.7, ordersCompleted: 302 },
  { id: 'driver4', name: 'Sarah Williams', available: true, location: 'Richmond District', rating: 4.6, ordersCompleted: 156 },
  { id: 'driver5', name: 'David Lee', available: true, location: 'Marina District', rating: 4.9, ordersCompleted: 278 },
  { id: 'driver6', name: 'Emily Chen', available: false, location: 'North Beach', rating: 4.8, ordersCompleted: 198 },
  { id: 'driver7', name: 'Robert Taylor', available: true, location: 'SOMA', rating: 4.7, ordersCompleted: 231 },
  { id: 'driver8', name: 'Lisa Wang', available: true, location: 'Hayes Valley', rating: 4.9, ordersCompleted: 167 },
];

const generateMockOrders = (): Order[] => {
  const statuses = Object.keys(ORDER_STATUS) as Array<keyof typeof ORDER_STATUS>;
  const studios = [
    "Clean Express", "Laundry Masters", "Fresh Fold", "Wash & Go", 
    "Premium Cleaners", "City Laundry", "SparkleWash", "Quick Clean",
    "Elite Laundry", "Eco Wash"
  ];
  
  const customers = [
    "Alice Cooper", "Bob Marley", "Charlie Brown", "Diana Ross",
    "Edward Norton", "Fiona Apple", "George Clooney", "Hannah Montana",
    "Ian McKellen", "Julia Roberts", "Kevin Hart", "Laura Palmer",
    "Mark Twain", "Nancy Drew", "Oscar Wilde", "Penelope Cruz"
  ];
  
  const addresses = [
    "123 Main St", "456 Oak Ave", "789 Pine Blvd", "101 Maple Ln",
    "202 Cedar Dr", "303 Birch Ct", "404 Elm Rd", "505 Spruce Way",
    "606 Walnut St", "707 Cherry Ave", "808 Aspen Dr", "909 Willow Ln"
  ];

  const phoneNumbers = [
    "415-555-1234", "415-555-5678", "415-555-9012", "415-555-3456",
    "415-555-7890", "415-555-2345", "415-555-6789", "415-555-0123",
    "415-555-4567", "415-555-8901", "415-555-2345", "415-555-6789"
  ];

  const distances = ["0.8 miles", "1.2 miles", "2.5 miles", "3.7 miles", "1.5 miles", "2.8 miles", "0.5 miles", "4.2 miles"];
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
      customer: customers[Math.floor(Math.random() * customers.length)],
      address: addresses[Math.floor(Math.random() * addresses.length)] + ', San Francisco, CA',
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
      phoneNumber: phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)]
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
    return mockDrivers.filter(driver => driver.available);
  }, []);

  const handleAssignDriver = () => {
    if (selectedOrders.length === 0 || !selectedDriver) {
      toast({
        title: "Error",
        description: "Please select both orders and a driver",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Driver Assigned",
      description: `Driver ${selectedDriver} has been assigned to ${selectedOrders.length} order(s)`,
    });

    setSelectedOrder(null);
    setSelectedOrders([]);
    setSelectedDriver('');
    setShowDriverSelection(false);
    setSelectMode(false);
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
      setShowDriverSelection(true);
    } else {
      toast({
        title: "No Orders Selected",
        description: "Please select at least one order to assign a driver",
        variant: "destructive",
      });
    }
  };

  const selectColumn = {
    header: (
      <div className="flex items-center">
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
      <div className="flex items-center">
        <Checkbox
          checked={isOrderSelected(row.id)}
          onCheckedChange={() => toggleOrderSelection(row)}
        />
      </div>
    ),
    width: "40px",
  };

  const newOrdersColumns = [
    ...(selectMode ? [selectColumn] : []),
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
    ...(selectMode ? [selectColumn] : []),
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
    ...(selectMode ? [selectColumn] : []),
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
            <Button 
              variant={selectMode ? "default" : "outline"} 
              size="sm"
              onClick={toggleSelectMode}
              className="flex items-center gap-1"
            >
              <CheckSquare className="h-4 w-4" />
              {selectMode ? "Exit Select Mode" : "Select Multiple"}
            </Button>
            
            {selectMode && (
              <Button 
                variant="default" 
                size="sm"
                onClick={assignSelectedOrders}
                disabled={selectedOrders.length === 0}
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
