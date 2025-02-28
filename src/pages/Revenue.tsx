
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import StatsCard from '@/components/ui/StatsCard';
import DataTable from '@/components/ui/DataTable';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Activity,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StatusBadge from '@/components/ui/StatusBadge';

interface RevenueTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  source: string;
  status: string;
  description: string;
}

interface RevenueByPeriod {
  name: string;
  value: number;
}

interface RevenueBySource {
  name: string;
  value: number;
}

const revenueData: RevenueTransaction[] = [
  { 
    id: 'rev-001', 
    date: '2023-05-15', 
    type: 'Order Commission', 
    amount: 158.42, 
    source: 'Studio: Pasta Palace', 
    status: 'completed',
    description: 'Commission from 5 orders'
  },
  { 
    id: 'rev-002', 
    date: '2023-05-14', 
    type: 'Subscription Fee', 
    amount: 299.99, 
    source: 'Studio: Burger Junction', 
    status: 'completed',
    description: 'Monthly premium subscription'
  },
  { 
    id: 'rev-003', 
    date: '2023-05-13', 
    type: 'Driver Fee', 
    amount: 75.50, 
    source: 'Driver: John Smith', 
    status: 'completed',
    description: 'Platform usage fee'
  },
  { 
    id: 'rev-004', 
    date: '2023-05-12', 
    type: 'Promotional Fee', 
    amount: 149.99, 
    source: 'Studio: Sushi Express', 
    status: 'pending',
    description: 'Featured placement fee'
  },
  { 
    id: 'rev-005', 
    date: '2023-05-10', 
    type: 'Order Commission', 
    amount: 243.78, 
    source: 'Studio: Pizza Planet', 
    status: 'completed',
    description: 'Commission from 8 orders'
  },
  { 
    id: 'rev-006', 
    date: '2023-05-09', 
    type: 'Subscription Fee', 
    amount: 199.99, 
    source: 'Studio: Thai Delight', 
    status: 'completed',
    description: 'Monthly basic subscription'
  },
  { 
    id: 'rev-007', 
    date: '2023-05-08', 
    type: 'Driver Fee', 
    amount: 82.25, 
    source: 'Driver: Emma Johnson', 
    status: 'cancelled',
    description: 'Platform usage fee - cancelled'
  },
  { 
    id: 'rev-008', 
    date: '2023-05-07', 
    type: 'Order Commission', 
    amount: 186.33, 
    source: 'Studio: Indian Spice', 
    status: 'completed',
    description: 'Commission from 6 orders'
  },
  { 
    id: 'rev-009', 
    date: '2023-05-06', 
    type: 'Promotional Fee', 
    amount: 99.99, 
    source: 'Studio: Mexican Grill', 
    status: 'completed',
    description: 'Homepage banner fee'
  },
  { 
    id: 'rev-010', 
    date: '2023-05-05', 
    type: 'Subscription Fee', 
    amount: 299.99, 
    source: 'Studio: Vegan Heaven', 
    status: 'pending',
    description: 'Monthly premium subscription'
  },
];

const monthlyRevenue: RevenueByPeriod[] = [
  { name: 'Jan', value: 15420 },
  { name: 'Feb', value: 17250 },
  { name: 'Mar', value: 19800 },
  { name: 'Apr', value: 22340 },
  { name: 'May', value: 24550 },
  { name: 'Jun', value: 26780 },
  { name: 'Jul', value: 28950 },
  { name: 'Aug', value: 30125 },
  { name: 'Sep', value: 29780 },
  { name: 'Oct', value: 33450 },
  { name: 'Nov', value: 35200 },
  { name: 'Dec', value: 38750 },
];

const revenueBySource: RevenueBySource[] = [
  { name: 'Order Commissions', value: 42 },
  { name: 'Subscription Fees', value: 28 },
  { name: 'Driver Fees', value: 15 },
  { name: 'Promotional Fees', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#64748B'];

const Revenue: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  
  const totalRevenue = revenueData.reduce((sum, transaction) => 
    transaction.status === 'completed' ? sum + transaction.amount : sum, 0);
  
  const pendingRevenue = revenueData.reduce((sum, transaction) => 
    transaction.status === 'pending' ? sum + transaction.amount : sum, 0);
    
  const avgOrderCommission = revenueData
    .filter(t => t.type === 'Order Commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) / 
    revenueData.filter(t => t.type === 'Order Commission' && t.status === 'completed').length;

  const selectedTransaction = selectedTransactionId 
    ? revenueData.find(t => t.id === selectedTransactionId) 
    : null;

  const columns = [
    {
      header: "ID",
      accessor: (row: RevenueTransaction) => row.id,
      width: "100px",
    },
    {
      header: "Date",
      accessor: (row: RevenueTransaction) => new Date(row.date).toLocaleDateString(),
      width: "100px",
    },
    {
      header: "Type",
      accessor: (row: RevenueTransaction) => row.type,
    },
    {
      header: "Amount",
      accessor: (row: RevenueTransaction) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: "Source",
      accessor: (row: RevenueTransaction) => row.source,
    },
    {
      header: "Status",
      accessor: (row: RevenueTransaction) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: "Actions",
      accessor: (row: RevenueTransaction) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedTransactionId(row.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <PageHeader 
          title="Revenue Management" 
          subtitle="Track and analyze all revenue streams"
        >
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue (This Month)"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="h-5 w-5" />}
            change={{ value: "+12.5%", trend: "up" }}
          />
          <StatsCard
            title="Year-to-Date Revenue"
            value="$293,425.50"
            icon={<TrendingUp className="h-5 w-5" />}
            change={{ value: "+8.2%", trend: "up" }}
          />
          <StatsCard
            title="Pending Revenue"
            value={`$${pendingRevenue.toFixed(2)}`}
            icon={<ShoppingBag className="h-5 w-5" />}
          />
          <StatsCard
            title="Avg. Order Commission"
            value={`$${avgOrderCommission.toFixed(2)}`}
            icon={<Activity className="h-5 w-5" />}
            change={{ value: "+3.7%", trend: "up" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-subtle lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Revenue Trends</h2>
              <div className="flex space-x-2">
                <Button 
                  variant={selectedPeriod === 'weekly' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedPeriod('weekly')}
                >
                  Weekly
                </Button>
                <Button 
                  variant={selectedPeriod === 'monthly' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedPeriod('monthly')}
                >
                  Monthly
                </Button>
                <Button 
                  variant={selectedPeriod === 'yearly' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedPeriod('yearly')}
                >
                  Yearly
                </Button>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenue}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']} 
                    labelFormatter={(label) => `${label} 2023`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8B5CF6" 
                    activeDot={{ r: 8 }} 
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-subtle">
            <h2 className="text-lg font-semibold mb-4">Revenue by Source</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8B5CF6"
                    dataKey="value"
                  >
                    {revenueBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-subtle">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-4">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="commission">Order Commissions</TabsTrigger>
                <TabsTrigger value="subscription">Subscription Fees</TabsTrigger>
                <TabsTrigger value="other">Other Revenue</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="pt-2">
              <DataTable
                columns={columns}
                data={revenueData}
                keyField="id"
                searchPlaceholder="Search transactions..."
                onSearch={() => {}}
                searchFields={['id', 'type', 'source']}
              />
            </TabsContent>
            
            <TabsContent value="commission" className="pt-2">
              <DataTable
                columns={columns}
                data={revenueData.filter(t => t.type === 'Order Commission')}
                keyField="id"
                searchPlaceholder="Search commission transactions..."
                onSearch={() => {}}
                searchFields={['id', 'source']}
              />
            </TabsContent>
            
            <TabsContent value="subscription" className="pt-2">
              <DataTable
                columns={columns}
                data={revenueData.filter(t => t.type === 'Subscription Fee')}
                keyField="id"
                searchPlaceholder="Search subscription transactions..."
                onSearch={() => {}}
                searchFields={['id', 'source']}
              />
            </TabsContent>
            
            <TabsContent value="other" className="pt-2">
              <DataTable
                columns={columns}
                data={revenueData.filter(t => 
                  t.type !== 'Order Commission' && t.type !== 'Subscription Fee'
                )}
                keyField="id"
                searchPlaceholder="Search other transactions..."
                onSearch={() => {}}
                searchFields={['id', 'type', 'source']}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!selectedTransactionId} onOpenChange={() => setSelectedTransactionId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about this revenue transaction
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                  <p className="text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm">{selectedTransaction.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-sm font-semibold">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Source</p>
                  <p className="text-sm">{selectedTransaction.source}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <StatusBadge status={selectedTransaction.status} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-sm">{selectedTransaction.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Revenue;
