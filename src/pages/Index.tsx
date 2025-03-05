
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockStudios } from '@/data/mockServiceData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const navigateToStudios = () => {
    navigate('/studios');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <div>
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
