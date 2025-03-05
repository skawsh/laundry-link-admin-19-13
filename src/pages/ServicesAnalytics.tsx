
import React, { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, BarChart2, ShoppingBag, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Sample data for Services Analytics
const topServicesByRevenue = [
  { name: 'Dry Clean', revenue: 287000, orders: 1150 },
  { name: 'Express Wash', revenue: 215000, orders: 860 },
  { name: 'Standard Wash', revenue: 182500, orders: 1230 },
  { name: 'Premium Wash', revenue: 142000, orders: 520 },
  { name: 'Ironing Only', revenue: 98000, orders: 720 },
];

const topServicesByOrders = [
  { name: 'Standard Wash', orders: 1230, revenue: 182500 },
  { name: 'Dry Clean', orders: 1150, revenue: 287000 },
  { name: 'Express Wash', orders: 860, revenue: 215000 },
  { name: 'Ironing Only', orders: 720, revenue: 98000 },
  { name: 'Premium Wash', orders: 520, revenue: 142000 },
];

const serviceGrowthByMonth = [
  { month: 'Mar', "Standard Wash": 280, "Express Wash": 190, "Dry Clean": 240 },
  { month: 'Apr', "Standard Wash": 300, "Express Wash": 210, "Dry Clean": 290 },
  { month: 'May', "Standard Wash": 310, "Express Wash": 220, "Dry Clean": 300 },
  { month: 'Jun', "Standard Wash": 340, "Express Wash": 230, "Dry Clean": 320 },
  { month: 'Jul', "Standard Wash": 380, "Express Wash": 250, "Dry Clean": 340 },
  { month: 'Aug', "Standard Wash": 420, "Express Wash": 270, "Dry Clean": 360 },
];

const serviceItemPopularity = [
  { name: 'T-Shirts', value: 850 },
  { name: 'Pants/Trousers', value: 720 },
  { name: 'Shirts', value: 640 },
  { name: 'Dresses', value: 580 },
  { name: 'Bed Sheets', value: 450 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ServicesAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('last30days');

  return (
    <AdminLayout>
      <PageHeader 
        title="Services Analytics" 
        subtitle="Analyze services performance and popularity across your platform"
        backButton={
          <Button 
            variant="back" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      >
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Total Services"
          value="32"
          icon={<ShoppingBag className="h-5 w-5" />}
          change={{ value: "+5", trend: "up" }}
          subtext="Across all studios"
        />
        <StatsCard
          title="Most Popular Service"
          value="Dry Clean"
          icon={<TrendingUp className="h-5 w-5" />}
          subtext="By revenue"
        />
        <StatsCard
          title="Fastest Growing"
          value="Express Wash"
          icon={<ArrowUpRight className="h-5 w-5" />}
          change={{ value: "+24%", trend: "up" }}
          subtext="Last 30 days"
        />
        <StatsCard
          title="Avg. Service Time"
          value="2h 15m"
          icon={<Clock className="h-5 w-5" />}
          change={{ value: "-10m", trend: "up" }}
          subtext="From last period"
        />
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="revenue" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="popularity">Popularity</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Services by Revenue</CardTitle>
              <CardDescription>Top performing services by total revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topServicesByRevenue}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popularity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Services by Order Volume</CardTitle>
              <CardDescription>Most popular services based on number of orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topServicesByOrders}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Orders']} />
                    <Legend />
                    <Bar dataKey="orders" fill="#82ca9d" name="Number of Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Most Popular Clothing Items</CardTitle>
              <CardDescription>Most frequently ordered clothing items across all services</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-80 w-full max-w-md">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceItemPopularity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceItemPopularity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Growth Trends</CardTitle>
              <CardDescription>Monthly order volume by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={serviceGrowthByMonth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Standard Wash" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Express Wash" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Dry Clean" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue Per Service</CardTitle>
              <CardDescription>Average revenue generated per service order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Dry Clean', value: 250 },
                      { name: 'Premium Wash', value: 273 },
                      { name: 'Express Wash', value: 250 },
                      { name: 'Standard Wash', value: 148 },
                      { name: 'Ironing Only', value: 136 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Avg. Revenue per Order']} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Revenue per Order (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ServicesAnalytics;
