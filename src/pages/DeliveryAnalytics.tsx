
import React, { useState } from 'react';
import { ArrowLeft, Truck, Clock, Calendar, MapPin, TrendingUp, Package, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for delivery analytics
const deliveryTimeData = [
  { month: 'Jan', avgTime: 45, targetTime: 40 },
  { month: 'Feb', avgTime: 43, targetTime: 40 },
  { month: 'Mar', avgTime: 41, targetTime: 40 },
  { month: 'Apr', avgTime: 39, targetTime: 35 },
  { month: 'May', avgTime: 36, targetTime: 35 },
  { month: 'Jun', avgTime: 34, targetTime: 35 },
  { month: 'Jul', avgTime: 33, targetTime: 30 },
  { month: 'Aug', avgTime: 32, targetTime: 30 },
  { month: 'Sep', avgTime: 31, targetTime: 30 },
  { month: 'Oct', avgTime: 30, targetTime: 30 },
  { month: 'Nov', avgTime: 29, targetTime: 30 },
  { month: 'Dec', avgTime: 28, targetTime: 30 }
];

const deliverySuccessRateData = [
  { month: 'Jan', successRate: 92 },
  { month: 'Feb', successRate: 93 },
  { month: 'Mar', successRate: 94 },
  { month: 'Apr', successRate: 94 },
  { month: 'May', successRate: 95 },
  { month: 'Jun', successRate: 96 },
  { month: 'Jul', successRate: 97 },
  { month: 'Aug', successRate: 97 },
  { month: 'Sep', successRate: 98 },
  { month: 'Oct', successRate: 98 },
  { month: 'Nov', successRate: 98 },
  { month: 'Dec', successRate: 99 }
];

const deliveryLocationData = [
  { name: 'Hitech City', value: 35 },
  { name: 'Gachibowli', value: 25 },
  { name: 'Madhapur', value: 20 },
  { name: 'Banjara Hills', value: 12 },
  { name: 'Kondapur', value: 8 }
];

const deliveryIssuesData = [
  { name: 'Customer Unavailable', value: 40 },
  { name: 'Wrong Address', value: 25 },
  { name: 'Traffic Delays', value: 20 },
  { name: 'Weather Conditions', value: 10 },
  { name: 'Vehicle Issues', value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DeliveryAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('last30days');
  const [selectedLocation, setSelectedLocation] = useState('all');

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Delivery Analytics</h1>
              <p className="text-muted-foreground">
                Insights into delivery performance, times, and efficiency
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="lastyear">Last year</SelectItem>
                <SelectItem value="alltime">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[180px]">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="hitech-city">Hitech City</SelectItem>
                <SelectItem value="gachibowli">Gachibowli</SelectItem>
                <SelectItem value="madhapur">Madhapur</SelectItem>
                <SelectItem value="banjara-hills">Banjara Hills</SelectItem>
                <SelectItem value="kondapur">Kondapur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Delivery Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28 min</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> -3.4%
                </span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Delivery Success Rate
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +1%
                </span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Deliveries
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,245</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +8.2%
                </span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Distance
              </CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2 km</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-amber-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +0.3%
                </span> from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Analytics */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="performance">Delivery Performance</TabsTrigger>
            <TabsTrigger value="locations">Delivery Locations</TabsTrigger>
            <TabsTrigger value="issues">Delivery Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Delivery Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliveryTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Time (minutes)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgTime" stroke="#8884d8" name="Avg. Delivery Time (min)" />
                      <Line type="monotone" dataKey="targetTime" stroke="#82ca9d" name="Target Time (min)" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Delivery Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliverySuccessRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[90, 100]} label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="successRate" stroke="#8884d8" name="Success Rate (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Delivery Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliveryLocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deliveryLocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="issues" className="space-y-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Delivery Issues Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliveryIssuesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deliveryIssuesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default DeliveryAnalytics;
