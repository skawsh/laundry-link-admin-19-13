
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Edit, X } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Extended Studio type with additional fields for the details page
interface StudioDetail {
  id: number;
  studioId: string;
  name: string;
  ownerName: string;
  ownerLastName?: string;
  contactNumber: string;
  secondaryNumber?: string;
  services: number;
  rating: number;
  status: 'active' | 'inactive';
  email?: string;
  address?: string;
  joinedDate?: string;
  totalOrders?: number;
  revenue?: number;
  avgSackValue?: number;
  // Studio Setup fields
  numberOfEmployees?: number;
  dailyCapacity?: number;
  specialEquipment?: string;
  washCategories?: string[];
  // Business Details
  businessName?: string;
  gstNumber?: string;
  panNumber?: string;
  serviceableAreas?: string[];
  // Payment Details
  accountNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  ifscCode?: string;
  upiId?: string;
}

// Sample data for demonstration
const sampleStudioData: StudioDetail = {
  id: 1,
  studioId: "STU10001",
  name: "Saiteja Laundry",
  ownerName: "Saiteja",
  ownerLastName: "Samala",
  contactNumber: "8099830308",
  secondaryNumber: "9000135876",
  services: 56,
  rating: 4.5,
  status: 'active',
  email: "saitejasamala0808@gmail.com",
  address: ", , - 0",
  joinedDate: '2022-04-15',
  totalOrders: 325,
  revenue: 125800,
  avgSackValue: 387,
  numberOfEmployees: 1,
  dailyCapacity: 100,
  specialEquipment: "machine",
  washCategories: ["both"],
  businessName: "Saiteja Laundry Services",
  gstNumber: "29ABCDE1234F1Z5",
  panNumber: "ABCDE1234F",
  serviceableAreas: ["Kormangala", "HSR Layout", "BTM Layout"],
  accountNumber: "0",
  accountHolderName: "Saiteja Samala",
  bankName: "State Bank of India",
  ifscCode: "SBIN0001234",
  upiId: "saitejasamala@upi"
};

const StudioDetails: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [studio, setStudio] = useState<StudioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch studio data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we're just using the sample data
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setStudio(sampleStudioData);
      setIsLoading(false);
    }, 500);
  }, [studioId]);

  const handleGoBack = () => {
    navigate('/studios');
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!studio) return;
    
    const { name, value } = e.target;
    setStudio({
      ...studio,
      [name]: value
    });
  };

  const handleSave = () => {
    if (!studio) return;
    
    // In a real app, this would be an API call to update the studio
    toast({
      title: "Changes saved",
      description: "Studio details have been updated successfully",
      duration: 3000,
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset any changes by re-fetching the data
    if (studioId) {
      setStudio(sampleStudioData);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading studio details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!studio) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-500 mb-4">Studio not found.</p>
          <button 
            onClick={handleGoBack}
            className="flex items-center text-admin-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back to studios
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{studio.name}</h1>
              <p className="text-sm text-gray-500">ID: {studio.studioId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-admin-primary text-white rounded-md hover:bg-opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={handleToggleEdit}
                className="flex items-center px-4 py-2 bg-admin-primary text-white rounded-md hover:bg-opacity-90"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Owner Name</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        name="ownerName" 
                        value={studio.ownerName} 
                        onChange={handleInputChange} 
                        placeholder="First Name" 
                      />
                      <Input 
                        name="ownerLastName" 
                        value={studio.ownerLastName || ''} 
                        onChange={handleInputChange} 
                        placeholder="Last Name" 
                      />
                    </div>
                  ) : (
                    <p className="text-base">{studio.ownerName} {studio.ownerLastName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Studio Name</label>
                  {isEditing ? (
                    <Input 
                      name="name" 
                      value={studio.name} 
                      onChange={handleInputChange} 
                      placeholder="Studio Name" 
                    />
                  ) : (
                    <p className="text-base">{studio.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <Input 
                      type="email"
                      name="email" 
                      value={studio.email || ''} 
                      onChange={handleInputChange} 
                      placeholder="Email Address" 
                    />
                  ) : (
                    <p className="text-base">{studio.email || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Primary Number</label>
                  {isEditing ? (
                    <Input 
                      name="contactNumber" 
                      value={studio.contactNumber} 
                      onChange={handleInputChange} 
                      placeholder="Primary Contact Number" 
                    />
                  ) : (
                    <p className="text-base">{studio.contactNumber}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Secondary Number</label>
                  {isEditing ? (
                    <Input 
                      name="secondaryNumber" 
                      value={studio.secondaryNumber || ''} 
                      onChange={handleInputChange} 
                      placeholder="Secondary Contact Number" 
                    />
                  ) : (
                    <p className="text-base">{studio.secondaryNumber || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business Name</label>
                  {isEditing ? (
                    <Input 
                      name="businessName" 
                      value={studio.businessName || ''} 
                      onChange={handleInputChange} 
                      placeholder="Business Name" 
                    />
                  ) : (
                    <p className="text-base">{studio.businessName || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">GST Number</label>
                  {isEditing ? (
                    <Input 
                      name="gstNumber" 
                      value={studio.gstNumber || ''} 
                      onChange={handleInputChange} 
                      placeholder="GST Number" 
                    />
                  ) : (
                    <p className="text-base">{studio.gstNumber || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">PAN Number</label>
                  {isEditing ? (
                    <Input 
                      name="panNumber" 
                      value={studio.panNumber || ''} 
                      onChange={handleInputChange} 
                      placeholder="PAN Number" 
                    />
                  ) : (
                    <p className="text-base">{studio.panNumber || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Studio Setup Card */}
          <Card>
            <CardHeader>
              <CardTitle>Studio Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">No Of Employees</label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      name="numberOfEmployees" 
                      value={studio.numberOfEmployees || 0} 
                      onChange={handleInputChange} 
                      placeholder="Number of Employees" 
                    />
                  ) : (
                    <p className="text-base">{studio.numberOfEmployees || '0'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Daily Capacity</label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      name="dailyCapacity" 
                      value={studio.dailyCapacity || 0} 
                      onChange={handleInputChange} 
                      placeholder="Daily Capacity" 
                    />
                  ) : (
                    <p className="text-base">{studio.dailyCapacity || '0'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Special Equipment</label>
                  {isEditing ? (
                    <Input 
                      name="specialEquipment" 
                      value={studio.specialEquipment || ''} 
                      onChange={handleInputChange} 
                      placeholder="Special Equipment" 
                    />
                  ) : (
                    <p className="text-base">{studio.specialEquipment || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Wash Categories</label>
                  {isEditing ? (
                    <div className="flex space-x-4 mt-2">
                      <div className="flex items-center">
                        <Checkbox id="washCat1" />
                        <label htmlFor="washCat1" className="ml-2 text-sm">Iron Only</label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="washCat2" />
                        <label htmlFor="washCat2" className="ml-2 text-sm">Wash Only</label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="washCat3" defaultChecked />
                        <label htmlFor="washCat3" className="ml-2 text-sm">Both</label>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base">{studio.washCategories?.join(', ') || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Address Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  {isEditing ? (
                    <Textarea 
                      name="address" 
                      value={studio.address || ''} 
                      onChange={handleInputChange} 
                      placeholder="Address" 
                      rows={3}
                    />
                  ) : (
                    <p className="text-base">{studio.address || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Number</label>
                  {isEditing ? (
                    <Input 
                      name="accountNumber" 
                      value={studio.accountNumber || ''} 
                      onChange={handleInputChange} 
                      placeholder="Account Number" 
                    />
                  ) : (
                    <p className="text-base">{studio.accountNumber || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
                  {isEditing ? (
                    <Input 
                      name="accountHolderName" 
                      value={studio.accountHolderName || ''} 
                      onChange={handleInputChange} 
                      placeholder="Account Holder Name" 
                    />
                  ) : (
                    <p className="text-base">{studio.accountHolderName || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bank Name</label>
                  {isEditing ? (
                    <Input 
                      name="bankName" 
                      value={studio.bankName || ''} 
                      onChange={handleInputChange} 
                      placeholder="Bank Name" 
                    />
                  ) : (
                    <p className="text-base">{studio.bankName || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                  {isEditing ? (
                    <Input 
                      name="ifscCode" 
                      value={studio.ifscCode || ''} 
                      onChange={handleInputChange} 
                      placeholder="IFSC Code" 
                    />
                  ) : (
                    <p className="text-base">{studio.ifscCode || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">UPI ID</label>
                  {isEditing ? (
                    <Input 
                      name="upiId" 
                      value={studio.upiId || ''} 
                      onChange={handleInputChange} 
                      placeholder="UPI ID" 
                    />
                  ) : (
                    <p className="text-base">{studio.upiId || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudioDetails;
