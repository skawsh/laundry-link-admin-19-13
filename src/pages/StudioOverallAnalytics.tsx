
import React, { useState } from 'react';
import { ArrowLeft, Users, Building, TrendingUp, DollarSign, Clock, Award, ShoppingBag, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis } from 'recharts';

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

// Updated with Hyderabad-specific locations
const studioLocationData = [
  { name: 'Hitech City', value: 5 },
  { name: 'Gachibowli', value: 4 },
  { name: 'Madhapur', value: 3 },
  { name: 'Kondapur', value: 2 },
  { name: 'Kukatpally', value: 1 },
  { name: 'Ameerpet', value: 2 },
  { name: 'Banjara Hills', value: 3 },
];

// New data for advanced analytics
const customerRetentionData = [
  { month: 'Jan', rate: 76 },
  { month: 'Feb', rate: 78 },
  { month: 'Mar', rate: 77 },
  { month: 'Apr', rate: 80 },
  { month: 'May', rate: 83 },
  { month: 'Jun', rate: 85 },
  { month: 'Jul', rate: 87 },
  { month: 'Aug', rate: 89 },
];

const peakTimesData = [
  { hour: '6-8 AM', orders: 35 },
  { hour: '8-10 AM', orders: 78 },
  { hour: '10-12 PM', orders: 120 },
  { hour: '12-2 PM', orders: 95 },
  { hour: '2-4 PM', orders: 65 },
  { hour: '4-6 PM', orders: 90 },
  { hour: '6-8 PM', orders: 110 },
  { hour: '8-10 PM', orders: 70 },
];

const servicePopularityMatrix = [
  { service: 'Standard Wash', revenue: 98500, volume: 650, satisfaction: 87 },
  { service: 'Express Wash', revenue: 110300, volume: 580, satisfaction: 92 },
  { service: 'Dry Clean', revenue: 156000, volume: 520, satisfaction: 89 },
  { service: 'Ironing', revenue: 78000, volume: 480, satisfaction: 84 },
  { service: 'Premium Wash', revenue: 122000, volume: 320, satisfaction: 95 },
];

const hydAreaComparisonData = [
  { area: 'Hitech City', revenue: 320000, orders: 1250, avgOrderValue: 256 },
  { area: 'Gachibowli', revenue: 280000, orders: 1100, avgOrderValue: 254 },
  { area: 'Madhapur', revenue: 295000, orders: 1180, avgOrderValue: 250 },
  { area: 'Kondapur', revenue: 240000, orders: 980, avgOrderValue: 245 },
  { area: 'Kukatpally', revenue: 190000, orders: 820, avgOrderValue: 232 },
  { area: 'Banjara Hills', revenue: 310000, orders: 1150, avgOrderValue: 269 },
  { area: 'Ameerpet', revenue: 215000, orders: 950, avgOrderValue: 226 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const StudioOverallAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('last30days');
  const [selectedLocation, setSelectedLocation] = useState('all');

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
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="hitechcity">Hitech City</SelectItem>
              <SelectItem value="gachibowli">Gachibowli</SelectItem>
              <SelectItem value="madhapur">Madhapur</SelectItem>
              <SelectItem value="kondapur">Kondapur</SelectItem>
              <SelectItem value="kukatpally">Kukatpally</SelectItem>
              <SelectItem value="banjarahills">Banjara Hills</SelectItem>
              <SelectItem value="ameerpet">Ameerpet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

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
        <TabsList className="grid w-full grid-cols-6 max-w-4xl">
          <TabsTrigger value="growth">Studio Growth</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="location">Location Analysis</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="retention">Customer Retention</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Metrics</TabsTrigger>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Studios by Location in Hyderabad</CardTitle>
                <CardDescription>Distribution of studios across areas in Hyderabad</CardDescription>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Area Performance Comparison</CardTitle>
                <CardDescription>Revenue and order metrics by area in Hyderabad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={hydAreaComparisonData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      barSize={20}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" scale="point" padding={{ left: 10, right: 10 }} />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'revenue' ? `₹${value.toLocaleString()}` : 
                        name === 'avgOrderValue' ? `₹${value}` : value,
                        name === 'revenue' ? 'Revenue' : 
                        name === 'orders' ? 'Orders' :
                        'Avg Order Value'
                      ]} />
                      <Legend />
                      <Bar dataKey="orders" fill="#8884d8" name="Order Count" />
                      <Bar dataKey="avgOrderValue" fill="#82ca9d" name="Avg Order Value (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
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
        
        <TabsContent value="retention" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Retention Metrics</CardTitle>
              <CardDescription>Analysis of customer retention rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={customerRetentionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#0088FE" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }}
                      name="Retention Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Average Retention</h4>
                  <p className="text-2xl font-bold text-blue-900">82.5%</p>
                  <p className="text-xs text-blue-700 mt-1">Last 8 months</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Monthly Growth</h4>
                  <p className="text-2xl font-bold text-green-900">+1.6%</p>
                  <p className="text-xs text-green-700 mt-1">Retention improvement</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800 mb-1">Loyalty Rate</h4>
                  <p className="text-2xl font-bold text-purple-900">68%</p>
                  <p className="text-xs text-purple-700 mt-1">3+ orders per customer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Peak Order Times Analysis</CardTitle>
                <CardDescription>Hourly distribution of order volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={peakTimesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} orders`, 'Volume']} />
                      <Legend />
                      <Bar dataKey="orders" fill="#8884d8" name="Order Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Performance Matrix</CardTitle>
                <CardDescription>Revenue vs. Volume vs. Customer Satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="volume" name="Order Volume" unit=" orders" />
                      <YAxis dataKey="revenue" name="Revenue" unit=" ₹" />
                      <ZAxis dataKey="satisfaction" name="Satisfaction" unit="%" range={[60, 120]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [
                          name === 'Revenue' ? `₹${value.toLocaleString()}` : 
                          name === 'Order Volume' ? `${value} orders` :
                          `${value}%`,
                          name
                        ]}
                        wrapperStyle={{ zIndex: 1000 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded shadow-md">
                                <p className="font-medium text-gray-800">{data.service}</p>
                                <p className="text-sm text-gray-600">Revenue: ₹{data.revenue.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Orders: {data.volume}</p>
                                <p className="text-sm text-gray-600">Satisfaction: {data.satisfaction}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Scatter 
                        name="Services" 
                        data={servicePopularityMatrix} 
                        fill="#8884d8" 
                        shape="circle"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default StudioOverallAnalytics;
