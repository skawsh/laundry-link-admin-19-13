
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, InfoIcon, ArrowLeft } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import PaymentStats from '@/components/payments/PaymentStats';
import PaymentModal from '@/components/payments/PaymentModal';
import OrderDetailsModal from '@/components/payments/OrderDetailsModal';
import PaymentTabs from '@/components/payments/PaymentTabs';

import { UnpaidOrder, PaymentRecord, DateFilterOption } from '@/types/paymentTypes';
import { initialUnpaidOrders, initialPaymentHistory } from '@/data/mockPaymentData';
import { formatIndianRupees } from '@/utils/dateUtils';
import { applyDateFilter, applyOrderIdSearch, applyWashTypeFilter } from '@/utils/orderUtils';

const calculateDeliveryDate = (orderDate: string, washType: 'express' | 'standard' | 'combined'): string => {
  const date = new Date(orderDate);
  
  if (washType === 'express') {
    date.setDate(date.getDate() + 1);
  } else {
    date.setDate(date.getDate() + 4);
  }
  
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const StudioPayments: React.FC = () => {
  const { studioId } = useParams<{ studioId?: string }>();
  const navigate = useNavigate();

  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>(
    initialUnpaidOrders.filter(order => order.deliveredDate !== undefined)
  );
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(initialPaymentHistory);
  const [viewType, setViewType] = useState<'unpaid' | 'history'>('unpaid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UnpaidOrder | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [mainWashTypeTab, setMainWashTypeTab] = useState<'all' | 'express' | 'standard' | 'combined'>('all');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<UnpaidOrder | null>(null);
  const { toast } = useToast();

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

  const getFilteredUnpaidOrders = (): UnpaidOrder[] => {
    let data = filteredUnpaidOrders;
    data = applyDateFilter(data, dateFilter, customDateRange);
    data = applyOrderIdSearch(data, orderIdSearch);
    data = applyWashTypeFilter(data, mainWashTypeTab);
    return data;
  };

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
    setSelectedOrderIds([order.id]);
    setShowPaymentModal(true);
  };

  const openBulkPaymentModal = () => {
    setSelectedOrder(null);
    setShowPaymentModal(true);
  };

  const openOrderDetailsModal = (order: UnpaidOrder) => {
    setSelectedOrderDetails(order);
    setShowOrderDetailsModal(true);
  };

  const confirmPayment = () => {
    if (!paymentReference || !paymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    let ordersToPay: UnpaidOrder[] = [];
    
    if (selectedOrderIds.length > 0) {
      ordersToPay = getFilteredUnpaidOrders().filter(order => 
        selectedOrderIds.includes(order.id)
      );
    } else if (selectedOrder) {
      ordersToPay = [selectedOrder];
    } else {
      toast({
        title: "Error",
        description: "No orders selected for payment",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (ordersToPay.length === 0) {
      toast({
        title: "Error",
        description: "No orders to mark as paid",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newPayments: PaymentRecord[] = ordersToPay.map(order => ({
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

    const paidOrderIds = ordersToPay.map(order => order.id);
    setUnpaidOrders(unpaidOrders.filter(order => !paidOrderIds.includes(order.id)));
    
    setPaymentHistory([...newPayments, ...paymentHistory]);
    
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setSelectedOrderIds([]);
    setPaymentReference('');
    setPaymentDate('');

    const totalAmount = ordersToPay.reduce((sum, order) => sum + order.amount, 0);
    toast({
      title: "Payment Recorded",
      description: `Payment of ${formatIndianRupees(totalAmount)} for ${ordersToPay.length} order(s) has been marked as paid.`,
      duration: 3000,
    });
  };

  const resetDateFilter = () => {
    setDateFilter('all');
    setCustomDateRange({ start: '', end: '' });
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

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
      accessor: (row: UnpaidOrder) => {
        const date = new Date(row.date);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      },
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
      accessor: (row: UnpaidOrder) => calculateDeliveryDate(row.date, row.washType),
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
      accessor: (row: PaymentRecord) => {
        const date = new Date(row.paymentDate);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      },
    },
    {
      header: 'Delivered Date',
      accessor: (row: PaymentRecord) => {
        if (row.deliveredDate) {
          const date = new Date(row.deliveredDate);
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        } else {
          const orderDate = new Date(row.paymentDate);
          orderDate.setDate(orderDate.getDate() - (row.washType === 'express' ? 1 : 4));
          return calculateDeliveryDate(orderDate.toISOString(), row.washType);
        }
      },
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
        openBulkPaymentModal={openBulkPaymentModal}
      />
      
      <PaymentModal 
        selectedOrders={
          selectedOrderIds.length > 0 
            ? getFilteredUnpaidOrders().filter(order => selectedOrderIds.includes(order.id))
            : selectedOrder ? [selectedOrder] : []
        }
        showPaymentModal={showPaymentModal}
        setShowPaymentModal={setShowPaymentModal}
        paymentReference={paymentReference}
        setPaymentReference={setPaymentReference}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        confirmPayment={confirmPayment}
        toggleOrderSelection={toggleOrderSelection}
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
