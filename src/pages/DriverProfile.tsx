
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { User, Phone, Calendar, Mail, MapPin, AlertTriangle, Truck, FileText, Award, ChevronLeft, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  
  // State for editing profile fields
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState('');
  
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phone, setPhone] = useState('');
  
  const [isEditingSecondary, setIsEditingSecondary] = useState(false);
  const [secondaryPhone, setSecondaryPhone] = useState('');
  
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState('');
  
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState('');
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState('');
  
  // State for editing vehicle fields
  const [isEditingVehicleNumber, setIsEditingVehicleNumber] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  
  const [isEditingVehicleName, setIsEditingVehicleName] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  
  const [isEditingVehicleModel, setIsEditingVehicleModel] = useState(false);
  const [vehicleModel, setVehicleModel] = useState('');
  
  const [isEditingLicense, setIsEditingLicense] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  
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
          // Initialize the edit form values
          setName(foundDriver.name);
          setPhone(foundDriver.phone);
          setSecondaryPhone(foundDriver.secondaryPhone || '');
          setEmergencyContact(foundDriver.emergencyContact);
          setEmail(foundDriver.email);
          setAddress(foundDriver.address);
          setVehicleNumber(foundDriver.vehicleNumber);
          setVehicleName(foundDriver.vehicleName);
          setVehicleModel(foundDriver.vehicleModel);
          setLicenseNumber(foundDriver.licenseNumber);
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

  // Generic handlers for field changes
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(e.target.value);
  };

  // Generic save function with field-specific editing state
  const saveField = (
    field: string, 
    value: string, 
    setEditingState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (driver) {
      // In a real app, this would make an API call to update the field
      const updatedDriver = { ...driver, [field]: value };
      setDriver(updatedDriver);
      setEditingState(false);
      toast({
        title: "Profile updated",
        description: `Your ${field} has been updated successfully.`,
        variant: "default",
      });
    }
  };

  // Field-specific save functions
  const saveName = () => saveField('name', name, setIsEditingName);
  const savePhone = () => saveField('phone', phone, setIsEditingPhone);
  const saveSecondaryPhone = () => saveField('secondaryPhone', secondaryPhone, setIsEditingSecondary);
  const saveEmergencyContact = () => saveField('emergencyContact', emergencyContact, setIsEditingEmergency);
  const saveEmail = () => saveField('email', email, setIsEditingEmail);
  const saveAddress = () => saveField('address', address, setIsEditingAddress);
  const saveVehicleNumber = () => saveField('vehicleNumber', vehicleNumber, setIsEditingVehicleNumber);
  const saveVehicleName = () => saveField('vehicleName', vehicleName, setIsEditingVehicleName);
  const saveVehicleModel = () => saveField('vehicleModel', vehicleModel, setIsEditingVehicleModel);
  const saveLicenseNumber = () => saveField('licenseNumber', licenseNumber, setIsEditingLicense);

  // Cancel editing for any field
  const cancelEditing = (
    originalValue: string, 
    setter: React.Dispatch<React.SetStateAction<string>>,
    setEditingState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter(originalValue);
    setEditingState(false);
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

  // Render component for an editable field
  const renderEditableField = (
    icon: React.ReactNode,
    label: string,
    value: string,
    isEditing: boolean,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    currentValue: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    saveFunction: () => void,
    cancelFunction: () => void
  ) => (
    <div className="flex items-start">
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {isEditing ? (
          <div className="flex gap-2 mt-1">
            <Input 
              value={currentValue}
              onChange={handleChange}
              className="text-sm py-1 h-8"
            />
            <div className="flex gap-1">
              <Button 
                variant="success" 
                size="sm" 
                className="h-8 text-xs"
                onClick={saveFunction}
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs"
                onClick={cancelFunction}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{value}</p>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-7 px-2"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

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
              
              {isEditingName ? (
                <div className="flex flex-col gap-2 mt-1 w-full">
                  <Input 
                    value={name}
                    onChange={(e) => handleInputChange(setName, e)}
                    className="text-center text-xl font-semibold"
                  />
                  <div className="flex gap-1 justify-center">
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={saveName}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => cancelEditing(driver.name, setName, setIsEditingName)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">{driver.name}</h2>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setIsEditingName(true)}
                    className="ml-2 h-7 px-2"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
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
              {/* Editable Phone Field */}
              {renderEditableField(
                <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />,
                "Phone (Primary)",
                driver.phone,
                isEditingPhone,
                setIsEditingPhone,
                phone,
                (e) => handleInputChange(setPhone, e),
                savePhone,
                () => cancelEditing(driver.phone, setPhone, setIsEditingPhone)
              )}

              {/* Editable Secondary Phone Field */}
              {renderEditableField(
                <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />,
                "Phone (Secondary)",
                driver.secondaryPhone || 'Not set',
                isEditingSecondary,
                setIsEditingSecondary,
                secondaryPhone,
                (e) => handleInputChange(setSecondaryPhone, e),
                saveSecondaryPhone,
                () => cancelEditing(driver.secondaryPhone || '', setSecondaryPhone, setIsEditingSecondary)
              )}

              {/* Editable Emergency Contact Field */}
              {renderEditableField(
                <AlertTriangle className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />,
                "Emergency Contact",
                driver.emergencyContact,
                isEditingEmergency,
                setIsEditingEmergency,
                emergencyContact,
                (e) => handleInputChange(setEmergencyContact, e),
                saveEmergencyContact,
                () => cancelEditing(driver.emergencyContact, setEmergencyContact, setIsEditingEmergency)
              )}

              {/* Editable Email Field */}
              {renderEditableField(
                <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />,
                "Email",
                driver.email,
                isEditingEmail,
                setIsEditingEmail,
                email,
                (e) => handleInputChange(setEmail, e),
                saveEmail,
                () => cancelEditing(driver.email, setEmail, setIsEditingEmail)
              )}

              {/* Editable Address Field */}
              {renderEditableField(
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />,
                "Address",
                driver.address,
                isEditingAddress,
                setIsEditingAddress,
                address,
                (e) => handleInputChange(setAddress, e),
                saveAddress,
                () => cancelEditing(driver.address, setAddress, setIsEditingAddress)
              )}

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
                      {isEditingVehicleNumber ? (
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={vehicleNumber}
                            onChange={(e) => handleInputChange(setVehicleNumber, e)}
                            className="text-sm py-1"
                          />
                          <div className="flex gap-1">
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={saveVehicleNumber}
                              className="h-9"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => cancelEditing(driver.vehicleNumber, setVehicleNumber, setIsEditingVehicleNumber)}
                              className="h-9"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-gray-800 font-medium">{driver.vehicleNumber}</div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setIsEditingVehicleNumber(true)}
                            className="h-7 px-2"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700">Vehicle Name</Label>
                      {isEditingVehicleName ? (
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={vehicleName}
                            onChange={(e) => handleInputChange(setVehicleName, e)}
                            className="text-sm py-1"
                          />
                          <div className="flex gap-1">
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={saveVehicleName}
                              className="h-9"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => cancelEditing(driver.vehicleName, setVehicleName, setIsEditingVehicleName)}
                              className="h-9"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-gray-800 font-medium">{driver.vehicleName}</div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setIsEditingVehicleName(true)}
                            className="h-7 px-2"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700">Model Details</Label>
                      {isEditingVehicleModel ? (
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={vehicleModel}
                            onChange={(e) => handleInputChange(setVehicleModel, e)}
                            className="text-sm py-1"
                          />
                          <div className="flex gap-1">
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={saveVehicleModel}
                              className="h-9"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => cancelEditing(driver.vehicleModel, setVehicleModel, setIsEditingVehicleModel)}
                              className="h-9"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-gray-800 font-medium">{driver.vehicleModel}</div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setIsEditingVehicleModel(true)}
                            className="h-7 px-2"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700">License Number</Label>
                      {isEditingLicense ? (
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={licenseNumber}
                            onChange={(e) => handleInputChange(setLicenseNumber, e)}
                            className="text-sm py-1"
                          />
                          <div className="flex gap-1">
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={saveLicenseNumber}
                              className="h-9"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => cancelEditing(driver.licenseNumber, setLicenseNumber, setIsEditingLicense)}
                              className="h-9"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-gray-800 font-medium">{driver.licenseNumber}</div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setIsEditingLicense(true)}
                            className="h-7 px-2"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DriverProfile;
