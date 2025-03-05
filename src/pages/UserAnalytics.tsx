
import React, { useState } from 'react';
import { ArrowLeft, Users, TrendingUp, LineChart, Clock, Activity, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for user analytics
const userGrowthData = [
  { month: 'Jan', users: 1500, newUsers: 220 },
  { month: 'Feb', users: 1720, newUsers: 240 },
  { month: 'Mar', users: 1960, newUsers: 280 },
  { month: 'Apr', users: 2240, newUsers: 310 },
  { month: 'May', users: 2550, newUsers: 350 },
  { month: 'Jun', users: 2900, newUsers: 390 },
  { month: 'Jul', users: 3290, newUsers: 420 },
  { month: 'Aug', users: 3710, newUsers: 450 },
  { month: 'Sep', users: 4160, newUsers: 470 },
  { month: 'Oct', users: 4630, newUsers: 490 },
  { month: 'Nov', users: 5120, newUsers: 510 },
  { month: 'Dec', users: 5630, newUsers: 530 }
];

const retentionData = [
  { day: '1', retention: 100 },
  { day: '3', retention: 85 },
  { day: '7', retention: 72 },
  { day: '14', retention: 65 },
  { day: '30', retention: 58 },
  { day: '60', retention: 42 },
  { day: '90', retention: 35 }
];

const userAgeData = [
  { name: '18-24', value: 25 },
  { name: '25-34', value: 40 },
  { name: '35-44', value: 20 },
  { name: '45-54', value: 10 },
  { name: '55+', value: 5 }
];

const userLocationData = [
  { name: 'Hitech City', value: 30 },
  { name: 'Gachibowli', value: 25 },
  { name: 'Madhapur', value: 20 },
  { name: 'Banjara Hills', value: 15 },
  { name: 'Kondapur', value: 10 }
];

const userEngagementData = [
  { month: 'Jan', ordersPerUser: 1.5, appVisits: 4.2 },
  { month: 'Feb', ordersPerUser: 1.7, appVisits: 4.5 },
  { month: 'Mar', ordersPerUser: 1.8, appVisits: 4.8 },
  { month: 'Apr', ordersPerUser: 2.0, appVisits: 5.1 },
  { month: 'May', ordersPerUser: 2.2, appVisits: 5.5 },
  { month: 'Jun', ordersPerUser: 2.5, appVisits: 5.8 },
  { month: 'Jul', ordersPerUser: 2.7, appVisits: 6.2 },
  { month: 'Aug', ordersPerUser: 2.9, appVisits: 6.5 },
  { month: 'Sep', ordersPerUser: 3.0, appVisits: 6.8 },
  { month: 'Oct', ordersPerUser: 3.1, appVisits: 7.0 },
  { month: 'Nov', ordersPerUser: 3.2, appVisits: 7.2 },
  { month: 'Dec', ordersPerUser: 3.3, appVisits: 7.5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const UserAnalytics: React.FC = () => {
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
              <h1 className="text-2xl font-bold tracking-tight">User Analytics</h1>
              <p className="text-muted-foreground">
                Insights into user growth, engagement, and behavior
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
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,630</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +9.8%
                </span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">530</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +3.9%
                </span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,845</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +5.2%
                </span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Sessions
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.5</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +4.2%
                </span> from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Analytics */}
        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="growth">User Growth</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="growth" className="space-y-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" name="Total Users" />
                      <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" name="New Users" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>User Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ordersPerUser" fill="#8884d8" name="Orders Per User" />
                      <Bar dataKey="appVisits" fill="#82ca9d" name="App Visits Per User" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="retention" className="space-y-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>User Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={retentionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottomRight', offset: 0 }} />
                      <YAxis label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="retention" stroke="#8884d8" name="Retention Rate (%)" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userAgeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userAgeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Location Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userLocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {userLocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default UserAnalytics;
