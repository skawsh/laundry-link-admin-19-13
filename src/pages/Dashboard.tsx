
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Banknote, ShoppingBag, Clock, Users, Building, BarChart2, PieChart, TrendingUp, UserCheck, Truck } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Studios',
      value: '42',
      icon: <Building className="h-5 w-5" />,
      change: { value: '+4', trend: 'up' as const }
    },
    {
      title: 'Total Orders',
      value: '1,284',
      icon: <ShoppingBag className="h-5 w-5" />,
      change: { value: '+17%', trend: 'up' as const }
    },
    {
      title: 'Total Revenue',
      value: '$24,563',
      icon: <Banknote className="h-5 w-5" />,
      change: { value: '+8%', trend: 'up' as const }
    },
    {
      title: 'Avg. Turnaround Time',
      value: '2.4 hrs',
      icon: <Clock className="h-5 w-5" />,
      change: { value: '-15%', trend: 'up' as const }
    },
    {
      title: 'Active Customers',
      value: '862',
      icon: <Users className="h-5 w-5" />,
      change: { value: '+12%', trend: 'up' as const }
    }
  ];

  const analyticsCards = [
    {
      title: 'Studio Analytics',
      description: 'Performance metrics for all studios',
      icon: <Building className="h-6 w-6" />,
      color: 'bg-blue-500',
      path: '/studios/overall-analytics'
    },
    {
      title: 'User Analytics',
      description: 'Customer engagement and behavior',
      icon: <UserCheck className="h-6 w-6" />,
      color: 'bg-green-500',
      path: '/user-analytics'
    },
    {
      title: 'Services Analytics',
      description: 'Service utilization and popularity',
      icon: <PieChart className="h-6 w-6" />,
      color: 'bg-purple-500',
      path: '/services-analytics'
    },
    {
      title: 'Revenue Analytics',
      description: 'Financial performance and growth',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-amber-500',
      path: '/revenue'
    },
    {
      title: 'Delivery Analytics',
      description: 'Delivery efficiency and performance',
      icon: <Truck className="h-6 w-6" />,
      color: 'bg-indigo-500',
      path: '/delivery-analytics'
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your laundry platform's performance"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Analytics Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {analyticsCards.map((card, index) => (
            <Card 
              key={index}
              className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer border-t-4 hover:-translate-y-1"
              style={{ borderTopColor: card.color.replace('bg-', '') }}
              onClick={() => navigate(card.path)}
            >
              <CardHeader className={`${card.color} text-white p-4 flex flex-row items-center justify-between space-y-0`}>
                <CardTitle className="text-md font-semibold">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-500">
                  {index % 2 === 0 ? <ShoppingBag className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {index % 2 === 0 
                      ? 'New order #ORD-2547 from Customer' 
                      : 'Studio "Clean Laundry" updated their profile'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {index === 0 ? 'Just now' : `${index * 12} minutes ago`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Platform Performance</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Chart placeholder - Performance metrics</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
