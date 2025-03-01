
import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  Calendar, 
  Building, 
  User, 
  Filter, 
  ArrowUpDown,
  Download,
  Truck,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import StatsCard from '@/components/ui/StatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/DataTable';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from '@/components/ui/PageHeader';

const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-500' },
  in_progress: { label: 'In Progress', color: 'bg-blue-500' },
  completed: { label: 'Completed', color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
  refunded: { label: 'Refunded', color: 'bg-purple-500' },
  in_delivery: { label: 'In Delivery', color: 'bg-teal-500' },
  picked_up: { label: 'Picked Up', color: 'bg-indigo-500' },
};

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  service: string;
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
  deliveredDate?: string;
  notes: string;
}

const generateMockOrders = (): Order[] => {
  const statuses = Object.keys(ORDER_STATUS) as Array<keyof typeof ORDER_STATUS>;
  const studios = [
    "Clean Express", "Laundry Masters", "Fresh Fold", "Wash & Go", 
    "Premium Cleaners", "City Laundry", "SparkleWash", "Quick Clean",
    "Elite Laundry", "Eco Wash"
  ];
  
  const drivers = [
    "John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", 
    "David Lee", "Emily Chen", "Robert Taylor", "Lisa Wang",
    "Michael Brown", "Amanda Garcia"
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

  const getRandomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const calculateTotal = (items: OrderItem[]): string => {
    return items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  const orders: Order[] = [];

  for (let i = 1; i <= 100; i++) {
    const orderDate = getRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 31));
    const items: OrderItem[] = [];
    const itemCount = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 1; j <= itemCount; j++) {
      items.push({
        id: `item-${i}-${j}`,
        name: `${['Shirt', 'Pants', 'Dress', 'Suit', 'Jacket', 'Coat', 'Blanket', 'Bedsheet'][Math.floor(Math.random() * 8)]}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: (Math.random() * 20 + 5).toFixed(2),
        service: ['Standard Wash', 'Dry Clean', 'Express Service', 'Delicate Wash'][Math.floor(Math.random() * 4)]
      });
    }

    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];
    
    const driver = ['in_progress', 'in_delivery', 'picked_up', 'completed'].includes(status) ? 
      drivers[Math.floor(Math.random() * drivers.length)] : null;
    
    const estCompletionDate = new Date(orderDate.getTime() + Math.random() * 86400000 * 3);
    
    const deliveredDate = status === 'completed' ? 
      new Date(estCompletionDate.getTime() + Math.random() * 86400000 * 2) : 
      undefined;
    
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
      estimatedCompletion: estCompletionDate.toISOString(),
      deliveredDate: deliveredDate?.toISOString(),
      notes: Math.random() > 0.7 ? "Customer requested extra care with silk items." : ""
    });
  }

  return orders;
};

const mockOrders = generateMockOrders();

const Orders: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [orderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    pending: true,
    in_progress: true,
    completed: true,
    cancelled: true,
    refunded: true,
    in_delivery: true,
    picked_up: true
  });
  const [dateFilter, setDateFilter] = useState({
    start: '',
    end: ''
  });
  const [priceFilter, setPriceFilter] = useState({
    min: '',
    max: ''
  });
  const [selectedStudio, setSelectedStudio] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<string>('');

  const stats = useMemo(() => {
    const total = mockOrders.length;
    const completed = mockOrders.filter(order => order.status === 'completed').length;
    const inProgress = mockOrders.filter(order => ['in_progress', 'in_delivery', 'picked_up'].includes(order.status)).length;
    const cancelled = mockOrders.filter(order => order.status === 'cancelled').length;
    
    const totalRevenue = mockOrders
      .filter(order => order.status !== 'cancelled' && order.status !== 'refunded')
      .reduce((sum, order) => sum + parseFloat(order.total), 0);
    
    const averageOrderValue = totalRevenue / (total - cancelled);
    
    const studios = [...new Set(mockOrders.map(order => order.studio))];
    
    return {
      total,
      completed,
      inProgress,
      cancelled,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: averageOrderValue.toFixed(2),
      studioCount: studios.length
    };
  }, [mockOrders]);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      if (selectedTab !== 'all' && order.status !== selectedTab) {
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
      
      if (!statusFilters[order.status]) {
        return false;
      }
      
      // All date filtering is based on ordered date only
      if (dateFilter.start && new Date(order.date) < new Date(dateFilter.start)) {
        return false;
      }
      
      if (dateFilter.end && new Date(order.date) > new Date(dateFilter.end)) {
        return false;
      }
      
      if (priceFilter.min && parseFloat(order.total) < parseFloat(priceFilter.min)) {
        return false;
      }
      
      if (priceFilter.max && parseFloat(order.total) > parseFloat(priceFilter.max)) {
        return false;
      }
      
      if (selectedStudio && order.studio !== selectedStudio) {
        return false;
      }
      
      if (selectedDriver && order.driver !== selectedDriver) {
        return false;
      }
      
      return true;
    });
  }, [
    mockOrders, 
    selectedTab, 
    searchQuery, 
    statusFilters, 
    dateFilter, 
    priceFilter,
    selectedStudio,
    selectedDriver
  ]);

  const uniqueStudios = useMemo(() => {
    return [...new Set(mockOrders.map(order => order.studio))];
  }, [mockOrders]);

  const uniqueDrivers = useMemo(() => {
    return [...new Set(mockOrders.filter(order => order.driver).map(order => order.driver || ''))];
  }, [mockOrders]);

  const statusDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    Object.keys(ORDER_STATUS).forEach(status => {
      distribution[status] = mockOrders.filter(order => order.status === status).length;
    });
    return distribution;
  }, [mockOrders]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const resetFilters = () => {
    setStatusFilters({
      pending: true,
      in_progress: true,
      completed: true,
      cancelled: true,
      refunded: true,
      in_delivery: true,
      picked_up: true
    });
    setDateFilter({ start: '', end: '' });
    setPriceFilter({ min: '', max: '' });
    setSelectedStudio('');
    setSelectedDriver('');
  };

  const getWashTypeLabel = (type: string) => {
    if (type === 'combined') return 'Both';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const columns = [
    {
      header: "Order ID",
      accessor: (row: Order) => row.id,
      width: "130px",
    },
    {
      header: "Ordered Date",
      accessor: (row: Order) => new Date(row.date).toLocaleDateString(),
      width: "120px",
    },
    {
      header: "Customer",
      accessor: (row: Order) => row.customer,
    },
    {
      header: "Status",
      accessor: (row: Order) => (
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${ORDER_STATUS[row.status].color}`}></div>
          <span>{ORDER_STATUS[row.status].label}</span>
        </div>
      ),
    },
    {
      header: "Studio",
      accessor: (row: Order) => row.studio,
    },
    {
      header: "Driver",
      accessor: (row: Order) => row.driver || "—",
    },
    {
      header: "Total",
      accessor: (row: Order) => `$${row.total}`,
      width: "100px",
    },
    {
      header: "Delivered Date",
      accessor: (row: Order) => row.deliveredDate ? new Date(row.deliveredDate).toLocaleDateString() : "—",
      width: "120px",
    },
    {
      header: "Actions",
      accessor: (row: Order) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleOrderClick(row)}
        >
          View Details
        </Button>
      ),
      width: "120px",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <PageHeader
          title="Order Management"
          subtitle="View and manage all customer orders"
        >
          <Button variant="outline" className="flex gap-2 items-center">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <a href="/orders/assignment">
              <UserPlus className="h-4 w-4" />
              Order Assignment
            </a>
          </Button>
          <Button>Add New Order</Button>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Orders"
            value={stats.total}
            icon={<ShoppingBag className="h-5 w-5" />}
            change={{ value: "+12%", trend: "up" }}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: "+5%", trend: "up" }}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue}`}
            icon={<DollarSign className="h-5 w-5" />}
            change={{ value: "+8.5%", trend: "up" }}
          />
          <StatsCard
            title="Avg. Order Value"
            value={`$${stats.averageOrderValue}`}
            icon={<ArrowUpDown className="h-5 w-5" />}
            change={{ value: "+2.3%", trend: "up" }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-subtle p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-lg font-medium mb-2 md:mb-0">Orders Overview</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64"
                />
              </div>
              
              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-4">
                    <h3 className="font-medium">Filter Orders</h3>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Order Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`status-${key}`} 
                              checked={statusFilters[key]}
                              onCheckedChange={(checked) => 
                                setStatusFilters(prev => ({
                                  ...prev, 
                                  [key]: Boolean(checked)
                                }))
                              }
                            />
                            <label htmlFor={`status-${key}`} className="text-sm">
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Order Date</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="date-from">From</Label>
                          <Input
                            id="date-from"
                            type="date"
                            value={dateFilter.start}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="date-to">To</Label>
                          <Input
                            id="date-to"
                            type="date"
                            value={dateFilter.end}
                            onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Order Total</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="price-min">Min ($)</Label>
                          <Input
                            id="price-min"
                            type="number"
                            placeholder="0"
                            value={priceFilter.min}
                            onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="price-max">Max ($)</Label>
                          <Input
                            id="price-max"
                            type="number"
                            placeholder="1000"
                            value={priceFilter.max}
                            onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="studio-filter">Studio</Label>
                      <Select 
                        value={selectedStudio} 
                        onValueChange={setSelectedStudio}
                      >
                        <SelectTrigger id="studio-filter">
                          <SelectValue placeholder="All Studios" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Studios</SelectItem>
                          {uniqueStudios.map((studio) => (
                            <SelectItem key={studio} value={studio}>
                              {studio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="driver-filter">Driver</Label>
                      <Select 
                        value={selectedDriver} 
                        onValueChange={setSelectedDriver}
                      >
                        <SelectTrigger id="driver-filter">
                          <SelectValue placeholder="All Drivers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Drivers</SelectItem>
                          {uniqueDrivers.map((driver) => (
                            <SelectItem key={driver} value={driver}>
                              {driver}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={resetFilters}
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
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="in_delivery">In Delivery</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <DataTable
                columns={columns}
                data={filteredOrders}
                keyField="id"
                searchPlaceholder="Search orders..."
                onSearch={setSearchQuery}
                emptyMessage="No orders found matching your criteria"
                initialSearchQuery={searchQuery}
                searchSuggestions={true}
                searchFields={["id", "customer", "studio"]}
              />
            </TabsContent>
            
            {Object.keys(ORDER_STATUS).map((status) => (
              <TabsContent key={status} value={status} className="mt-0">
                <DataTable
                  columns={columns}
                  data={filteredOrders}
                  keyField="id"
                  searchPlaceholder="Search orders..."
                  onSearch={setSearchQuery}
                  emptyMessage="No orders found matching your criteria"
                  initialSearchQuery={searchQuery}
                  searchSuggestions={true}
                  searchFields={["id", "customer", "studio"]}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>
                Current distribution of orders by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${ORDER_STATUS[status as keyof typeof ORDER_STATUS].color}`}></div>
                      <span className="text-sm font-medium">{ORDER_STATUS[status as keyof typeof ORDER_STATUS].label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-gray-500">
                        ({((count / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Studios</CardTitle>
              <CardDescription>
                Studios with the most orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uniqueStudios
                  .map(studio => ({
                    name: studio,
                    count: mockOrders.filter(order => order.studio === studio).length,
                    revenue: mockOrders
                      .filter(order => order.studio === studio && order.status !== 'cancelled' && order.status !== 'refunded')
                      .reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)
                  }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((studio, index) => (
                    <div key={studio.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{studio.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{studio.count} orders</div>
                        <div className="text-xs text-gray-500">${studio.revenue}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Drivers</CardTitle>
              <CardDescription>
                Drivers with the most deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uniqueDrivers
                  .map(driver => ({
                    name: driver,
                    count: mockOrders.filter(order => order.driver === driver).length,
                    completed: mockOrders.filter(order => order.driver === driver && order.status === 'completed').length
                  }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((driver, index) => (
                    <div key={driver.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{driver.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{driver.count} orders</div>
                        <div className="text-xs text-gray-500">
                          {driver.completed} completed ({((driver.completed / driver.count) * 100).toFixed(0)}%)
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {mockOrders
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((order) => (
                <div key={order.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`rounded-full h-10 w-10 flex items-center justify-center text-white ${ORDER_STATUS[order.status].color}`}>
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Order {order.id} ({ORDER_STATUS[order.status].label})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.date).toLocaleString()} • {order.customer} • ${order.total}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-base font-medium">{selectedOrder.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Ordered Date</p>
                  <p className="text-base font-medium">
                    {new Date(selectedOrder.date).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${ORDER_STATUS[selectedOrder.status].color}`}></div>
                    <p className="text-base font-medium">{ORDER_STATUS[selectedOrder.status].label}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium">{selectedOrder.customer}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedOrder.address}</p>
                    <p className="text-sm text-gray-500 mt-1">Payment: {selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Studio & Delivery
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium">Studio: {selectedOrder.studio}</p>
                    {selectedOrder.driver && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <Truck className="h-3.5 w-3.5 mr-1" />
                        Driver: {selectedOrder.driver}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Est. Completion: {new Date(selectedOrder.estimatedCompletion).toLocaleString()}
                    </p>
                    {selectedOrder.deliveredDate && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Delivered: {new Date(selectedOrder.deliveredDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.service}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          ${item.price}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        ${selectedOrder.total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  Update Status
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
