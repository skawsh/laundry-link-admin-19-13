
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, InfoIcon, ArrowLeft } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Import custom components
import PaymentStats from '@/components/payments/PaymentStats';
import PaymentModal from '@/components/payments/PaymentModal';
import OrderDetailsModal from '@/components/payments/OrderDetailsModal';
import PaymentTabs from '@/components/payments/PaymentTabs';

// Import types and data
import { UnpaidOrder, PaymentRecord, DateFilterOption } from '@/types/paymentTypes';
import { initialUnpaidOrders, initialPaymentHistory } from '@/data/mockPaymentData';
import { formatIndianRupees } from '@/utils/dateUtils';
import { applyDateFilter, applyOrderIdSearch, applyWashTypeFilter } from '@/utils/orderUtils';

const StudioPayments: React.FC = () => {
  const { studioId } = useParams<{ studioId?: string }>();
  const navigate = useNavigate();
  // Filter to only include orders with deliveredDate before setting initial state
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>(
    initialUnpaidOrders.filter(order => order.deliveredDate !== undefined)
  );
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(initialPaymentHistory);
  const [viewType, setViewType] = useState<'unpaid' | 'history'>('unpaid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UnpaidOrder | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<UnpaidOrder[]>([]);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [mainWashTypeTab, setMainWashTypeTab] = useState<'all' | 'express' | 'standard' | 'combined'>('all');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<UnpaidOrder | null>(null);
  const { toast } = useToast();
  
  // States for date filtering and search
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: '',
  });
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [showDateFilterPopover, setShowDateFilterPopover] = useState(false);

  const filteredUnpaidOrders = studioId 
    ? unpaidOrders.filter(order => order.studioId === Number(studioId))
    : unpaidOrders;

  const filteredPaymentHistory = studioId 
    ? paymentHistory.filter(payment => payment.studioId === Number(studioId))
    : paymentHistory;

  // Combined filtering function for unpaid orders
  const getFilteredUnpaidOrders = (): UnpaidOrder[] => {
    let data = filteredUnpaidOrders;
    data = applyDateFilter(data, dateFilter, customDateRange);
    data = applyOrderIdSearch(data, orderIdSearch);
    data = applyWashTypeFilter(data, mainWashTypeTab);
    return data;
  };

  // Combined filtering function for payment history
  const getFilteredPaymentHistory = (): PaymentRecord[] => {
    let data = filteredPaymentHistory;
    data = applyDateFilter(data, dateFilter, customDateRange);
    data = applyOrderIdSearch(data, orderIdSearch);
    data = applyWashTypeFilter(data, mainWashTypeTab);
    return data;
  };

  const filteredData = viewType === 'unpaid' 
    ? getFilteredUnpaidOrders() 
    : getFilteredPaymentHistory();

  const studioName = studioId && filteredUnpaidOrders.length > 0 
    ? filteredUnpaidOrders[0].studioName 
    : 'All Studios';

  const handleGoBack = () => {
    navigate(-1);
  };

  const openPaymentModal = (order: UnpaidOrder) => {
    setSelectedOrder(order);
    setSelectedOrders([order]);
    setShowPaymentModal(true);
  };

  const openBulkPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const openOrderDetailsModal = (order: UnpaidOrder) => {
    setSelectedOrderDetails(order);
    setShowOrderDetailsModal(true);
  };

  const confirmPayment = () => {
    if (selectedOrders.length === 0 || !paymentReference || !paymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Create payment records for all selected orders
    const newPayments: PaymentRecord[] = selectedOrders.map(order => ({
      id: `PMT-${Math.floor(Math.random() * 10000)}`,
      studioId: order.studioId,
      studioName: order.studioName,
      orderId: order.id,
      amount: order.amount,
      paymentDate: paymentDate,
      referenceNumber: paymentReference,
      washType: order.washType,
      deliveredDate: order.deliveredDate
    }));

    // Remove all selected orders from unpaid orders
    const selectedOrderIds = selectedOrders.map(order => order.id);
    setUnpaidOrders(unpaidOrders.filter(order => !selectedOrderIds.includes(order.id)));
    
    // Add all new payment records to payment history
    setPaymentHistory([...newPayments, ...paymentHistory]);
    
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setSelectedOrders([]);
    setPaymentReference('');
    setPaymentDate('');

    const totalAmount = selectedOrders.reduce((sum, order) => sum + order.amount, 0);
    toast({
      title: "Payment Recorded",
      description: `Payment of ${formatIndianRupees(totalAmount)} for ${selectedOrders.length} order(s) has been marked as paid.`,
      duration: 3000,
    });
  };

  const resetDateFilter = () => {
    setDateFilter('all');
    setCustomDateRange({ start: '', end: '' });
  };

  const toggleSelectAllOrders = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedOrders(getFilteredUnpaidOrders());
    } else {
      setSelectedOrders([]);
    }
  };

  // Define table columns with an S.No column
  const unpaidColumns = [
    {
      header: 'S.No',
      accessor: (_: any, index: number) => index + 1,
      width: '60px'
    },
    {
      header: 'Order ID',
      accessor: 'id' as keyof UnpaidOrder,
    },
    {
      header: 'Customer',
      accessor: 'customerName' as keyof UnpaidOrder,
    },
    {
      header: 'Ordered Date',
      accessor: (row: UnpaidOrder) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Wash Type',
      accessor: (row: UnpaidOrder) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.washType === 'express' ? 'bg-purple-100 text-purple-800' : 
          row.washType === 'standard' ? 'bg-blue-100 text-blue-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {row.washType === 'express' ? 'Express Wash' : 
           row.washType === 'standard' ? 'Standard Wash' : 
           'Both'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: UnpaidOrder) => formatIndianRupees(row.amount),
    },
    {
      header: 'Delivered Date',
      accessor: (row: UnpaidOrder) => row.deliveredDate ? new Date(row.deliveredDate).toLocaleDateString() : "—",
    },
    {
      header: 'Actions',
      accessor: (row: UnpaidOrder) => (
        <div className="flex gap-2">
          <Button
            onClick={() => openOrderDetailsModal(row)}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <InfoIcon className="h-4 w-4 mr-1" />
            <span>Order Details</span>
          </Button>
          <Button
            onClick={() => openPaymentModal(row)}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Mark as Paid</span>
          </Button>
        </div>
      ),
    }
  ];

  const historyColumns = [
    {
      header: 'S.No',
      accessor: (_: any, index: number) => index + 1,
      width: '60px'
    },
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
          row.washType === 'express' ? 'bg-purple-100 text-purple-800' : 
          row.washType === 'standard' ? 'bg-blue-100 text-blue-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {row.washType === 'express' ? 'Express Wash' : 
           row.washType === 'standard' ? 'Standard Wash' : 
           'Both'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: PaymentRecord) => formatIndianRupees(row.amount),
    },
    {
      header: 'Payment Date',
      accessor: (row: PaymentRecord) => new Date(row.paymentDate).toLocaleDateString(),
    },
    {
      header: 'Delivered Date',
      accessor: (row: PaymentRecord) => row.deliveredDate ? new Date(row.deliveredDate).toLocaleDateString() : "—",
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
        backButton={
          <Button
            variant="back"
            onClick={handleGoBack}
            size="icon"
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      >
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </button>
        </div>
      </PageHeader>
      
      <PaymentStats filteredUnpaidOrders={filteredUnpaidOrders} />
      
      <PaymentTabs 
        viewType={viewType}
        setViewType={setViewType}
        unpaidColumns={unpaidColumns}
        historyColumns={historyColumns}
        filteredData={filteredData}
        mainWashTypeTab={mainWashTypeTab}
        setMainWashTypeTab={setMainWashTypeTab}
        orderIdSearch={orderIdSearch}
        setOrderIdSearch={setOrderIdSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
        showDateFilterPopover={showDateFilterPopover}
        setShowDateFilterPopover={setShowDateFilterPopover}
        resetDateFilter={resetDateFilter}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
        toggleSelectAllOrders={toggleSelectAllOrders}
        openBulkPaymentModal={openBulkPaymentModal}
      />
      
      <PaymentModal 
        selectedOrders={selectedOrders}
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        paymentReference={paymentReference}
        setPaymentReference={setPaymentReference}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        confirmPayment={confirmPayment}
      />
      
      <OrderDetailsModal 
        selectedOrderDetails={selectedOrderDetails}
        showOrderDetailsModal={showOrderDetailsModal}
        setShowOrderDetailsModal={setShowOrderDetailsModal}
        openPaymentModal={openPaymentModal}
      />
    </AdminLayout>
  );
};

export default StudioPayments;
