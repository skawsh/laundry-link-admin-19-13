
import React from 'react';
import { ArrowLeft, Users, Building, TrendingUp, DollarSign, Clock, Award, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Sample data for Overall Studio Analytics
const studioGrowthData = [
  { month: 'Jan', studios: 3 },
  { month: 'Feb', studios: 4 },
  { month: 'Mar', studios: 4 },
  { month: 'Apr', studios: 6 },
  { month: 'May', studios: 8 },
  { month: 'Jun', studios: 9 },
  { month: 'Jul', studios: 12 },
  { month: 'Aug', studios: 15 },
];

const studioPerformanceData = [
  { name: 'Saiteja Laundry', orders: 325, revenue: 125800 },
  { name: 'Sparkle Clean', orders: 287, revenue: 109500 },
  { name: 'Royal Wash', orders: 298, revenue: 118200 },
  { name: 'Quick & Clean', orders: 210, revenue: 89300 },
  { name: 'Wash Masters', orders: 265, revenue: 103200 },
];

const studioLocationData = [
  { name: 'Mumbai', value: 3 },
  { name: 'Delhi', value: 2 },
  { name: 'Bangalore', value: 1 },
  { name: 'Hyderabad', value: 1 },
  { name: 'Chennai', value: 1 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StudioOverallAnalytics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <PageHeader 
        title="Overall Studios Analytics" 
        subtitle="Comprehensive analytics for all laundry studios on your platform"
        backButton={
          <Button 
            variant="back" 
            size="icon" 
            onClick={() => navigate('/studios')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Total Studios"
          value="15"
          icon={<Building className="h-5 w-5" />}
          change={{ value: "+3", trend: "up" }}
          subtext="Last 30 days"
        />
        <StatsCard
          title="Active Studios"
          value="12"
          icon={<Users className="h-5 w-5" />}
          change={{ value: "+2", trend: "up" }}
          subtext="80% of total"
        />
        <StatsCard
          title="Average Orders/Studio"
          value="257"
          icon={<ShoppingBag className="h-5 w-5" />}
          change={{ value: "+12%", trend: "up" }}
          subtext="Last 30 days"
        />
        <StatsCard
          title="Average Revenue/Studio"
          value="₹96,800"
          icon={<DollarSign className="h-5 w-5" />}
          change={{ value: "+8%", trend: "up" }}
          subtext="Last 30 days"
        />
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="growth" className="mb-6">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl">
          <TabsTrigger value="growth">Studio Growth</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="location">Location Breakdown</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Studio Growth Over Time</CardTitle>
              <CardDescription>Number of new studios onboarded monthly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={studioGrowthData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="studios" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Studios</CardTitle>
              <CardDescription>Based on order volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={studioPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Studios by Location</CardTitle>
              <CardDescription>Distribution of studios across cities</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-80 w-full max-w-md">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studioLocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {studioLocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} studios`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Studio Ratings Over Time</CardTitle>
              <CardDescription>Average customer ratings by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', rating: 4.1 },
                      { month: 'Feb', rating: 4.2 },
                      { month: 'Mar', rating: 4.3 },
                      { month: 'Apr', rating: 4.2 },
                      { month: 'May', rating: 4.4 },
                      { month: 'Jun', rating: 4.5 },
                      { month: 'Jul', rating: 4.7 },
                      { month: 'Aug', rating: 4.6 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 5]} />
                    <Tooltip formatter={(value) => [`${value} stars`, 'Rating']} />
                    <Legend />
                    <Line type="monotone" dataKey="rating" stroke="#ff7300" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default StudioOverallAnalytics;
