
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Info, Truck, User, DollarSign } from "lucide-react";
import { formatIndianRupees } from '@/utils/dateUtils';
import { initialUnpaidOrders } from '@/data/mockPaymentData';
import { UnpaidOrder } from '@/types/paymentTypes';

// Import sample data from OrderDetailsModal
const clothingItemsByOrderId: Record<string, {name: string, quantity: number}[]> = {
  'ORD-1001': [
    {name: 'Shirt', quantity: 2},
    {name: 'Pant', quantity: 1},
    {name: 'T-shirt', quantity: 1},
    {name: 'Shorts', quantity: 2},
  ],
  'ORD-1002': [
    {name: 'Saree', quantity: 1},
    {name: 'Blouse', quantity: 2},
    {name: 'Dress', quantity: 1},
  ],
  'ORD-1003': [
    {name: 'Suit', quantity: 1},
    {name: 'Tie', quantity: 2},
    {name: 'Formal Shirt', quantity: 3},
  ],
  'ORD-1004': [
    {name: 'Jeans', quantity: 2},
    {name: 'T-shirt', quantity: 3},
    {name: 'Jacket', quantity: 1},
  ],
  'ORD-1005': [
    {name: 'Kurta', quantity: 1},
    {name: 'Pajama', quantity: 1},
    {name: 'Shawl', quantity: 1},
  ],
  'ORD-1006': [
    {name: 'Sweater', quantity: 2},
    {name: 'Socks', quantity: 4},
    {name: 'Gloves', quantity: 1},
  ],
};

// Sample delivery information for each order
const deliveryInfoByOrderId: Record<string, {assignedTo: string, vehicleDetails: string, phoneNumber: string, deliveryTime: string}> = {
  'ORD-1001': {
    assignedTo: 'Deepak Bagade',
    vehicleDetails: 'Maruti WagonR TS-08 JN 9988',
    phoneNumber: '9901362590',
    deliveryTime: '4:30 PM'
  },
  'ORD-1002': {
    assignedTo: 'Rahul Sharma',
    vehicleDetails: 'Honda Activa TS-09 KL 2345',
    phoneNumber: '8756423190',
    deliveryTime: '5:15 PM'
  },
  'ORD-1003': {
    assignedTo: 'Vinod Kumar',
    vehicleDetails: 'TVS Apache TS-10 AB 7721',
    phoneNumber: '9845123670',
    deliveryTime: '6:00 PM'
  },
  'ORD-1004': {
    assignedTo: 'Priya Singh',
    vehicleDetails: 'Bajaj Chetak TS-11 CD 5643',
    phoneNumber: '7789456123',
    deliveryTime: '3:45 PM'
  },
  'ORD-1005': {
    assignedTo: 'Amit Patel',
    vehicleDetails: 'Hero Splendor TS-12 EF 3321',
    phoneNumber: '9956784321',
    deliveryTime: '2:30 PM'
  },
  'ORD-1006': {
    assignedTo: 'Neha Gupta',
    vehicleDetails: 'Ola Electric TS-13 GH 9087',
    phoneNumber: '8890123456',
    deliveryTime: '5:45 PM'
  },
};

// Sample customer information for each order
const customerInfoByOrderId: Record<string, {name: string, phone: string, address: string}> = {
  'ORD-1001': {
    name: 'Mahesh BM',
    phone: '8197739892',
    address: '306, Vasishaya Men\'s PG, Prashant Hills, Hyderabad-500032'
  },
  'ORD-1002': {
    name: 'Priya Sharma',
    phone: '9876543210',
    address: '42, Lake View Apartments, Jubilee Hills, Hyderabad-500033'
  },
  'ORD-1003': {
    name: 'Rahul Verma',
    phone: '7788990011',
    address: '204, Sunrise Towers, Banjara Hills, Hyderabad-500034'
  },
  'ORD-1004': {
    name: 'Ananya Patel',
    phone: '9988776655',
    address: '515, Green Valley, Gachibowli, Hyderabad-500035'
  },
  'ORD-1005': {
    name: 'Vikram Singh',
    phone: '8866554433',
    address: '78, Royal Enclave, Madhapur, Hyderabad-500081'
  },
  'ORD-1006': {
    name: 'Neha Reddy',
    phone: '7755669988',
    address: '323, Cyber Towers, Hitech City, Hyderabad-500086'
  },
};

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // Find the order from the mock data
  const orderDetails = initialUnpaidOrders.find(order => order.id === orderId) || null;

  if (!orderDetails) {
    return (
      <AdminLayout>
        <PageHeader 
          title="Order Not Found" 
          subtitle="The requested order could not be found"
          backButton={
            <Button
              variant="back"
              onClick={() => navigate(-1)}
              size="icon"
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          }
        />
        <div className="p-6 text-center">
          <p>The order you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  // Format date in DD/MM/YYYY format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Get clothing items for the current order
  const getClothingItems = () => {
    return clothingItemsByOrderId[orderDetails.id] || clothingItemsByOrderId['ORD-1001'];
  };

  // Get delivery info for the current order
  const getDeliveryInfo = () => {
    return deliveryInfoByOrderId[orderDetails.id] || deliveryInfoByOrderId['ORD-1001'];
  };

  // Get customer info for the current order
  const getCustomerInfo = () => {
    return customerInfoByOrderId[orderDetails.id] || customerInfoByOrderId['ORD-1001'];
  };

  // Get wash type display text
  const getWashTypeText = (washType: string | undefined) => {
    if (washType === 'express') return 'Quick Wash';
    if (washType === 'standard') return 'Standard Wash';
    if (washType === 'combined') return 'Standard Wash & Express Wash';
    return 'Standard Wash';
  };

  // Fixed per kg rate at 49 rs/kg as requested
  const getPerKgRate = () => {
    return 49;
  };

  // Fixed total weight at 2.5 kg as requested
  const getTotalWeight = () => {
    return 2.5;
  };

  // Calculate delivery date based on order date and wash type
  const calculateDeliveryDate = (orderDate: string, washType: 'express' | 'standard' | 'combined' | undefined): string => {
    if (!orderDate) return '';
    
    const date = new Date(orderDate);
    
    if (washType === 'express') {
      date.setDate(date.getDate() + 1);
    } else {
      date.setDate(date.getDate() + 4);
    }
    
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Determine if we need to show both standard and express services
  const isCombinedWash = orderDetails.washType === 'combined';

  return (
    <AdminLayout>
      <PageHeader 
        title={`Order Details: ${orderDetails.id}`} 
        subtitle={`View details for order ${orderDetails.id}`}
        backButton={
          <Button
            variant="back"
            onClick={() => navigate(-1)}
            size="icon"
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      >
        <Button
          variant="success"
          onClick={() => navigate(`/studios/payments/${orderDetails.studioId}`)}
          className="flex items-center"
        >
          <Check className="h-4 w-4 mr-2" />
          <span>Back to Payments</span>
        </Button>
      </PageHeader>

      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-6">
          {/* Order Information Card */}
          <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-100 py-2 px-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-green-800" />
              <h3 className="text-md font-medium text-green-800">Order Information</h3>
            </div>
            <CardContent className="p-4 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Order ID - </span>
                  <span className="font-medium">{orderDetails.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ordered Date - </span>
                  <span className="font-medium">{formatDate(orderDetails.date)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Order Delivered date - </span>
                  <span className="font-medium">{calculateDeliveryDate(orderDetails.date, orderDetails.washType)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Wash Type - </span>
                  <span className="font-medium text-red-600">{getWashTypeText(orderDetails.washType)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Information Card */}
          <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-100 py-2 px-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-800" />
              <h3 className="text-md font-medium text-green-800">Customer Information</h3>
            </div>
            <CardContent className="p-4 text-sm space-y-2">
              <div>
                <span className="text-gray-600">Customer Name - </span>
                <span className="font-medium">{getCustomerInfo().name}</span>
              </div>
              <div>
                <span className="text-gray-600">Number - </span>
                <span className="font-medium">{getCustomerInfo().phone}</span>
              </div>
              <div>
                <span className="text-gray-600">Address - </span>
                <span className="font-medium">{getCustomerInfo().address}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Services Information Card */}
          <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-100 py-2 px-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-800" />
              <h3 className="text-md font-medium text-green-800">Services Information</h3>
            </div>
            <CardContent className="p-4 text-sm">
              <div className="mb-3">
                <span className="text-gray-600">Wash Type - </span>
                <span className="font-medium text-red-600">{getWashTypeText(orderDetails.washType)}</span>
              </div>
              
              {isCombinedWash ? (
                <>
                  {/* Standard Wash Section */}
                  <div className="border-b border-gray-200 mb-3">
                    <div className="font-medium mb-2 text-blue-700">Standard Wash</div>
                    <div className="grid grid-cols-3 gap-1 font-medium mb-2">
                      <div>Services</div>
                      <div>Quantity</div>
                      <div className="text-right">Price</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      <div>1. Wash & Fold</div>
                      <div>{getTotalWeight()} X {getPerKgRate()}/kg</div>
                      <div className="text-right">{formatIndianRupees(getTotalWeight() * getPerKgRate())}</div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Delivery in 4 days
                    </div>
                  </div>
                  
                  {/* Express Wash Section */}
                  <div className="border-b border-gray-200 mb-3">
                    <div className="font-medium mb-2 text-purple-700">Express Wash</div>
                    <div className="grid grid-cols-3 gap-1 font-medium mb-2">
                      <div>Services</div>
                      <div>Quantity</div>
                      <div className="text-right">Price</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      <div>1. Express Wash & Fold</div>
                      <div>{getTotalWeight()} X {getPerKgRate()}/kg</div>
                      <div className="text-right">{formatIndianRupees(getTotalWeight() * getPerKgRate())}</div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Delivery in 1 day
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-b border-gray-200 mb-3">
                  <div className="grid grid-cols-3 gap-1 font-medium mb-2">
                    <div>Services</div>
                    <div>Quantity</div>
                    <div className="text-right">Price</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    <div>1. Wash & Fold</div>
                    <div>{getTotalWeight()} X {getPerKgRate()}/kg</div>
                    <div className="text-right">{formatIndianRupees(getTotalWeight() * getPerKgRate())}</div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <div className="font-medium mb-2">Clothing Items</div>
                <div className="grid grid-cols-2 gap-2">
                  {getClothingItems().map((item, index) => (
                    <div key={index} className="ml-2">
                      {index + 1}. {item.name} ({item.quantity})
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between font-medium border-t border-gray-200 pt-3 text-base">
                <div>Total</div>
                <div>{isCombinedWash ? 
                  formatIndianRupees(getTotalWeight() * getPerKgRate() * 2) : 
                  formatIndianRupees(getTotalWeight() * getPerKgRate())}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Delivery Information Card */}
          <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-100 py-2 px-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-green-800" />
              <h3 className="text-md font-medium text-green-800">Delivery Information</h3>
            </div>
            <CardContent className="p-4 text-sm space-y-2">
              <div>
                <span className="text-gray-600">Assigned to - </span>
                <span className="font-medium">{getDeliveryInfo().assignedTo} / {getDeliveryInfo().phoneNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Delivered date & time - </span>
                <span className="font-medium">
                  {calculateDeliveryDate(orderDetails.date, orderDetails.washType)} at {getDeliveryInfo().deliveryTime}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Vehicle details - </span>
                <span className="font-medium">{getDeliveryInfo().vehicleDetails}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
