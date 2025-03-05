
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockStudios } from '@/data/mockServiceData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Building, ClipboardList, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const navigateToStudios = () => {
    navigate('/studios');
  };

  const navigateToOrders = () => {
    navigate('/orders');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Welcome to Laundry Link Admin</h1>
            <p className="text-gray-500">Manage your laundry service operations from a single dashboard</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-lg bg-admin-primary/10 flex items-center justify-center text-admin-primary mr-3">
                    <Building className="h-5 w-5" />
                  </div>
                  <CardTitle>Studios</CardTitle>
                </div>
                <CardDescription>Manage your laundry studios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-admin-primary">{mockStudios.length}</p>
                    <p className="text-gray-500 text-sm">Active Studios</p>
                  </div>
                  <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +3 this month
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={navigateToStudios} className="w-full group">
                  View Studios
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <CardTitle>Dashboard</CardTitle>
                </div>
                <CardDescription>View key metrics and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Access real-time statistics and performance insights for your business</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={navigateToDashboard} 
                  className="w-full group"
                  variant="secondary"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mr-3">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <CardTitle>Orders</CardTitle>
                </div>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View and process laundry orders from customers across all locations</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={navigateToOrders} 
                  className="w-full group"
                  variant="secondary"
                >
                  View Orders
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Quick Access to Studios</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToStudios}
                className="text-admin-primary"
              >
                View All Studios
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockStudios.slice(0, 4).map((studio) => (
                <Card key={studio.id} className="card-hover border border-gray-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{studio.name}</CardTitle>
                    <CardDescription className="text-xs">{studio.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">{studio.services.length} Services</p>
                      <div className={`w-2 h-2 rounded-full ${studio.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full group"
                      onClick={() => navigate(`/studios/details/${studio.id}`)}
                    >
                      View Details
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
