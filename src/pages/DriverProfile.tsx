
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { User, Phone, Calendar, Mail, MapPin, AlertTriangle, Truck, FileText, ChevronLeft, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/ui/StatusBadge';
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
  const [isEditing, setIsEditing] = useState(false);
  
  // State for profile fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  // State for vehicle fields
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
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

  // Save all profile data
  const saveProfile = () => {
    if (driver) {
      const updatedDriver = { 
        ...driver, 
        name,
        phone,
        secondaryPhone,
        emergencyContact,
        email,
        address,
        vehicleNumber,
        vehicleName,
        vehicleModel,
        licenseNumber
      };
      
      setDriver(updatedDriver);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Driver profile has been updated successfully.",
        variant: "default",
      });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    if (driver) {
      // Reset all form values to current driver values
      setName(driver.name);
      setPhone(driver.phone);
      setSecondaryPhone(driver.secondaryPhone || '');
      setEmergencyContact(driver.emergencyContact);
      setEmail(driver.email);
      setAddress(driver.address);
      setVehicleNumber(driver.vehicleNumber);
      setVehicleName(driver.vehicleName);
      setVehicleModel(driver.vehicleModel);
      setLicenseNumber(driver.licenseNumber);
      
      setIsEditing(false);
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

  // Render field component (display or edit mode)
  const renderField = (
    label: string,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    icon?: React.ReactNode
  ) => (
    <div className="flex flex-col space-y-1">
      <Label className="text-gray-700 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {label}
      </Label>
      {isEditing ? (
        <Input
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="text-sm py-1"
        />
      ) : (
        <div className="text-gray-800 font-medium py-1.5">{value}</div>
      )}
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
            <Button 
              variant={isEditing ? "default" : "secondary"}
              onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
            
            {isEditing && (
              <Button 
                variant="outline" 
                onClick={cancelEditing}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Driver Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-700" />
                  Driver Information
                </CardTitle>
                <div className="flex items-center gap-2">
                  <StatusBadge status={driver.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderField("Name", name, setName, <User className="h-4 w-4" />)}
                {renderField("Phone", phone, setPhone, <Phone className="h-4 w-4" />)}
                {renderField("Secondary Phone", secondaryPhone || 'Not set', setSecondaryPhone, <Phone className="h-4 w-4" />)}
                {renderField("Email", email, setEmail, <Mail className="h-4 w-4" />)}
                {renderField("Emergency Contact", emergencyContact, setEmergencyContact, <AlertTriangle className="h-4 w-4" />)}
                {renderField("Address", address, setAddress, <MapPin className="h-4 w-4" />)}
                <div className="flex flex-col space-y-1">
                  <Label className="text-gray-700 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined
                  </Label>
                  <div className="text-gray-800 font-medium py-1.5">{driver.joinDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2 text-gray-700" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField("Vehicle Number", vehicleNumber, setVehicleNumber)}
                {renderField("Vehicle Name", vehicleName, setVehicleName)}
                {renderField("Model Details", vehicleModel, setVehicleModel)}
                {renderField("License Number", licenseNumber, setLicenseNumber)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DriverProfile;
