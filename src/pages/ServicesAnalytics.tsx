
import React, { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, BarChart2, ShoppingBag, Clock, ArrowUpRight, Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart } from 'recharts';

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

// New data for deeper analytics
const serviceLocationPerformance = [
  { area: 'Hitech City', standardWash: 420, expressDry: 360, dryClean: 290, premium: 210 },
  { area: 'Gachibowli', standardWash: 380, expressDry: 290, dryClean: 310, premium: 180 },
  { area: 'Madhapur', standardWash: 350, expressDry: 320, dryClean: 280, premium: 190 },
  { area: 'Kondapur', standardWash: 310, expressDry: 270, dryClean: 230, premium: 150 },
  { area: 'Banjara Hills', standardWash: 290, expressDry: 350, dryClean: 370, premium: 230 },
  { area: 'Kukatpally', standardWash: 330, expressDry: 250, dryClean: 210, premium: 140 },
  { area: 'Ameerpet', standardWash: 280, expressDry: 230, dryClean: 190, premium: 120 },
];

const servicePricingImpact = [
  { service: 'Standard Wash', originalPrice: 140, newPrice: 150, orderChange: -2, revenueChange: +5.3 },
  { service: 'Express Wash', originalPrice: 220, newPrice: 250, orderChange: -4, revenueChange: +8.6 },
  { service: 'Dry Clean', originalPrice: 280, newPrice: 290, orderChange: -1, revenueChange: +2.5 },
  { service: 'Premium Wash', originalPrice: 320, newPrice: 350, orderChange: -3, revenueChange: +6.4 },
];

const serviceQualityMetrics = [
  { name: 'Standard Wash', quality: 88, speed: 90, value: 92, satisfaction: 87 },
  { name: 'Express Wash', quality: 85, speed: 95, value: 87, satisfaction: 89 },
  { name: 'Dry Clean', quality: 92, speed: 86, value: 83, satisfaction: 90 },
  { name: 'Premium Wash', quality: 96, speed: 88, value: 82, satisfaction: 93 },
  { name: 'Ironing Only', quality: 90, speed: 93, value: 90, satisfaction: 88 },
];

const serviceUserDemographics = [
  { age: '18-24', standardWash: 15, expressDry: 25, dryClean: 10, premium: 5 },
  { age: '25-34', standardWash: 35, expressDry: 40, dryClean: 30, premium: 35 },
  { age: '35-44', standardWash: 30, expressDry: 25, dryClean: 40, premium: 40 },
  { age: '45-54', standardWash: 15, expressDry: 8, dryClean: 15, premium: 15 },
  { age: 'Above 55', standardWash: 5, expressDry: 2, dryClean: 5, premium: 5 },
];

const seasonalTrendsData = [
  { month: 'Jan', value: 85, baseline: 100 },
  { month: 'Feb', value: 90, baseline: 100 },
  { month: 'Mar', value: 98, baseline: 100 },
  { month: 'Apr', value: 110, baseline: 100 },
  { month: 'May', value: 120, baseline: 100 },
  { month: 'Jun', value: 115, baseline: 100 },
  { month: 'Jul', value: 105, baseline: 100 },
  { month: 'Aug', value: 110, baseline: 100 },
  { month: 'Sep', value: 100, baseline: 100 },
  { month: 'Oct', value: 95, baseline: 100 },
  { month: 'Nov', value: 105, baseline: 100 },
  { month: 'Dec', value: 115, baseline: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ServicesAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('last30days');
  const [selectedLocation, setSelectedLocation] = useState('all');

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
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="popularity">Popularity</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
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
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Price Impact Analysis</CardTitle>
              <CardDescription>How price changes affected order volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={servicePricingImpact}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis yAxisId="left" orientation="left" label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" domain={[-10, 10]} label={{ value: 'Change (%)', angle: 90, position: 'insideRight' }} />
                    <Tooltip formatter={(value, name) => [
                      name.includes('Price') ? `₹${value}` : `${value}%`,
                      name
                    ]} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="originalPrice" fill="#8884d8" name="Original Price (₹)" />
                    <Bar yAxisId="left" dataKey="newPrice" fill="#82ca9d" name="New Price (₹)" />
                    <Line yAxisId="right" type="monotone" dataKey="orderChange" stroke="#ff7300" name="Order Volume Change (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="revenueChange" stroke="#0088FE" name="Revenue Change (%)" />
                  </ComposedChart>
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
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Service Usage by Age Group</CardTitle>
              <CardDescription>Demographics of service usage across different age groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceUserDemographics}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                    <Bar dataKey="standardWash" fill="#8884d8" name="Standard Wash" stackId="a" />
                    <Bar dataKey="expressDry" fill="#82ca9d" name="Express Wash" stackId="a" />
                    <Bar dataKey="dryClean" fill="#FFBB28" name="Dry Clean" stackId="a" />
                    <Bar dataKey="premium" fill="#FF8042" name="Premium Wash" stackId="a" />
                  </BarChart>
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
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Seasonal Trends Analysis</CardTitle>
              <CardDescription>Monthly service demand relative to annual average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={seasonalTrendsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 140]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Relative Demand']} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Demand Index" strokeWidth={2} />
                    <Line type="monotone" dataKey="baseline" stroke="#ff7300" name="Baseline (100%)" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Peak Season</p>
                  <p className="text-xs text-gray-600">April - June</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm font-medium">Lowest Demand</p>
                  <p className="text-xs text-gray-600">October</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">Highest Growth</p>
                  <p className="text-xs text-gray-600">April (+10%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Performance by Area in Hyderabad</CardTitle>
              <CardDescription>Breakdown of service popularity across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceLocationPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    <Legend />
                    <Bar dataKey="standardWash" fill="#8884d8" name="Standard Wash" />
                    <Bar dataKey="expressDry" fill="#82ca9d" name="Express Wash" />
                    <Bar dataKey="dryClean" fill="#FFBB28" name="Dry Clean" />
                    <Bar dataKey="premium" fill="#FF8042" name="Premium" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Area for Each Service</CardTitle>
                <CardDescription>Best performing location by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                    <div className="mr-4">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Standard Wash</h4>
                      <p className="text-sm text-blue-700">Hitech City (420 orders)</p>
                      <p className="text-xs text-blue-600 mt-1">35% higher than average</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg flex items-start">
                    <div className="mr-4">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">Express Wash</h4>
                      <p className="text-sm text-green-700">Banjara Hills (350 orders)</p>
                      <p className="text-xs text-green-600 mt-1">28% higher than average</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg flex items-start">
                    <div className="mr-4">
                      <MapPin className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900">Dry Clean</h4>
                      <p className="text-sm text-amber-700">Banjara Hills (370 orders)</p>
                      <p className="text-xs text-amber-600 mt-1">40% higher than average</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg flex items-start">
                    <div className="mr-4">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900">Premium Wash</h4>
                      <p className="text-sm text-purple-700">Banjara Hills (230 orders)</p>
                      <p className="text-xs text-purple-600 mt-1">32% higher than average</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Area Revenue Analysis</CardTitle>
                <CardDescription>Comparative revenue analysis by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Hitech City', value: 375000 },
                          { name: 'Gachibowli', value: 310000 },
                          { name: 'Madhapur', value: 295000 },
                          { name: 'Banjara Hills', value: 340000 },
                          { name: 'Kondapur', value: 230000 },
                          { name: 'Kukatpally', value: 215000 },
                          { name: 'Ameerpet', value: 185000 },
                        ]}
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
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="quality" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Quality Metrics</CardTitle>
              <CardDescription>Analysis of quality, speed, value, and customer satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={serviceQualityMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Quality" dataKey="quality" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
                    <Radar name="Speed" dataKey="speed" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
                    <Radar name="Value" dataKey="value" stroke="#ffc658" fill="#ffc658" fillOpacity={0.5} />
                    <Radar name="Satisfaction" dataKey="satisfaction" stroke="#ff8042" fill="#ff8042" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800">Best Quality</h4>
                  <p className="text-lg font-semibold text-purple-900">Premium Wash</p>
                  <p className="text-xs text-purple-700 mt-1">96% rating</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800">Fastest Service</h4>
                  <p className="text-lg font-semibold text-green-900">Express Wash</p>
                  <p className="text-xs text-green-700 mt-1">95% speed rating</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">Best Value</h4>
                  <p className="text-lg font-semibold text-blue-900">Standard Wash</p>
                  <p className="text-xs text-blue-700 mt-1">92% value rating</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800">Most Satisfied</h4>
                  <p className="text-lg font-semibold text-amber-900">Premium Wash</p>
                  <p className="text-xs text-amber-700 mt-1">93% satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Correlation Matrix</CardTitle>
                <CardDescription>Analysis of relationships between services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="pb-2 font-medium text-xs text-gray-500">SERVICE</th>
                        <th className="pb-2 font-medium text-xs text-gray-500">STANDARD</th>
                        <th className="pb-2 font-medium text-xs text-gray-500">EXPRESS</th>
                        <th className="pb-2 font-medium text-xs text-gray-500">DRY CLEAN</th>
                        <th className="pb-2 font-medium text-xs text-gray-500">PREMIUM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium">Standard Wash</td>
                        <td className="py-3 text-sm">-</td>
                        <td className="py-3 text-sm">48%</td>
                        <td className="py-3 text-sm">22%</td>
                        <td className="py-3 text-sm">18%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium">Express Wash</td>
                        <td className="py-3 text-sm">48%</td>
                        <td className="py-3 text-sm">-</td>
                        <td className="py-3 text-sm">35%</td>
                        <td className="py-3 text-sm">29%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium">Dry Clean</td>
                        <td className="py-3 text-sm">22%</td>
                        <td className="py-3 text-sm">35%</td>
                        <td className="py-3 text-sm">-</td>
                        <td className="py-3 text-sm">52%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium">Premium Wash</td>
                        <td className="py-3 text-sm">18%</td>
                        <td className="py-3 text-sm">29%</td>
                        <td className="py-3 text-sm">52%</td>
                        <td className="py-3 text-sm">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>The percentages show how often customers who use one service also use another service.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Repeat Purchase Analysis</CardTitle>
                <CardDescription>How frequently customers return for each service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Standard Wash', first: 35, second: 28, third: 22, fourth: 15 },
                        { name: 'Express Wash', first: 42, second: 30, third: 18, fourth: 10 },
                        { name: 'Dry Clean', first: 25, second: 32, third: 27, fourth: 16 },
                        { name: 'Premium Wash', first: 20, second: 28, third: 30, fourth: 22 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                      <Bar dataKey="first" fill="#FF8042" name="One-time users" />
                      <Bar dataKey="second" fill="#FFBB28" name="2-3 times" />
                      <Bar dataKey="third" fill="#00C49F" name="4-6 times" />
                      <Bar dataKey="fourth" fill="#0088FE" name="7+ times" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Premium Wash has the highest customer retention with 52% of customers using it 4+ times.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ServicesAnalytics;
