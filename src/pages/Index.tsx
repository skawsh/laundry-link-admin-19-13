
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockStudios } from '@/data/mockServiceData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold mb-6">Welcome to Laundry Link Admin</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Studios</CardTitle>
                <CardDescription>Manage your laundry studios</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockStudios.length}</p>
                <p className="text-gray-500">Active Studios</p>
              </CardContent>
              <CardFooter>
                <Button onClick={navigateToStudios} className="w-full">View Studios</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>View key metrics and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Access real-time statistics and performance insights</p>
              </CardContent>
              <CardFooter>
                <Button onClick={navigateToDashboard} className="w-full">Go to Dashboard</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View and process laundry orders</p>
              </CardContent>
              <CardFooter>
                <Button onClick={navigateToOrders} className="w-full">View Orders</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Access to Studios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockStudios.slice(0, 4).map((studio) => (
                <Card key={studio.id} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{studio.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500">{studio.services.length} Services</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/studios/details/${studio.id}`)}
                    >
                      View Details
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
