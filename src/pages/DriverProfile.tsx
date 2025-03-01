
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, Phone, Calendar, Mail, MapPin, UserCog, Car, FileText, 
  Package, Star, ArrowLeft, Clock
} from 'lucide-react';

const DriverProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driverData, setDriverData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    // In a real app, you would fetch the driver data from an API
    // For demo purposes, we're using mock data
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
        joinDate: 'Jan 15, 2023',
        email: 'ravi.kumar@example.com',
        address: 'Flat 301, Sunshine Apartments, Banjara Hills, Hyderabad',
        emergencyContact: '+91 9876543211',
        vehicleInfo: 'Maruti Swift (2020), White, License: TS09AB1234',
        licenseNumber: 'DLAP20221234567'
      },
      // Add more mock drivers as needed
    ];
    
    const driver = mockDrivers.find(d => d.id === Number(id));
    
    if (driver) {
      setDriverData(driver);
    }
    
    setLoading(false);
  }, [id]);

  const handleBackClick = () => {
    navigate('/drivers');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Button onClick={handleBackClick} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drivers
            </Button>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!driverData) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Button onClick={handleBackClick} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drivers
            </Button>
          </div>
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Driver Not Found</h2>
            <p className="text-gray-500 mb-4">The driver you are looking for does not exist or has been removed.</p>
            <Button onClick={handleBackClick}>Return to Drivers List</Button>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={handleBackClick} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drivers
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Driver Profile</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Edit Profile</Button>
            <Button>Assign Order</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold">{driverData.name}</h2>
                <Badge variant={driverData.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                  {driverData.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm">{driverData.rating} Rating</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{driverData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{driverData.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-gray-600">{driverData.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">{driverData.location}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-md font-semibold mb-4">Emergency Contact</h3>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <p className="text-sm text-gray-600">{driverData.emergencyContact}</p>
              </div>
            </Card>
          </div>

          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-md font-semibold mb-4 flex items-center">
                <UserCog className="h-5 w-5 mr-2 text-primary" />
                Driver Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Full Address</h4>
                  <p className="text-sm">{driverData.address}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Total Orders Completed</h4>
                  <p className="text-sm">{driverData.totalOrders}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-md font-semibold mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2 text-primary" />
                Vehicle Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Vehicle Details</h4>
                  <p className="text-sm">{driverData.vehicleInfo}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">License Number</h4>
                  <p className="text-sm">{driverData.licenseNumber}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-md font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Current Orders ({driverData.assignedOrders.length})
              </h3>
              
              {driverData.assignedOrders.length > 0 ? (
                <div className="space-y-4">
                  {driverData.assignedOrders.map((order: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-semibold">{order}</h4>
                          {order === driverData.currentOrder && (
                            <Badge variant="outline" className="mt-1">
                              Current Task: {driverData.currentTask}
                            </Badge>
                          )}
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Orders Assigned</h3>
                  <p className="text-sm text-gray-500 mt-1">This driver currently has no orders assigned.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DriverProfile;
