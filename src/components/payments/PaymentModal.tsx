
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnpaidOrder } from '@/types/paymentTypes';
import { formatIndianRupees } from '@/utils/dateUtils';
import { toast } from "@/hooks/use-toast";

interface PaymentModalProps {
  selectedOrders: UnpaidOrder[];
  showPaymentModal: boolean;
  setShowPaymentModal: (value: boolean) => void;
  paymentReference: string;
  setPaymentReference: (value: string) => void;
  paymentDate: string;
  setPaymentDate: (value: string) => void;
  confirmPayment: () => void;
  toggleOrderSelection?: (orderId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  selectedOrders,
  showPaymentModal,
  setShowPaymentModal,
  paymentReference,
  setPaymentReference,
  paymentDate,
  setPaymentDate,
  confirmPayment,
  toggleOrderSelection
}) => {
  // Set current date when modal opens
  useEffect(() => {
    if (showPaymentModal && !paymentDate) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setPaymentDate(formattedDate);
    }
  }, [showPaymentModal, paymentDate, setPaymentDate]);

  // Calculate total amount from selected orders
  const totalAmount = selectedOrders.reduce((sum, order) => sum + order.amount, 0);

  const handleConfirmPayment = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Error",
        description: "No orders selected for payment",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!paymentReference || !paymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    confirmPayment();
  };

  // Determine modal title based on selection
  const getModalTitle = () => {
    if (selectedOrders.length === 0) {
      return "Record Payment";
    } else if (selectedOrders.length === 1) {
      return "Record Payment";
    } else {
      return "Record Bulk Payment";
    }
  };

  // Determine modal description based on selection
  const getModalDescription = () => {
    if (selectedOrders.length === 0) {
      return "No orders selected for payment";
    } else if (selectedOrders.length === 1) {
      return `Enter payment details for order ${selectedOrders[0]?.id}`;
    } else {
      return `Enter payment details for ${selectedOrders.length} orders`;
    }
  };

  return (
    <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4">
          <div className="space-y-4">
            {selectedOrders.length === 1 ? (
              // Single order view
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Order ID
                </label>
                <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded-md">
                  {selectedOrders[0]?.id}
                </div>
              </div>
            ) : selectedOrders.length > 1 ? (
              // Multiple orders view
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Selected Orders
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {toggleOrderSelection && (
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Select</th>
                        )}
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Order ID</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrders.map(order => (
                        <tr key={order.id}>
                          {toggleOrderSelection && (
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={() => toggleOrderSelection(order.id)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </td>
                          )}
                          <td className="px-3 py-2 text-sm text-gray-700">{order.id}</td>
                          <td className="px-3 py-2 text-sm text-gray-700 text-right">
                            {formatIndianRupees(order.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Total Amount
              </label>
              <div className="text-sm font-semibold text-gray-800 bg-gray-50 p-2 rounded-md">
                {formatIndianRupees(totalAmount)}
              </div>
            </div>
            
            <div>
              <label htmlFor="payment-date" className="text-sm font-medium text-gray-700 block mb-1">
                Payment Date
              </label>
              <Input
                type="date"
                id="payment-date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="payment-reference" className="text-sm font-medium text-gray-700 block mb-1">
                Payment Reference / UTR
              </label>
              <Input
                type="text"
                id="payment-reference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="w-full"
                placeholder="Enter payment reference or UTR number"
                required
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-6 pt-0">
          <Button
            variant="outline"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            variant="success"
            className="ml-2"
            disabled={selectedOrders.length === 0 || !paymentReference || !paymentDate}
          >
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
