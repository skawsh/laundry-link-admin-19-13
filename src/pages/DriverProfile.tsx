
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { User, Phone, Calendar, Mail, MapPin, AlertTriangle, Truck, FileText, Award, ChevronLeft, Pencil, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the Driver type with additional fields for vehicle details
type Driver = {
  id: number;
  name: string;
  status: string;
  assignedOrders: string[];
  currentOrder: string;
  currentTask: string;
  location: string;
  phone: string;
  secondaryPhone?: string;
  totalOrders: number;
  rating: number;
  lastActive: string;
  joinDate: string;
  email: string;
  address: string;
  emergencyContact: string;
  vehicleInfo: string;
  vehicleNumber: string;
  vehicleName: string;
  vehicleModel: string;
  licenseNumber: string;
};

const DriverProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingSecondary, setIsEditingSecondary] = useState(false);
  const [secondaryPhone, setSecondaryPhone] = useState('');
  
  useEffect(() => {
    // Fetch driver data based on ID
    const fetchDriver = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we're using mock data
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
            secondaryPhone: '+91 9876543230',
            totalOrders: 205,
            rating: 4.8,
            lastActive: '2 minutes ago',
            joinDate: 'Jan 15, 2023',
            email: 'ravi.kumar@example.com',
            address: 'Flat 301, Sunshine Apartments, Banjara Hills, Hyderabad',
            emergencyContact: '+91 9876543211',
            vehicleInfo: 'Maruti Swift (2020), White, License: TS09AB1234',
            vehicleNumber: 'TS09AB1234',
            vehicleName: 'Maruti Swift',
            vehicleModel: '2020 Model, White',
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
            secondaryPhone: '+91 9876543240',
            totalOrders: 121,
            rating: 4.6,
            lastActive: '1 hour ago',
            joinDate: 'Mar 22, 2023',
            email: 'priya.reddy@example.com',
            address: 'Plot 45, Tech Park Colony, Gachibowli, Hyderabad',
            emergencyContact: '+91 9876543213',
            vehicleInfo: 'Honda Activa (2019), Silver, License: TS10CD5678',
            vehicleNumber: 'TS10CD5678',
            vehicleName: 'Honda Activa',
            vehicleModel: '2019 Model, Silver',
            licenseNumber: 'DLAP20191234568'
          },
          // Include more mock drivers as needed to match the IDs used in your application
        ];

        // Find the driver with the matching ID
        const foundDriver = mockDrivers.find(d => d.id === Number(id));
        
        if (foundDriver) {
          setDriver(foundDriver);
          setSecondaryPhone(foundDriver.secondaryPhone || '');
        } else {
          // If driver not found, show error and redirect
          toast({
            title: "Driver not found",
            description: `No driver found with ID ${id}`,
            variant: "destructive",
          });
          navigate('/drivers');
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
        toast({
          title: "Error loading driver",
          description: "Could not load driver details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriver();
    }
  }, [id, navigate]);

  const handleSecondaryPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondaryPhone(e.target.value);
  };

  const saveSecondaryPhone = () => {
    if (driver) {
      // In a real app, this would make an API call to update the phone number
      const updatedDriver = { ...driver, secondaryPhone };
      setDriver(updatedDriver);
      setIsEditingSecondary(false);
      toast({
        title: "Secondary phone updated",
        description: "Your secondary phone number has been updated successfully.",
        variant: "default",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!driver) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Driver Not Found</h1>
          <Button onClick={() => navigate('/drivers')}>
            Return to Drivers
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="back" 
              size="icon" 
              onClick={() => navigate('/drivers')}
              className="mr-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Driver Profile</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button variant={driver.status === 'active' ? 'destructive' : 'success'}>
              {driver.status === 'active' ? 'Deactivate' : 'Activate'} Driver
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1">
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold">{driver.name}</h2>
              <Badge 
                variant={driver.status === 'active' ? 'default' : 'secondary'}
                className="mt-2"
              >
                {driver.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
              <div className="flex items-center mt-2">
                <Award className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">Rating: {driver.rating}/5</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone (Primary)</p>
                  <p className="text-sm text-gray-600">{driver.phone}</p>
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <Info className="h-3 w-3" /> Contact admin to update
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Phone (Secondary)</p>
                  {isEditingSecondary ? (
                    <div className="flex gap-2 mt-1">
                      <Input 
                        value={secondaryPhone}
                        onChange={handleSecondaryPhoneChange}
                        className="text-sm py-1 h-8"
                      />
                      <div className="flex gap-1">
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={saveSecondaryPhone}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setSecondaryPhone(driver.secondaryPhone || '');
                            setIsEditingSecondary(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{driver.secondaryPhone || 'Not set'}</p>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setIsEditingSecondary(true)}
                        className="h-7 px-2"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                  <p className="text-sm text-gray-600">{driver.emergencyContact}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{driver.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-600">{driver.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Joined</p>
                  <p className="text-sm text-gray-600">{driver.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-gray-700" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-700">Vehicle Number</Label>
                      <div className="mt-1 text-gray-800 font-medium">{driver.vehicleNumber}</div>
                    </div>
                    <div>
                      <Label className="text-gray-700">Vehicle Name</Label>
                      <div className="mt-1 text-gray-800 font-medium">{driver.vehicleName}</div>
                    </div>
                    <div>
                      <Label className="text-gray-700">Model Details</Label>
                      <div className="mt-1 text-gray-800 font-medium">{driver.vehicleModel}</div>
                    </div>
                    <div>
                      <Label className="text-gray-700">License Number</Label>
                      <div className="mt-1 text-gray-800 font-medium">{driver.licenseNumber}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        For any changes to your vehicle details, please contact the admin. These details cannot be updated directly from your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-700" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-semibold text-gray-800">{driver.totalOrders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-semibold text-gray-800">{driver.assignedOrders.length}</p>
                    <p className="text-sm text-gray-600">Current Orders</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-semibold text-gray-800">{driver.lastActive}</p>
                    <p className="text-sm text-gray-600">Last Active</p>
                  </div>
                </div>

                {driver.assignedOrders.length > 0 ? (
                  <>
                    <h4 className="text-md font-medium mb-3">Current Assignments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {driver.assignedOrders.map((order, index) => (
                        <div 
                          key={index} 
                          className="p-3 border border-gray-200 rounded-lg flex justify-between items-center"
                        >
                          <span className="font-medium">{order}</span>
                          {order === driver.currentOrder && (
                            <Badge variant="outline" className="bg-blue-50">
                              Current Task: {driver.currentTask}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No orders currently assigned
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DriverProfile;
