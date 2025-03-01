
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnpaidOrder } from '@/types/paymentTypes';
import { formatIndianRupees } from '@/utils/dateUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Check, Info, Truck, User, DollarSign } from "lucide-react";

interface OrderDetailsModalProps {
  selectedOrderDetails: UnpaidOrder | null;
  showOrderDetailsModal: boolean;
  setShowOrderDetailsModal: (value: boolean) => void;
  openPaymentModal: (order: UnpaidOrder) => void;
}

// Sample clothing items for each order
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
const deliveryInfoByOrderId: Record<string, {assignedTo: string, vehicleDetails: string, phoneNumber: string}> = {
  'ORD-1001': {
    assignedTo: 'Deepak Bagade',
    vehicleDetails: 'Maruti WagonR TS-08 JN 9988',
    phoneNumber: '9901362590'
  },
  'ORD-1002': {
    assignedTo: 'Rahul Sharma',
    vehicleDetails: 'Honda Activa TS-09 KL 2345',
    phoneNumber: '8756423190'
  },
  'ORD-1003': {
    assignedTo: 'Vinod Kumar',
    vehicleDetails: 'TVS Apache TS-10 AB 7721',
    phoneNumber: '9845123670'
  },
  'ORD-1004': {
    assignedTo: 'Priya Singh',
    vehicleDetails: 'Bajaj Chetak TS-11 CD 5643',
    phoneNumber: '7789456123'
  },
  'ORD-1005': {
    assignedTo: 'Amit Patel',
    vehicleDetails: 'Hero Splendor TS-12 EF 3321',
    phoneNumber: '9956784321'
  },
  'ORD-1006': {
    assignedTo: 'Neha Gupta',
    vehicleDetails: 'Ola Electric TS-13 GH 9087',
    phoneNumber: '8890123456'
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

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  selectedOrderDetails,
  showOrderDetailsModal,
  setShowOrderDetailsModal,
  openPaymentModal,
}) => {
  // Format date in DD/MM/YYYY format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Get clothing items for the current order
  const getClothingItems = () => {
    const orderId = selectedOrderDetails?.id || '';
    return clothingItemsByOrderId[orderId] || clothingItemsByOrderId['ORD-1001'];
  };

  // Get delivery info for the current order
  const getDeliveryInfo = () => {
    const orderId = selectedOrderDetails?.id || '';
    return deliveryInfoByOrderId[orderId] || deliveryInfoByOrderId['ORD-1001'];
  };

  // Get customer info for the current order
  const getCustomerInfo = () => {
    const orderId = selectedOrderDetails?.id || '';
    return customerInfoByOrderId[orderId] || customerInfoByOrderId['ORD-1001'];
  };

  // Get wash type display text
  const getWashTypeText = (washType: string | undefined) => {
    if (washType === 'express') return 'Quick Wash';
    if (washType === 'standard') return 'Standard Wash';
    return 'Combined Wash';
  };

  // Calculate per kg rate based on wash type
  const getPerKgRate = (washType: string | undefined) => {
    if (washType === 'express') return 59;
    if (washType === 'standard') return 49;
    return 69; // combined
  };

  // Calculate total weight based on clothing items (simplified for demo)
  const getTotalWeight = () => {
    return 2.5; // 2.5 kg for all orders in this example
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

  if (!selectedOrderDetails) return null;

  return (
    <Dialog open={showOrderDetailsModal} onOpenChange={setShowOrderDetailsModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl pb-2 pt-0 text-blue-700 bg-blue-50 mx-[-24px] rounded-t-lg">
            Order details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-0">
          {/* Order Information Card */}
          <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-100 py-1 px-3 flex items-center">
              <Info className="h-4 w-4 mr-2 text-green-800" />
              <h3 className="text-sm font-medium text-green-800">Order Information</h3>
            </div>
            <CardContent className="p-3 text-sm space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">Order ID - </span>
                  <span className="font-medium">{selectedOrderDetails.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ordered Date - </span>
                  <span className="font-medium">{formatDate(selectedOrderDetails.date)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Order Delivered date - </span>
                  <span className="font-medium">{calculateDeliveryDate(selectedOrderDetails.date, selectedOrderDetails.washType)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Wash Type - </span>
                  <span className="font-medium text-red-600">{getWashTypeText(selectedOrderDetails.washType)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Information Card */}
          <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-100 py-1 px-3 flex items-center">
              <User className="h-4 w-4 mr-2 text-green-800" />
              <h3 className="text-sm font-medium text-green-800">Customer Information</h3>
            </div>
            <CardContent className="p-3 text-sm space-y-1">
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
            <div className="bg-green-100 py-1 px-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-800" />
              <h3 className="text-sm font-medium text-green-800">Services Information</h3>
            </div>
            <CardContent className="p-3 text-sm">
              <div className="mb-2">
                <span className="text-gray-600">Wash Type - </span>
                <span className="font-medium text-red-600">{getWashTypeText(selectedOrderDetails.washType)}</span>
              </div>
              
              <div className="border-b border-gray-200 mb-2">
                <div className="grid grid-cols-3 gap-1 font-medium mb-1">
                  <div>Services</div>
                  <div>Quantity</div>
                  <div className="text-right">Price</div>
                </div>
                
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <div>1. Wash & Fold</div>
                  <div>{getTotalWeight()} X {getPerKgRate(selectedOrderDetails.washType)}/kg</div>
                  <div className="text-right">{formatIndianRupees(getTotalWeight() * getPerKgRate(selectedOrderDetails.washType))}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="font-medium">Clothing Items</div>
                {getClothingItems().map((item, index) => (
                  <div key={index} className="ml-2">
                    {index + 1}. {item.name}({item.quantity})
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between font-medium border-t border-gray-200 pt-2">
                <div>Total</div>
                <div>{formatIndianRupees(selectedOrderDetails.amount)}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Delivery Information Card */}
          <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-100 py-1 px-3 flex items-center">
              <Truck className="h-4 w-4 mr-2 text-green-800" />
              <h3 className="text-sm font-medium text-green-800">Delivery Information</h3>
            </div>
            <CardContent className="p-3 text-sm space-y-1">
              <div>
                <span className="text-gray-600">Assigned to - </span>
                <span className="font-medium">{getDeliveryInfo().assignedTo} / {getDeliveryInfo().phoneNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Delivered date - </span>
                <span className="font-medium">{calculateDeliveryDate(selectedOrderDetails.date, selectedOrderDetails.washType)}</span>
              </div>
              <div>
                <span className="text-gray-600">Vehicle details - </span>
                <span className="font-medium">{getDeliveryInfo().vehicleDetails}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => setShowOrderDetailsModal(false)}
            className="flex-1 sm:flex-none"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setShowOrderDetailsModal(false);
              openPaymentModal(selectedOrderDetails);
            }}
            variant="success"
            className="flex-1 sm:flex-none"
          >
            Mark as paid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
