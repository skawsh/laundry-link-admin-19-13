
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import StatsCard from '@/components/ui/StatsCard';
import DataTable from '@/components/ui/DataTable';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Activity, 
  Calendar, 
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Mail,
  Lock,
  UserMinus,
  Smartphone,
  ShoppingBag,
  Map,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  lastActive: string;
  status: string;
  ordersCount: number;
  totalSpent: number;
  avatar?: string;
  primaryDevice: string;
  preferredPaymentMethod: string;
  lastOrderDate?: string;
}

interface UserActivity {
  date: string;
  active: number;
  new: number;
}

interface UserSegment {
  name: string;
  value: number;
}

interface DeviceDistribution {
  name: string;
  value: number;
}

interface RetentionData {
  month: string;
  rate: number;
}

interface UserSpending {
  month: string;
  amount: number;
}

const customersData: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joinDate: '2022-06-01',
    lastActive: '2023-05-15T09:32:45',
    status: 'active',
    ordersCount: 12,
    totalSpent: 547.80,
    primaryDevice: 'iOS',
    preferredPaymentMethod: 'Credit Card',
    lastOrderDate: '2023-05-10'
  },
  {
    id: 'cust-002',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Los Angeles, USA',
    joinDate: '2021-02-15',
    lastActive: '2023-05-15T10:45:12',
    status: 'active',
    ordersCount: 28,
    totalSpent: 1206.35,
    primaryDevice: 'Android',
    preferredPaymentMethod: 'PayPal',
    lastOrderDate: '2023-05-14'
  },
  {
    id: 'cust-003',
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Chicago, USA',
    joinDate: '2022-01-10',
    lastActive: '2023-05-10T14:22:33',
    status: 'inactive',
    ordersCount: 6,
    totalSpent: 287.92,
    primaryDevice: 'iOS',
    preferredPaymentMethod: 'Credit Card',
    lastOrderDate: '2023-04-22'
  },
  {
    id: 'cust-004',
    name: 'Sophia Garcia',
    email: 'sophia.g@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Miami, USA',
    joinDate: '2021-11-05',
    lastActive: '2023-05-15T08:17:55',
    status: 'active',
    ordersCount: 17,
    totalSpent: 789.45,
    primaryDevice: 'Android',
    preferredPaymentMethod: 'Credit Card',
    lastOrderDate: '2023-05-15'
  },
  {
    id: 'cust-005',
    name: 'James Wilson',
    email: 'jwilson@example.com',
    phone: '+1 (555) 876-5432',
    location: 'Dallas, USA',
    joinDate: '2020-09-22',
    lastActive: '2023-05-01T16:42:18',
    status: 'inactive',
    ordersCount: 34,
    totalSpent: 1678.10,
    primaryDevice: 'iOS',
    preferredPaymentMethod: 'PayPal',
    lastOrderDate: '2023-04-25'
  },
  {
    id: 'cust-006',
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, USA',
    joinDate: '2020-04-17',
    lastActive: '2023-05-15T11:23:41',
    status: 'active',
    ordersCount: 42,
    totalSpent: 2143.67,
    primaryDevice: 'iOS',
    preferredPaymentMethod: 'Apple Pay',
    lastOrderDate: '2023-05-12'
  },
  {
    id: 'cust-007',
    name: 'Robert Anderson',
    email: 'robert.a@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, USA',
    joinDate: '2022-03-30',
    lastActive: '2023-05-14T19:51:27',
    status: 'active',
    ordersCount: 9,
    totalSpent: 412.35,
    primaryDevice: 'Android',
    preferredPaymentMethod: 'Credit Card',
    lastOrderDate: '2023-05-13'
  },
  {
    id: 'cust-008',
    name: 'Emily Thomas',
    email: 'emily.t@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Boston, USA',
    joinDate: '2021-08-12',
    lastActive: '2023-05-15T13:35:09',
    status: 'active',
    ordersCount: 15,
    totalSpent: 678.90,
    primaryDevice: 'iOS',
    preferredPaymentMethod: 'Credit Card',
    lastOrderDate: '2023-05-11'
  },
  {
    id: 'cust-009',
    name: 'William Jackson',
    email: 'wjackson@example.com',
    phone: '+1 (555) 567-8901',
    location: 'Houston, USA',
    joinDate: '2023-05-01',
    lastActive: '2023-05-08T10:11:22',
    status: 'active',
    ordersCount: 2,
    totalSpent: 98.45,
    primaryDevice: 'Android',
    preferredPaymentMethod: 'Google Pay',
    lastOrderDate: '2023-05-08'
  },
  {
    id: 'cust-010',
    name: 'Ava White',
    email: 'ava.w@example.com',
    phone: '+1 (555) 567-8901',
    location: 'Atlanta, USA',
    joinDate: '2022-06-18',
    lastActive: '2023-04-25T17:28:44',
    status: 'inactive',
    ordersCount: 7,
    totalSpent: 345.60,
    primaryDevice: 'iOS',
    preferredPaymentMethod: 'Credit Card',
    lastOrderDate: '2023-04-20'
  }
];

const userActivity: UserActivity[] = [
  { date: 'Mon', active: 2120, new: 145 },
  { date: 'Tue', active: 2232, new: 132 },
  { date: 'Wed', active: 2345, new: 178 },
  { date: 'Thu', active: 2450, new: 164 },
  { date: 'Fri', active: 2765, new: 200 },
  { date: 'Sat', active: 2342, new: 108 },
  { date: 'Sun', active: 2130, new: 85 },
];

const userSegments: UserSegment[] = [
  { name: 'New Users', value: 25 },
  { name: 'Regular Users', value: 45 },
  { name: 'Power Users', value: 20 },
  { name: 'Inactive Users', value: 10 },
];

const deviceDistribution: DeviceDistribution[] = [
  { name: 'iOS', value: 58 },
  { name: 'Android', value: 38 },
  { name: 'Other', value: 4 },
];

const retentionData: RetentionData[] = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 89 },
  { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 87 },
  { month: 'May', rate: 90 },
  { month: 'Jun', rate: 85 },
];

const userSpending: UserSpending[] = [
  { month: 'Jan', amount: 34500 },
  { month: 'Feb', amount: 42300 },
  { month: 'Mar', amount: 45100 },
  { month: 'Apr', amount: 39800 },
  { month: 'May', amount: 47600 },
  { month: 'Jun', amount: 52000 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

const UsersPage: React.FC = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  
  const activeCustomers = customersData.filter(customer => customer.status === 'active').length;
  const inactiveCustomers = customersData.filter(customer => customer.status === 'inactive').length;
  const totalSpent = customersData.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageOrderValue = totalSpent / customersData.reduce((sum, customer) => sum + customer.ordersCount, 0);
  
  const selectedCustomer = selectedCustomerId 
    ? customersData.find(c => c.id === selectedCustomerId) 
    : null;

  const columns = [
    {
      header: "Customer",
      accessor: (row: Customer) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 bg-admin-primary">
            <div className="text-xs font-medium text-white">
              {row.name.split(' ').map(n => n[0]).join('')}
            </div>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: (row: Customer) => (
        <div>
          <p className="text-sm">{row.phone}</p>
          <p className="text-xs text-gray-500">{row.location}</p>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: Customer) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Orders",
      accessor: (row: Customer) => row.ordersCount.toString(),
    },
    {
      header: "Total Spent",
      accessor: (row: Customer) => `$${row.totalSpent.toFixed(2)}`,
    },
    {
      header: "Last Active",
      accessor: (row: Customer) => {
        const date = new Date(row.lastActive);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      },
    },
    {
      header: "Join Date",
      accessor: (row: Customer) => new Date(row.joinDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: (row: Customer) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedCustomerId(row.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>View Orders</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Lock className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <UserMinus className="mr-2 h-4 w-4" />
              Deactivate Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <PageHeader 
          title="Customer Management" 
          subtitle="View and manage all platform customers"
        >
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsNewCustomerDialogOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Customers"
            value={customersData.length.toString()}
            icon={<UsersIcon className="h-5 w-5" />}
            change={{ value: "+8.5%", trend: "up" }}
          />
          <StatsCard
            title="Active Customers"
            value={activeCustomers.toString()}
            icon={<Activity className="h-5 w-5" />}
            change={{ value: "+12.3%", trend: "up" }}
          />
          <StatsCard
            title="New Customers (This Month)"
            value="132"
            icon={<UserPlus className="h-5 w-5" />}
            change={{ value: "+14.7%", trend: "up" }}
          />
          <StatsCard
            title="Average Order Value"
            value={`$${averageOrderValue.toFixed(2)}`}
            icon={<ShoppingBag className="h-5 w-5" />}
            change={{ value: "+5.2%", trend: "up" }}
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customer List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Activity (Last 7 Days)</CardTitle>
                  <CardDescription>Daily active and new users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={userActivity}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="active" name="Active Users" fill="#8B5CF6" />
                        <Bar dataKey="new" name="New Users" fill="#F97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>Distribution by user type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userSegments}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8B5CF6"
                          dataKey="value"
                        >
                          {userSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Retention</CardTitle>
                  <CardDescription>Monthly retention rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={retentionData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>Platform usage breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8B5CF6"
                          dataKey="value"
                        >
                          {deviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="customers">
            <DataTable
              columns={columns}
              data={customersData}
              keyField="id"
              searchPlaceholder="Search customers by name or email..."
              onSearch={() => {}}
              searchFields={['name', 'email']}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard
                title="Lifetime Customer Value"
                value="$892.45"
                icon={<UsersIcon className="h-5 w-5" />}
                change={{ value: "+7.2%", trend: "up" }}
              />
              <StatsCard
                title="Average Sessions per Customer"
                value="12.3"
                icon={<Activity className="h-5 w-5" />}
                change={{ value: "+4.1%", trend: "up" }}
              />
              <StatsCard
                title="Average Conversion Rate"
                value="3.8%"
                icon={<ShoppingBag className="h-5 w-5" />}
                change={{ value: "+0.5%", trend: "up" }}
              />
              <StatsCard
                title="Average Response Time"
                value="1.2 hrs"
                icon={<Clock className="h-5 w-5" />}
                change={{ value: "-8.3%", trend: "up" }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Spending Trends</CardTitle>
                  <CardDescription>Monthly spending patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={userSpending}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Total Spent']} />
                        <Area type="monotone" dataKey="amount" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Top locations by customer count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>New York, USA</span>
                      <span className="font-semibold">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Los Angeles, USA</span>
                      <span className="font-semibold">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Chicago, USA</span>
                      <span className="font-semibold">14%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Miami, USA</span>
                      <span className="font-semibold">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>San Francisco, USA</span>
                      <span className="font-semibold">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Engagement</CardTitle>
                  <CardDescription>Session duration and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Session Duration</span>
                        <span className="font-medium">12m 42s</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pages per Session</span>
                        <span className="font-medium">4.8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bounce Rate</span>
                        <span className="font-medium">28.3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Return Visitor Rate</span>
                        <span className="font-medium">42.7%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '43%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Conversion Rate</span>
                        <span className="font-medium">3.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '38%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomerId} onOpenChange={() => setSelectedCustomerId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Detailed information about this customer
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b">
                <Avatar className="h-16 w-16 bg-admin-primary">
                  <div className="text-xl font-medium text-white">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                  <div className="flex items-center mt-1">
                    <StatusBadge status={selectedCustomer.status} className="mr-2" />
                    <span className="text-sm text-gray-600">{selectedCustomer.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer ID</p>
                  <p className="text-sm">{selectedCustomer.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Join Date</p>
                  <p className="text-sm">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Active</p>
                  <p className="text-sm">
                    {new Date(selectedCustomer.lastActive).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Primary Device</p>
                  <p className="text-sm">{selectedCustomer.primaryDevice}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Preferred Payment</p>
                  <p className="text-sm">{selectedCustomer.preferredPaymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-sm">{selectedCustomer.ordersCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-sm">${selectedCustomer.totalSpent.toFixed(2)}</p>
                </div>
                {selectedCustomer.lastOrderDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Order Date</p>
                    <p className="text-sm">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  View Orders
                </Button>
                {selectedCustomer.status === 'active' && (
                  <Button variant="destructive" size="sm" className="flex items-center gap-2">
                    <UserMinus className="h-4 w-4" />
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Customer Dialog */}
      <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="Enter email address" type="email" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" />
              </div>
              <div>
                <Label htmlFor="device">Primary Device</Label>
                <select 
                  id="device" 
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select device</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="payment">Preferred Payment</Label>
                <select 
                  id="payment" 
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select payment method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Google Pay">Google Pay</option>
                </select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsNewCustomerDialogOpen(false)}>
              Create Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;
