
import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Clipboard, DollarSign, Star, ShoppingBag, Users, ChevronDown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import StatsCard from '../components/ui/StatsCard';
import { useToast } from "@/hooks/use-toast";

// Studio data type
interface StudioAnalytics {
  id: number;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  avgTurnaroundTime: string;
  rating: number;
  customerSatisfaction: number;
  cancellationRate: number;
  activeCustomers: number;
  monthlyStats: {
    month: string;
    orders: number;
    revenue: number;
  }[];
  popularServices: {
    service: string;
    percentage: number;
  }[];
}

// Sample data
const studioData: Record<string, StudioAnalytics> = {
  "1": {
    id: 1,
    name: "Saiteja Laundry",
    totalOrders: 325,
    totalRevenue: 12580,
    avgTurnaroundTime: "2.3 hrs",
    rating: 4.5,
    customerSatisfaction: 92,
    cancellationRate: 3.2,
    activeCustomers: 145,
    monthlyStats: [
      { month: "Jan", orders: 45, revenue: 1750 },
      { month: "Feb", orders: 52, revenue: 2050 },
      { month: "Mar", orders: 48, revenue: 1880 },
      { month: "Apr", orders: 55, revenue: 2150 },
      { month: "May", orders: 68, revenue: 2380 },
      { month: "Jun", orders: 57, revenue: 2370 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 45 },
      { service: "Dry Cleaning", percentage: 28 },
      { service: "Ironing", percentage: 18 },
      { service: "Others", percentage: 9 }
    ]
  },
  "2": {
    id: 2,
    name: "Sparkle Clean Laundry",
    totalOrders: 287,
    totalRevenue: 10950,
    avgTurnaroundTime: "2.5 hrs",
    rating: 4.7,
    customerSatisfaction: 95,
    cancellationRate: 2.1,
    activeCustomers: 132,
    monthlyStats: [
      { month: "Jan", orders: 42, revenue: 1650 },
      { month: "Feb", orders: 46, revenue: 1800 },
      { month: "Mar", orders: 51, revenue: 1950 },
      { month: "Apr", orders: 49, revenue: 1900 },
      { month: "May", orders: 54, revenue: 2050 },
      { month: "Jun", orders: 45, revenue: 1600 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 38 },
      { service: "Dry Cleaning", percentage: 32 },
      { service: "Ironing", percentage: 22 },
      { service: "Others", percentage: 8 }
    ]
  }
};

const StudioAnalytics: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [timeRange, setTimeRange] = useState<string>("30days");
  const { toast } = useToast();
  
  // If no studioId is provided in URL params, use the first studio as default
  const defaultStudioId = studioId || "1";
  const studio = studioData[defaultStudioId];
  
  if (!studio) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Studio Not Found</h3>
            <p className="text-sm text-gray-500 mb-4">The requested studio could not be found.</p>
            <Link 
              to="/studios"
              className="inline-flex items-center px-4 py-2 bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Studios
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast({
      title: "Time Range Changed",
      description: `Analytics data now showing for: ${range}`,
      duration: 2000,
    });
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <Link 
          to="/studios"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Studios
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{studio.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Analytics Dashboard</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Custom Range</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Key performance indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total Orders"
          value={studio.totalOrders.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          change={{ value: "+8%", trend: "up" }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${studio.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          change={{ value: "+12%", trend: "up" }}
        />
        <StatsCard
          title="Avg. Turnaround Time"
          value={studio.avgTurnaroundTime}
          icon={<Clock className="h-5 w-5" />}
          change={{ value: "-5%", trend: "up" }}
        />
        <StatsCard
          title="Active Customers"
          value={studio.activeCustomers.toString()}
          icon={<Users className="h-5 w-5" />}
          change={{ value: "+14%", trend: "up" }}
        />
      </div>
      
      {/* Performance metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Monthly Order & Revenue Trend</h2>
          <div className="h-64 border-b border-gray-100 mb-4">
            {/* In a real app, this would be a line or bar chart showing the trend */}
            <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500">Chart placeholder - Monthly trend</p>
                <p className="text-xs text-gray-400 mt-1">Orders and revenue over time</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Orders (Period)</p>
              <p className="text-xl font-medium">{studio.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue (Period)</p>
              <p className="text-xl font-medium">${studio.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Customer Satisfaction Metrics</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <p className="text-sm font-medium text-gray-700">Rating</p>
              </div>
              <p className="text-2xl font-semibold">{studio.rating}<span className="text-lg">/5</span></p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-1">
                <Users className="h-4 w-4 text-blue-500 mr-1" />
                <p className="text-sm font-medium text-gray-700">Satisfaction</p>
              </div>
              <p className="text-2xl font-semibold">{studio.customerSatisfaction}%</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-700">Cancellation Rate</p>
                <p className="text-sm font-medium">{studio.cancellationRate}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full" 
                  style={{ width: `${studio.cancellationRate * 3}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-700">On-time Delivery</p>
                <p className="text-sm font-medium">{96 - studio.cancellationRate}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full" 
                  style={{ width: `${96 - studio.cancellationRate}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Popular Services</h2>
          <div className="space-y-4">
            {studio.popularServices.map((service, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-700">{service.service}</p>
                  <p className="text-sm font-medium">{service.percentage}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-400' : 
                      index === 1 ? 'bg-purple-400' : 
                      index === 2 ? 'bg-green-400' : 'bg-yellow-400'
                    }`} 
                    style={{ width: `${service.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-500">
                  <Clipboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Order #{Math.floor(10000 + Math.random() * 90000)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {index === 0 ? 'Today' : index === 1 ? 'Yesterday' : `${index + 1} days ago`} • 
                    ${Math.floor(20 + Math.random() * 50)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-sm text-admin-primary hover:underline">
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudioAnalytics;
