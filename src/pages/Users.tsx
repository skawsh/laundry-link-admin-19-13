
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
  UserMinus
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
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  joinDate: string;
  avatar?: string;
  location: string;
  phone?: string;
}

interface UserActivity {
  date: string;
  active: number;
  new: number;
}

interface RoleDistribution {
  name: string;
  value: number;
}

const usersData: User[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2023-05-15T09:32:45',
    joinDate: '2020-06-01',
    location: 'New York, USA',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'user-002',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    role: 'Studio Manager',
    status: 'active',
    lastActive: '2023-05-15T10:45:12',
    joinDate: '2021-02-15',
    location: 'Los Angeles, USA',
    phone: '+1 (555) 987-6543'
  },
  {
    id: 'user-003',
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    role: 'Driver',
    status: 'inactive',
    lastActive: '2023-05-10T14:22:33',
    joinDate: '2022-01-10',
    location: 'Chicago, USA'
  },
  {
    id: 'user-004',
    name: 'Sophia Garcia',
    email: 'sophia.g@example.com',
    role: 'Customer Support',
    status: 'active',
    lastActive: '2023-05-15T08:17:55',
    joinDate: '2021-11-05',
    location: 'Miami, USA',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'user-005',
    name: 'James Wilson',
    email: 'jwilson@example.com',
    role: 'Studio Manager',
    status: 'suspended',
    lastActive: '2023-05-01T16:42:18',
    joinDate: '2020-09-22',
    location: 'Dallas, USA',
    phone: '+1 (555) 876-5432'
  },
  {
    id: 'user-006',
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2023-05-15T11:23:41',
    joinDate: '2020-04-17',
    location: 'San Francisco, USA',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'user-007',
    name: 'Robert Anderson',
    email: 'robert.a@example.com',
    role: 'Driver',
    status: 'active',
    lastActive: '2023-05-14T19:51:27',
    joinDate: '2022-03-30',
    location: 'Seattle, USA'
  },
  {
    id: 'user-008',
    name: 'Emily Thomas',
    email: 'emily.t@example.com',
    role: 'Customer Support',
    status: 'active',
    lastActive: '2023-05-15T13:35:09',
    joinDate: '2021-08-12',
    location: 'Boston, USA',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 'user-009',
    name: 'William Jackson',
    email: 'wjackson@example.com',
    role: 'Studio Manager',
    status: 'pending',
    lastActive: '2023-05-08T10:11:22',
    joinDate: '2023-05-01',
    location: 'Houston, USA'
  },
  {
    id: 'user-010',
    name: 'Ava White',
    email: 'ava.w@example.com',
    role: 'Driver',
    status: 'inactive',
    lastActive: '2023-04-25T17:28:44',
    joinDate: '2022-06-18',
    location: 'Atlanta, USA',
    phone: '+1 (555) 567-8901'
  }
];

const userActivity: UserActivity[] = [
  { date: 'Mon', active: 120, new: 15 },
  { date: 'Tue', active: 132, new: 12 },
  { date: 'Wed', active: 145, new: 18 },
  { date: 'Thu', active: 150, new: 14 },
  { date: 'Fri', active: 165, new: 20 },
  { date: 'Sat', active: 142, new: 8 },
  { date: 'Sun', active: 130, new: 5 },
];

const roleDistribution: RoleDistribution[] = [
  { name: 'Admin', value: 15 },
  { name: 'Studio Manager', value: 35 },
  { name: 'Driver', value: 40 },
  { name: 'Customer Support', value: 10 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

const UsersPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  
  const activeUsers = usersData.filter(user => user.status === 'active').length;
  const inactiveUsers = usersData.filter(user => user.status === 'inactive').length;
  const pendingUsers = usersData.filter(user => user.status === 'pending').length;
  const suspendedUsers = usersData.filter(user => user.status === 'suspended').length;
  
  const selectedUser = selectedUserId 
    ? usersData.find(u => u.id === selectedUserId) 
    : null;

  const columns = [
    {
      header: "User",
      accessor: (row: User) => (
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
      header: "Role",
      accessor: (row: User) => row.role,
    },
    {
      header: "Status",
      accessor: (row: User) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Last Active",
      accessor: (row: User) => {
        const date = new Date(row.lastActive);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      },
    },
    {
      header: "Join Date",
      accessor: (row: User) => new Date(row.joinDate).toLocaleDateString(),
    },
    {
      header: "Location",
      accessor: (row: User) => row.location,
    },
    {
      header: "Actions",
      accessor: (row: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedUserId(row.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit User</DropdownMenuItem>
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
              Deactivate User
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
          title="User Management" 
          subtitle="View and manage all platform users"
        >
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsNewUserDialogOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={usersData.length.toString()}
            icon={<UsersIcon className="h-5 w-5" />}
            change={{ value: "+8.5%", trend: "up" }}
          />
          <StatsCard
            title="Active Users"
            value={activeUsers.toString()}
            icon={<Activity className="h-5 w-5" />}
            change={{ value: "+12.3%", trend: "up" }}
          />
          <StatsCard
            title="New Users (This Month)"
            value="32"
            icon={<UserPlus className="h-5 w-5" />}
            change={{ value: "+4.7%", trend: "up" }}
          />
          <StatsCard
            title="Avg. Sessions per User"
            value="8.2"
            icon={<Calendar className="h-5 w-5" />}
            change={{ value: "+2.1%", trend: "up" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-subtle lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">User Activity (Last 7 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userActivity}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" name="Active Users" fill="#8B5CF6" />
                  <Bar dataKey="new" name="New Users" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-subtle">
            <h2 className="text-lg font-semibold mb-4">User Role Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8B5CF6"
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-subtle">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-4">
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
                <TabsTrigger value="studio">Studio Managers</TabsTrigger>
                <TabsTrigger value="driver">Drivers</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="pt-2">
              <DataTable
                columns={columns}
                data={usersData}
                keyField="id"
                searchPlaceholder="Search users by name or email..."
                onSearch={() => {}}
                searchFields={['name', 'email']}
              />
            </TabsContent>
            
            <TabsContent value="admin" className="pt-2">
              <DataTable
                columns={columns}
                data={usersData.filter(u => u.role === 'Admin')}
                keyField="id"
                searchPlaceholder="Search admins..."
                onSearch={() => {}}
                searchFields={['name', 'email']}
              />
            </TabsContent>
            
            <TabsContent value="studio" className="pt-2">
              <DataTable
                columns={columns}
                data={usersData.filter(u => u.role === 'Studio Manager')}
                keyField="id"
                searchPlaceholder="Search studio managers..."
                onSearch={() => {}}
                searchFields={['name', 'email']}
              />
            </TabsContent>
            
            <TabsContent value="driver" className="pt-2">
              <DataTable
                columns={columns}
                data={usersData.filter(u => u.role === 'Driver')}
                keyField="id"
                searchPlaceholder="Search drivers..."
                onSearch={() => {}}
                searchFields={['name', 'email']}
              />
            </TabsContent>
            
            <TabsContent value="support" className="pt-2">
              <DataTable
                columns={columns}
                data={usersData.filter(u => u.role === 'Customer Support')}
                keyField="id"
                searchPlaceholder="Search support staff..."
                onSearch={() => {}}
                searchFields={['name', 'email']}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUserId} onOpenChange={() => setSelectedUserId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b">
                <Avatar className="h-16 w-16 bg-admin-primary">
                  <div className="text-xl font-medium text-white">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center mt-1">
                    <StatusBadge status={selectedUser.status} className="mr-2" />
                    <span className="text-sm text-gray-600">{selectedUser.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-sm">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm">{selectedUser.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Join Date</p>
                  <p className="text-sm">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Active</p>
                  <p className="text-sm">
                    {new Date(selectedUser.lastActive).toLocaleString()}
                  </p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm">{selectedUser.phone}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Reset Password
                </Button>
                {selectedUser.status === 'active' && (
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

      {/* New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
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
              <div>
                <Label htmlFor="role">Role</Label>
                <select 
                  id="role" 
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Studio Manager">Studio Manager</option>
                  <option value="Driver">Driver</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsNewUserDialogOpen(false)}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;
