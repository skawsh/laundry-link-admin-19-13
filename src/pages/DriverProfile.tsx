
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, Phone, Calendar, Mail, MapPin, 
  AlertTriangle, Truck, FileText, ArrowLeft
} from 'lucide-react';

const DriverProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally be an API call
    // For now, we'll simulate fetching the driver data
    const fetchDriver = () => {
      setLoading(true);
      
      // This is mock data, in a real app this would be fetched from an API
      const mockDrivers = [
        {
          id: 1,
          name: 'Ravi Kumar',
          status: 'active',
          assignedOrders: ['ORD-1234', 'ORD-5678', 'ORD-9012'],
          currentOrder: 'ORD-1234',
          currentTask: 'pickup',
          location: 'Banjara Hills, Hyderabad',
          phone: '+91 9876543210',
          totalOrders: 205,
          rating: 4.8,
          lastActive: '2 minutes ago',
          joinDate: 'Jan 15, 2023',
          email: 'ravi.kumar@example.com',
          address: 'Flat 301, Sunshine Apartments, Banjara Hills, Hyderabad',
          emergencyContact: '+91 9876543211',
          vehicleInfo: 'Maruti Swift (2020), White, License: TS09AB1234',
          licenseNumber: 'DLAP20221234567'
        },
        {
          id: 2,
          name: 'Priya Reddy',
          status: 'inactive',
          assignedOrders: ['ORD-3456', 'ORD-7890'],
          currentOrder: 'ORD-3456',
          currentTask: 'deliver',
          location: 'Gachibowli, Hyderabad',
          phone: '+91 9876543212',
          totalOrders: 121,
          rating: 4.6,
          lastActive: '1 hour ago',
          joinDate: 'Mar 22, 2023',
          email: 'priya.reddy@example.com',
          address: 'Plot 45, Tech Park Colony, Gachibowli, Hyderabad',
          emergencyContact: '+91 9876543213',
          vehicleInfo: 'Honda Activa (2019), Silver, License: TS10CD5678',
          licenseNumber: 'DLAP20191234568'
        },
        // Only including two drivers for brevity
      ];
      
      // Find the driver with the matching ID
      const driverData = mockDrivers.find(d => d.id === Number(id));
      
      // In a real app, you would handle the case where the driver is not found more gracefully
      if (driverData) {
        setDriver(driverData);
      } else {
        console.error(`Driver with ID ${id} not found`);
      }
      
      setLoading(false);
    };
    
    fetchDriver();
  }, [id]);

  const handleBack = () => {
    navigate('/drivers');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500">Loading driver profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!driver) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Button onClick={handleBack} variant="outline" className="mb-4" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Drivers
          </Button>
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Driver Not Found</h2>
            <p className="text-gray-600">The driver you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <Button onClick={handleBack} variant="outline" className="mb-4" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Drivers
        </Button>
        
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{driver.name}</h1>
                <div className="flex items-center mt-1">
                  <Badge variant={driver.status === 'active' ? 'default' : 'secondary'} className="mr-2">
                    {driver.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-500">Driver ID: {driver.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="mr-2 h-4 w-4" /> Phone Number
                  </p>
                  <p className="text-base">{driver.phone}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> Email Address
                  </p>
                  <p className="text-base">{driver.email}</p>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" /> Home Address
                </p>
                <p className="text-base">{driver.address}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" /> Joined On
                  </p>
                  <p className="text-base">{driver.joinDate}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" /> Emergency Contact
                  </p>
                  <p className="text-base">{driver.emergencyContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-admin-primary">{driver.totalOrders}</p>
                  <p className="text-sm text-gray-500">Total Orders Completed</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-admin-primary">{driver.assignedOrders.length}</p>
                  <p className="text-sm text-gray-500">Current Orders</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-admin-primary">{driver.rating}</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Truck className="mr-2 h-4 w-4" /> Vehicle Details
                  </p>
                  <p className="text-base">{driver.vehicleInfo}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <FileText className="mr-2 h-4 w-4" /> License Number
                  </p>
                  <p className="text-base">{driver.licenseNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driver.currentOrder ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Current Order</p>
                      <p className="text-base font-medium">{driver.currentOrder}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Current Task</p>
                      <p className="text-base capitalize">{driver.currentTask}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Current Location</p>
                      <p className="text-base">{driver.location}</p>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No active assignments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DriverProfile;
