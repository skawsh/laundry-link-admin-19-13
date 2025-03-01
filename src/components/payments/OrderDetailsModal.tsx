
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnpaidOrder } from '@/types/paymentTypes';
import { formatIndianRupees } from '@/utils/dateUtils';
import { getServiceDetails } from '@/utils/orderUtils';

interface OrderDetailsModalProps {
  selectedOrderDetails: UnpaidOrder | null;
  showOrderDetailsModal: boolean;
  setShowOrderDetailsModal: (value: boolean) => void;
  openPaymentModal: (order: UnpaidOrder) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  selectedOrderDetails,
  showOrderDetailsModal,
  setShowOrderDetailsModal,
  openPaymentModal,
}) => {
  // Get delivery time based on wash type
  const getDeliveryTimeText = (washType: 'express' | 'standard' | 'combined') => {
    if (washType === 'express') return '(1 day delivery)';
    return '(4 days delivery)';
  };

  return (
    <Dialog open={showOrderDetailsModal} onOpenChange={setShowOrderDetailsModal}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Details for order {selectedOrderDetails?.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
              <p className="text-sm font-semibold">{selectedOrderDetails?.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-sm font-semibold">
                {selectedOrderDetails?.date ? new Date(selectedOrderDetails.date).toLocaleDateString() : ''}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer</h3>
              <p className="text-sm font-semibold">{selectedOrderDetails?.customerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Service Type</h3>
              <p className="text-sm font-semibold">
                {selectedOrderDetails?.washType === 'express' ? 'Express Wash ' + getDeliveryTimeText('express') : 
                 selectedOrderDetails?.washType === 'standard' ? 'Standard Wash ' + getDeliveryTimeText('standard') : 
                 'Both ' + getDeliveryTimeText('combined')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="text-sm font-semibold text-amber-600">Pending Payment</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="text-sm font-semibold">
                {selectedOrderDetails ? formatIndianRupees(selectedOrderDetails.amount) : ''}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Service Details</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {selectedOrderDetails && getServiceDetails(selectedOrderDetails.washType).map((service, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {service.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-right">
                        {formatIndianRupees(service.price)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-700">
                      Total
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-700 text-right">
                      {selectedOrderDetails ? formatIndianRupees(selectedOrderDetails.amount) : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowOrderDetailsModal(false)}>
            Close
          </Button>
          {selectedOrderDetails && (
            <Button
              onClick={() => {
                setShowOrderDetailsModal(false);
                openPaymentModal(selectedOrderDetails);
              }}
              variant="success"
            >
              Mark as Paid
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
