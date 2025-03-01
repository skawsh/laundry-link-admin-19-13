
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Calendar, Search, ChevronDown, ArrowDown, Download, Filter } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Payment data types
interface UnpaidOrder {
  id: string;
  studioId: number;
  studioName: string;
  date: string;
  amount: number;
  isPaid: boolean;
  washType: 'express' | 'standard';
  customerName: string;
}

interface PaymentRecord {
  id: string;
  studioId: number;
  studioName: string;
  orderId: string;
  amount: number;
  paymentDate: string;
  referenceNumber: string;
  washType: 'express' | 'standard';
}

// Sample data
const initialUnpaidOrders: UnpaidOrder[] = [
  { id: 'ORD-1001', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-10', amount: 450.00, isPaid: false, washType: 'standard', customerName: 'John Doe' },
  { id: 'ORD-1002', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-12', amount: 320.00, isPaid: false, washType: 'express', customerName: 'Jane Smith' },
  { id: 'ORD-1003', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-15', amount: 550.00, isPaid: false, washType: 'standard', customerName: 'Robert Johnson' },
  { id: 'ORD-1004', studioId: 3, studioName: 'Fresh Fold Services', date: '2023-06-16', amount: 400.00, isPaid: false, washType: 'express', customerName: 'Emily Wilson' },
  { id: 'ORD-1005', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-18', amount: 280.00, isPaid: false, washType: 'standard', customerName: 'Michael Brown' },
  { id: 'ORD-1006', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-20', amount: 380.00, isPaid: false, washType: 'standard', customerName: 'Sarah Davis' },
  { id: 'ORD-1007', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-22', amount: 290.00, isPaid: false, washType: 'express', customerName: 'Thomas Miller' },
];

const initialPaymentHistory: PaymentRecord[] = [
  { id: 'PMT-2001', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-1000', amount: 520.00, paymentDate: '2023-06-05', referenceNumber: 'UTR12345678', washType: 'standard' },
  { id: 'PMT-2002', studioId: 2, studioName: 'Sparkle Clean Laundry', orderId: 'ORD-995', amount: 420.00, paymentDate: '2023-06-04', referenceNumber: 'UTR87654321', washType: 'express' },
  { id: 'PMT-2003', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-990', amount: 350.00, paymentDate: '2023-06-02', referenceNumber: 'UTR23456789', washType: 'standard' },
  { id: 'PMT-2004', studioId: 3, studioName: 'Fresh Fold Services', orderId: 'ORD-985', amount: 600.00, paymentDate: '2023-05-30', referenceNumber: 'UTR98765432', washType: 'express' },
  { id: 'PMT-2005', studioId: 4, studioName: 'Royal Wash', orderId: 'ORD-980', amount: 480.00, paymentDate: '2023-05-28', referenceNumber: 'UTR34567890', washType: 'standard' },
  { id: 'PMT-2006', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-975', amount: 410.00, paymentDate: '2023-05-25', referenceNumber: 'UTR45678901', washType: 'express' },
];

const StudioPayments: React.FC = () => {
  const { studioId } = useParams<{ studioId?: string }>();
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>(initialUnpaidOrders);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(initialPaymentHistory);
  const [viewType, setViewType] = useState<'unpaid' | 'history'>('unpaid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UnpaidOrder | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [washTypeFilter, setWashTypeFilter] = useState<'all' | 'express' | 'standard'>('all');
  const { toast } = useToast();

  // Filter data based on studio ID if provided
  const filteredUnpaidOrders = studioId 
    ? unpaidOrders.filter(order => order.studioId === Number(studioId))
    : unpaidOrders;

  const filteredPaymentHistory = studioId 
    ? paymentHistory.filter(payment => payment.studioId === Number(studioId))
    : paymentHistory;

  // Further filter unpaid orders by wash type if selected
  const washTypeFilteredUnpaidOrders = washTypeFilter === 'all' 
    ? filteredUnpaidOrders 
    : filteredUnpaidOrders.filter(order => order.washType === washTypeFilter);

  // Calculate total unpaid amount per studio and wash type
  const studioWashTypeTotals = washTypeFilteredUnpaidOrders.reduce((acc, order) => {
    if (!acc[order.washType]) {
      acc[order.washType] = {
        washType: order.washType,
        totalAmount: 0,
        orders: []
      };
    }
    acc[order.washType].totalAmount += order.amount;
    acc[order.washType].orders.push(order);
    return acc;
  }, {} as Record<string, { washType: 'express' | 'standard'; totalAmount: number; orders: UnpaidOrder[] }>);

  // Calculate studio specific total if studio ID is provided
  const studioName = studioId && filteredUnpaidOrders.length > 0 
    ? filteredUnpaidOrders[0].studioName 
    : 'All Studios';
    
  const totalUnpaidAmount = washTypeFilteredUnpaidOrders.reduce((sum, order) => sum + order.amount, 0);

  // Mark order as paid
  const openPaymentModal = (order: UnpaidOrder) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedOrder || !paymentReference || !paymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Create new payment record
    const newPayment: PaymentRecord = {
      id: `PMT-${Math.floor(Math.random() * 10000)}`,
      studioId: selectedOrder.studioId,
      studioName: selectedOrder.studioName,
      orderId: selectedOrder.id,
      amount: selectedOrder.amount,
      paymentDate: paymentDate,
      referenceNumber: paymentReference,
      washType: selectedOrder.washType
    };

    // Update unpaid orders
    setUnpaidOrders(unpaidOrders.filter(order => order.id !== selectedOrder.id));
    
    // Add to payment history
    setPaymentHistory([newPayment, ...paymentHistory]);
    
    // Close modal and reset form
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setPaymentReference('');
    setPaymentDate('');

    // Show success toast
    toast({
      title: "Payment Recorded",
      description: `Payment of $${selectedOrder.amount.toFixed(2)} for order ${selectedOrder.id} has been marked as paid.`,
      duration: 3000,
    });
  };

  // Handle search for both tabs
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you'd implement filtering logic here
  };

  // Unpaid orders columns
  const unpaidColumns = [
    {
      header: 'Order ID',
      accessor: 'id' as keyof UnpaidOrder,
    },
    {
      header: 'Customer',
      accessor: 'customerName' as keyof UnpaidOrder,
    },
    {
      header: 'Order Date',
      accessor: (row: UnpaidOrder) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Wash Type',
      accessor: (row: UnpaidOrder) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.washType === 'express' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {row.washType === 'express' ? 'Express Wash' : 'Standard Wash'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: UnpaidOrder) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: 'Actions',
      accessor: (row: UnpaidOrder) => (
        <button
          onClick={() => openPaymentModal(row)}
          className="flex items-center px-3 py-1 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Mark as Paid</span>
        </button>
      ),
    }
  ];

  // Payment history columns
  const historyColumns = [
    {
      header: 'Payment ID',
      accessor: 'id' as keyof PaymentRecord,
    },
    {
      header: 'Order ID',
      accessor: 'orderId' as keyof PaymentRecord,
    },
    {
      header: 'Wash Type',
      accessor: (row: PaymentRecord) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.washType === 'express' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {row.washType === 'express' ? 'Express Wash' : 'Standard Wash'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: PaymentRecord) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: 'Payment Date',
      accessor: (row: PaymentRecord) => new Date(row.paymentDate).toLocaleDateString(),
    },
    {
      header: 'Reference No.',
      accessor: 'referenceNumber' as keyof PaymentRecord,
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title={studioId ? `${studioName} Payments` : "Laundry Studio Payments"} 
        subtitle={studioId ? `Manage payments for ${studioName}` : "Manage payments for all laundry studios"}
      >
        <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          <span>Export</span>
        </button>
      </PageHeader>
      
      {/* Payment summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Total Unpaid Amount</p>
          <p className="text-2xl font-semibold mt-1 text-red-600">
            ${totalUnpaidAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Unpaid Orders</p>
          <p className="text-2xl font-semibold mt-1">{washTypeFilteredUnpaidOrders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Express Wash Unpaid</p>
          <p className="text-2xl font-semibold mt-1 text-purple-600">
            ${washTypeFilteredUnpaidOrders
              .filter(order => order.washType === 'express')
              .reduce((sum, order) => sum + order.amount, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Standard Wash Unpaid</p>
          <p className="text-2xl font-semibold mt-1 text-blue-600">
            ${washTypeFilteredUnpaidOrders
              .filter(order => order.washType === 'standard')
              .reduce((sum, order) => sum + order.amount, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* View Type Tabs */}
      <Tabs defaultValue="unpaid" className="w-full" onValueChange={(value) => setViewType(value as 'unpaid' | 'history')}>
        <TabsList className="mb-6 bg-background border border-input">
          <TabsTrigger value="unpaid" className="flex-1">Unpaid Payments</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unpaid">
          {/* Filter options */}
          <div className="mb-5 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Filter by:</span>
              <div className="relative inline-block text-left mr-3">
                <Select
                  value={washTypeFilter}
                  onValueChange={(value) => setWashTypeFilter(value as 'all' | 'express' | 'standard')}
                >
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Wash Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Wash Types</SelectItem>
                      <SelectItem value="express">Express Wash</SelectItem>
                      <SelectItem value="standard">Standard Wash</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative inline-block text-left mr-3">
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white">
                  <span>Date Range</span>
                  <Calendar className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search unpaid orders..."
                className="block w-64 bg-white border border-gray-200 rounded-md py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* Wash Type Categories */}
          {Object.keys(studioWashTypeTotals).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Unpaid Totals by Wash Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(studioWashTypeTotals).map((category) => (
                  <div 
                    key={category.washType} 
                    className={`bg-white p-4 rounded-lg border ${
                      category.washType === 'express' ? 'border-purple-200' : 'border-blue-200'
                    } shadow-subtle`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {category.washType === 'express' ? 'Express Wash' : 'Standard Wash'} 
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{category.orders.length} unpaid orders</p>
                      </div>
                      <p className={`text-lg font-semibold ${
                        category.washType === 'express' ? 'text-purple-600' : 'text-blue-600'
                      }`}>
                        ${category.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Top 3 orders preview */}
                    <div className="space-y-2 mt-4">
                      {category.orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
                          <span className="text-gray-600">{order.id} - {order.customerName}</span>
                          <span className="font-medium">${order.amount.toFixed(2)}</span>
                        </div>
                      ))}
                      {category.orders.length > 3 && (
                        <div className="text-center pt-1">
                          <span className="text-xs text-gray-500">{category.orders.length - 3} more orders</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Unpaid orders table */}
          <h3 className="text-lg font-semibold mb-4">All Unpaid Orders</h3>
          <DataTable
            columns={unpaidColumns}
            data={washTypeFilteredUnpaidOrders}
            keyField="id"
            emptyMessage="No unpaid orders found"
          />
        </TabsContent>
        
        <TabsContent value="history">
          {/* Filter options */}
          <div className="mb-5 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Filter by:</span>
              <div className="relative inline-block text-left mr-3">
                <Select
                  value={washTypeFilter}
                  onValueChange={(value) => setWashTypeFilter(value as 'all' | 'express' | 'standard')}
                >
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Wash Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Wash Types</SelectItem>
                      <SelectItem value="express">Express Wash</SelectItem>
                      <SelectItem value="standard">Standard Wash</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative inline-block text-left mr-3">
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white">
                  <span>Date Range</span>
                  <Calendar className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search payment history..."
                className="block w-64 bg-white border border-gray-200 rounded-md py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* Payment history table */}
          <h3 className="text-lg font-semibold mb-4">Payment History</h3>
          <DataTable
            columns={historyColumns}
            data={filteredPaymentHistory.filter(payment => 
              washTypeFilter === 'all' || payment.washType === washTypeFilter
            )}
            keyField="id"
            emptyMessage="No payment history found"
          />
        </TabsContent>
      </Tabs>
      
      {/* Payment confirmation modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-elevated w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
            <p className="text-sm text-gray-500 mb-4">
              Recording payment for order <span className="font-medium">{selectedOrder.id}</span> from{' '}
              <span className="font-medium">{selectedOrder.studioName}</span>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-gray-700">
                ${selectedOrder.amount.toFixed(2)}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wash Type
              </label>
              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-gray-700">
                {selectedOrder.washType === 'express' ? 'Express Wash' : 'Standard Wash'}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Reference / UTR Number
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="block w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter reference number"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="block w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default StudioPayments;
