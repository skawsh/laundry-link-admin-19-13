
import React from 'react';
import { LayoutDashboard, Banknote, ShoppingBag, Clock, Users, Building } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';

const Dashboard: React.FC = () => {
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
