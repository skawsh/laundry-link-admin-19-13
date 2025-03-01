
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, InfoIcon, ArrowLeft, Phone, MapPin, Calendar, Package, Search, Filter, X } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatsCard from '../components/ui/StatsCard';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
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
  washType: 'express' | 'standard' | 'combined';
  customerName: string;
  deliveredDate?: string;
}

interface PaymentRecord {
  id: string;
  studioId: number;
  studioName: string;
  orderId: string;
  amount: number;
  paymentDate: string;
  referenceNumber: string;
  washType: 'express' | 'standard' | 'combined';
  deliveredDate?: string;
}

// Sample data with combined wash type added and amount below 1000
const initialUnpaidOrders: UnpaidOrder[] = [
  { id: 'ORD-1001', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-10', amount: 450, isPaid: false, washType: 'standard', customerName: 'John Doe' },
  { id: 'ORD-1002', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-12', amount: 320, isPaid: false, washType: 'express', customerName: 'Jane Smith' },
  { id: 'ORD-1003', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-15', amount: 550, isPaid: false, washType: 'standard', customerName: 'Robert Johnson' },
  { id: 'ORD-1004', studioId: 3, studioName: 'Fresh Fold Services', date: '2023-06-16', amount: 400, isPaid: false, washType: 'express', customerName: 'Emily Wilson' },
  { id: 'ORD-1005', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-18', amount: 280, isPaid: false, washType: 'standard', customerName: 'Michael Brown' },
  { id: 'ORD-1006', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-20', amount: 380, isPaid: false, washType: 'standard', customerName: 'Sarah Davis' },
  { id: 'ORD-1007', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-22', amount: 290, isPaid: false, washType: 'express', customerName: 'Thomas Miller' },
  { id: 'ORD-1008', studioId: 3, studioName: 'Fresh Fold Services', date: '2023-06-25', amount: 650, isPaid: false, washType: 'combined', customerName: 'Laura Wilson', deliveredDate: '2023-06-28' },
  { id: 'ORD-1009', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-26', amount: 520, isPaid: false, washType: 'combined', customerName: 'Alex Johnson', deliveredDate: '2023-06-29' },
  { id: 'ORD-1010', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-28', amount: 470, isPaid: false, washType: 'combined', customerName: 'Maya Patel', deliveredDate: '2023-07-01' },
  // Add today, yesterday, this week and this month orders
  { id: 'ORD-2001', studioId: 1, studioName: 'Saiteja Laundry', date: new Date().toISOString().split('T')[0], amount: 540, isPaid: false, washType: 'express', customerName: 'Today Order 1' },
  { id: 'ORD-2002', studioId: 1, studioName: 'Saiteja Laundry', date: new Date().toISOString().split('T')[0], amount: 320, isPaid: false, washType: 'standard', customerName: 'Today Order 2' },
  { id: 'ORD-2003', studioId: 1, studioName: 'Saiteja Laundry', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 410, isPaid: false, washType: 'combined', customerName: 'Yesterday Order 1', deliveredDate: new Date(Date.now() - 86400000 + 3600000).toISOString().split('T')[0] },
  { id: 'ORD-2004', studioId: 1, studioName: 'Saiteja Laundry', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 380, isPaid: false, washType: 'express', customerName: 'Yesterday Order 2', deliveredDate: new Date(Date.now() - 86400000 + 7200000).toISOString().split('T')[0] },
  { id: 'ORD-2005', studioId: 1, studioName: 'Saiteja Laundry', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], amount: 430, isPaid: false, washType: 'standard', customerName: 'This Week Order 1' },
  { id: 'ORD-2006', studioId: 1, studioName: 'Saiteja Laundry', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], amount: 390, isPaid: false, washType: 'combined', customerName: 'This Week Order 2' },
  { id: 'ORD-2007', studioId: 1, studioName: 'Saiteja Laundry', date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0], amount: 520, isPaid: false, washType: 'express', customerName: 'This Month Order 1', deliveredDate: new Date(Date.now() - 86400000 * 13).toISOString().split('T')[0] },
  { id: 'ORD-2008', studioId: 1, studioName: 'Saiteja Laundry', date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0], amount: 480, isPaid: false, washType: 'standard', customerName: 'This Month Order 2', deliveredDate: new Date(Date.now() - 86400000 * 17).toISOString().split('T')[0] },
];

const initialPaymentHistory: PaymentRecord[] = [
  { id: 'PMT-2001', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-1000', amount: 520, paymentDate: '2023-06-05', referenceNumber: 'UTR12345678', washType: 'standard', deliveredDate: '2023-06-07' },
  { id: 'PMT-2002', studioId: 2, studioName: 'Sparkle Clean Laundry', orderId: 'ORD-995', amount: 420, paymentDate: '2023-06-04', referenceNumber: 'UTR87654321', washType: 'express', deliveredDate: '2023-06-06' },
  { id: 'PMT-2003', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-990', amount: 350, paymentDate: '2023-06-02', referenceNumber: 'UTR23456789', washType: 'standard', deliveredDate: '2023-06-05' },
  { id: 'PMT-2004', studioId: 3, studioName: 'Fresh Fold Services', orderId: 'ORD-985', amount: 600, paymentDate: '2023-05-30', referenceNumber: 'UTR98765432', washType: 'express', deliveredDate: '2023-06-01' },
  { id: 'PMT-2005', studioId: 4, studioName: 'Royal Wash', orderId: 'ORD-980', amount: 480, paymentDate: '2023-05-28', referenceNumber: 'UTR34567890', washType: 'standard', deliveredDate: '2023-05-31' },
  { id: 'PMT-2006', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-975', amount: 410, paymentDate: '2023-05-25', referenceNumber: 'UTR45678901', washType: 'express', deliveredDate: '2023-05-27' },
  { id: 'PMT-2007', studioId: 3, studioName: 'Fresh Fold Services', orderId: 'ORD-970', amount: 580, paymentDate: '2023-05-22', referenceNumber: 'UTR56789012', washType: 'combined', deliveredDate: '2023-05-25' },
  { id: 'PMT-2008', studioId: 2, studioName: 'Sparkle Clean Laundry', orderId: 'ORD-965', amount: 490, paymentDate: '2023-05-20', referenceNumber: 'UTR67890123', washType: 'combined', deliveredDate: '2023-05-23' },
  // Add today, yesterday, this week and this month payment records
  { id: 'PMT-3001', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3001', amount: 550, paymentDate: new Date().toISOString().split('T')[0], referenceNumber: 'UTR11223344', washType: 'express', deliveredDate: new Date().toISOString().split('T')[0] },
  { id: 'PMT-3002', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3002', amount: 470, paymentDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], referenceNumber: 'UTR22334455', washType: 'standard', deliveredDate: new Date(Date.now() - 86400000 + 3600000).toISOString().split('T')[0] },
  { id: 'PMT-3003', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3003', amount: 510, paymentDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], referenceNumber: 'UTR33445566', washType: 'combined', deliveredDate: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString().split('T')[0] },
  { id: 'PMT-3004', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3004', amount: 490, paymentDate: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0], referenceNumber: 'UTR44556677', washType: 'express', deliveredDate: new Date(Date.now() - 86400000 * 15 + 3600000).toISOString().split('T')[0] },
];

// Date filtering options type
type DateFilterOption = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

const StudioPayments: React.FC = () => {
  const { studioId } = useParams<{ studioId?: string }>();
  const navigate = useNavigate();
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>(initialUnpaidOrders);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(initialPaymentHistory);
  const [viewType, setViewType] = useState<'unpaid' | 'history'>('unpaid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UnpaidOrder | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [mainWashTypeTab, setMainWashTypeTab] = useState<'all' | 'express' | 'standard' | 'combined'>('all');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<UnpaidOrder | null>(null);
  const { toast } = useToast();
  
  // New state for date filtering and search
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

  // Apply date filter to data
  const applyDateFilter = <T extends UnpaidOrder | PaymentRecord>(orders: T[]): T[] => {
    if (dateFilter === 'all') return orders;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000; // 24 hours in milliseconds
    
    // Get start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeekTime = startOfWeek.getTime();
    
    // Get start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    return orders.filter(order => {
      const dateField = 'paymentDate' in order ? order.paymentDate : order.date;
      const orderDate = new Date(dateField);
      const orderDateTime = orderDate.getTime();
      
      switch (dateFilter) {
        case 'today':
          return orderDateTime >= today;
        case 'yesterday':
          return orderDateTime >= yesterday && orderDateTime < today;
        case 'this_week':
          return orderDateTime >= startOfWeekTime;
        case 'this_month':
          return orderDateTime >= startOfMonth;
        case 'custom':
          if (!customDateRange.start && !customDateRange.end) return true;
          
          let passesFilter = true;
          if (customDateRange.start) {
            passesFilter = passesFilter && orderDateTime >= new Date(customDateRange.start).getTime();
          }
          if (customDateRange.end) {
            // Include the entire end date (until midnight)
            const endDate = new Date(customDateRange.end);
            endDate.setHours(23, 59, 59, 999);
            passesFilter = passesFilter && orderDateTime <= endDate.getTime();
          }
          return passesFilter;
        default:
          return true;
      }
    });
  };

  // Apply order ID search to data
  const applyOrderIdSearch = <T extends UnpaidOrder | PaymentRecord>(orders: T[]): T[] => {
    if (!orderIdSearch) return orders;
    
    return orders.filter(order => {
      const orderId = 'orderId' in order ? order.orderId : order.id;
      return orderId.toLowerCase().includes(orderIdSearch.toLowerCase());
    });
  };

  // Apply wash type filter to data
  const applyWashTypeFilter = <T extends UnpaidOrder | PaymentRecord>(orders: T[]): T[] => {
    // If on tab other than 'all', the tab itself acts as filter
    if (mainWashTypeTab !== 'all') {
      return orders.filter(order => order.washType === mainWashTypeTab);
    }
    
    return orders;
  };

  // Combined filtering function for unpaid orders
  const getFilteredUnpaidOrders = (): UnpaidOrder[] => {
    let data = filteredUnpaidOrders;
    data = applyDateFilter(data);
    data = applyOrderIdSearch(data);
    data = applyWashTypeFilter(data);
    return data;
  };

  // Combined filtering function for payment history
  const getFilteredPaymentHistory = (): PaymentRecord[] => {
    let data = filteredPaymentHistory;
    data = applyDateFilter(data);
    data = applyOrderIdSearch(data);
    data = applyWashTypeFilter(data);
    return data;
  };

  const filteredData = viewType === 'unpaid' 
    ? getFilteredUnpaidOrders() 
    : getFilteredPaymentHistory();

  const studioName = studioId && filteredUnpaidOrders.length > 0 
    ? filteredUnpaidOrders[0].studioName 
    : 'All Studios';

  // Statistics calculations based on filtered data
  const expressWashOrders = filteredUnpaidOrders.filter(order => order.washType === 'express');
  const standardWashOrders = filteredUnpaidOrders.filter(order => order.washType === 'standard');
  const combinedWashOrders = filteredUnpaidOrders.filter(order => order.washType === 'combined');
  
  const expressWashCount = expressWashOrders.length;
  const standardWashCount = standardWashOrders.length;
  const combinedWashCount = combinedWashOrders.length;
  
  const totalUnpaidCount = expressWashCount + standardWashCount + combinedWashCount;

  const expressWashAmount = expressWashOrders.reduce((sum, order) => sum + order.amount, 0);
  const standardWashAmount = standardWashOrders.reduce((sum, order) => sum + order.amount, 0);
  const combinedWashAmount = combinedWashOrders.reduce((sum, order) => sum + order.amount, 0);
  
  const totalUnpaidAmount = expressWashAmount + standardWashAmount + combinedWashAmount;

  const handleGoBack = () => {
    navigate(-1);
  };

  const openPaymentModal = (order: UnpaidOrder) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const openOrderDetailsModal = (order: UnpaidOrder) => {
    setSelectedOrderDetails(order);
    setShowOrderDetailsModal(true);
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

    const newPayment: PaymentRecord = {
      id: `PMT-${Math.floor(Math.random() * 10000)}`,
      studioId: selectedOrder.studioId,
      studioName: selectedOrder.studioName,
      orderId: selectedOrder.id,
      amount: selectedOrder.amount,
      paymentDate: paymentDate,
      referenceNumber: paymentReference,
      washType: selectedOrder.washType,
      deliveredDate: selectedOrder.deliveredDate
    };

    setUnpaidOrders(unpaidOrders.filter(order => order.id !== selectedOrder.id));
    
    setPaymentHistory([newPayment, ...paymentHistory]);
    
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setPaymentReference('');
    setPaymentDate('');

    toast({
      title: "Payment Recorded",
      description: `Payment of ₹${(selectedOrder.amount).toLocaleString('en-IN')} for order ${selectedOrder.id} has been marked as paid.`,
      duration: 3000,
    });
  };

  const formatIndianRupees = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const resetDateFilter = () => {
    setDateFilter('all');
    setCustomDateRange({ start: '', end: '' });
  };

  const getServiceDetails = (washType: 'express' | 'standard' | 'combined') => {
    const baseServices = [
      { name: "Washing", price: 100 },
      { name: "Drying", price: 80 },
      { name: "Folding", price: 50 }
    ];
    
    if (washType === 'express') {
      return [
        ...baseServices,
        { name: "Express Processing", price: 120 },
        { name: "Priority Handling", price: 70 }
      ];
    } else if (washType === 'standard') {
      return [
        ...baseServices,
        { name: "Stain Treatment", price: 90 },
        { name: "Fabric Care", price: 60 }
      ];
    } else {
      return [
        ...baseServices,
        { name: "Express Processing", price: 120 },
        { name: "Stain Treatment", price: 90 },
        { name: "Premium Packaging", price: 60 }
      ];
    }
  };

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
           'Combined Wash'}
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
           'Combined Wash'}
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Total Unpaid Amount"
          value={formatIndianRupees(totalUnpaidAmount)}
          subtext={`${totalUnpaidCount} orders pending`}
        />
        <StatsCard
          title="Express Wash Unpaid Amount"
          value={formatIndianRupees(expressWashAmount)}
          subtext={`${expressWashCount} orders pending`}
        />
        <StatsCard
          title="Standard Wash Unpaid Amount"
          value={formatIndianRupees(standardWashAmount)}
          subtext={`${standardWashCount} orders pending`}
        />
        <StatsCard
          title="Combined Wash Unpaid Amount"
          value={formatIndianRupees(combinedWashAmount)}
          subtext={`${combinedWashCount} orders pending`}
        />
      </div>
      
      <Tabs defaultValue="unpaid" className="w-full" onValueChange={(value) => setViewType(value as 'unpaid' | 'history')}>
        <TabsList className="mb-6 bg-background border border-input">
          <TabsTrigger value="unpaid" className="flex-1">Unpaid Payments</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unpaid">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <Tabs 
                defaultValue="all" 
                className="w-full" 
                onValueChange={(value) => setMainWashTypeTab(value as 'all' | 'express' | 'standard' | 'combined')}
              >
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="bg-background border border-input">
                    <TabsTrigger value="all">All Wash Types</TabsTrigger>
                    <TabsTrigger value="express">Express Wash</TabsTrigger>
                    <TabsTrigger value="standard">Standard Wash</TabsTrigger>
                    <TabsTrigger value="combined">Combined Wash</TabsTrigger>
                  </TabsList>
                  
                  {/* Search Bar - Right aligned */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search by Order ID..."
                      value={orderIdSearch}
                      onChange={(e) => setOrderIdSearch(e.target.value)}
                      className="pl-10 pr-10 py-2 w-full sm:w-60"
                    />
                    {orderIdSearch && (
                      <button
                        onClick={() => setOrderIdSearch('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters Row - Below the tabs */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {/* Date Filter */}
                  <Popover open={showDateFilterPopover} onOpenChange={setShowDateFilterPopover}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {dateFilter === 'all' ? 'All Dates' :
                          dateFilter === 'today' ? 'Today' :
                          dateFilter === 'yesterday' ? 'Yesterday' :
                          dateFilter === 'this_week' ? 'This Week' :
                          dateFilter === 'this_month' ? 'This Month' :
                          'Custom Date Range'}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Filter by Date</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="all-dates"
                              name="date-filter"
                              checked={dateFilter === 'all'}
                              onChange={() => setDateFilter('all')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="all-dates" className="text-sm">All Dates</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="today"
                              name="date-filter"
                              checked={dateFilter === 'today'}
                              onChange={() => setDateFilter('today')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="today" className="text-sm">Today</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="yesterday"
                              name="date-filter"
                              checked={dateFilter === 'yesterday'}
                              onChange={() => setDateFilter('yesterday')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="yesterday" className="text-sm">Yesterday</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="this-week"
                              name="date-filter"
                              checked={dateFilter === 'this_week'}
                              onChange={() => setDateFilter('this_week')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="this-week" className="text-sm">This Week</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="this-month"
                              name="date-filter"
                              checked={dateFilter === 'this_month'}
                              onChange={() => setDateFilter('this_month')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="this-month" className="text-sm">This Month</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="custom-range"
                              name="date-filter"
                              checked={dateFilter === 'custom'}
                              onChange={() => setDateFilter('custom')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="custom-range" className="text-sm">Custom Range</label>
                          </div>
                        </div>
                        
                        {dateFilter === 'custom' && (
                          <div className="space-y-2 pt-2 border-t border-gray-100">
                            <div className="space-y-1">
                              <label htmlFor="start-date" className="text-xs font-medium">Start Date</label>
                              <Input
                                id="start-date"
                                type="date"
                                value={customDateRange.start}
                                onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                                className="h-9"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label htmlFor="end-date" className="text-xs font-medium">End Date</label>
                              <Input
                                id="end-date"
                                type="date"
                                value={customDateRange.end}
                                onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                                className="h-9"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={resetDateFilter}
                          >
                            Reset
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => setShowDateFilterPopover(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Active Filters Display - Only for date filter */}
                  {dateFilter !== 'all' && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Active Filters:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                        {dateFilter === 'today' ? 'Today' :
                        dateFilter === 'yesterday' ? 'Yesterday' :
                        dateFilter === 'this_week' ? 'This Week' :
                        dateFilter === 'this_month' ? 'This Month' :
                        'Custom Date Range'}
                        <button
                          onClick={resetDateFilter}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    </div>
                  )}
                </div>
                
                <TabsContent value="all">
                  <DataTable
                    columns={unpaidColumns}
                    data={getFilteredUnpaidOrders()}
                    keyField="id"
                    emptyMessage="No unpaid orders found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
                
                <TabsContent value="express">
                  <DataTable
                    columns={unpaidColumns}
                    data={applyDateFilter(applyOrderIdSearch(filteredUnpaidOrders.filter(order => order.washType === 'express')))}
                    keyField="id"
                    emptyMessage="No unpaid express wash orders found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
                
                <TabsContent value="standard">
                  <DataTable
                    columns={unpaidColumns}
                    data={applyDateFilter(applyOrderIdSearch(filteredUnpaidOrders.filter(order => order.washType === 'standard')))}
                    keyField="id"
                    emptyMessage="No unpaid standard wash orders found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
                
                <TabsContent value="combined">
                  <DataTable
                    columns={unpaidColumns}
                    data={applyDateFilter(applyOrderIdSearch(filteredUnpaidOrders.filter(order => order.washType === 'combined')))}
                    keyField="id"
                    emptyMessage="No unpaid combined wash orders found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <Tabs 
                defaultValue="all" 
                className="w-full" 
                onValueChange={(value) => setMainWashTypeTab(value as 'all' | 'express' | 'standard' | 'combined')}
              >
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="bg-background border border-input">
                    <TabsTrigger value="all">All Wash Types</TabsTrigger>
                    <TabsTrigger value="express">Express Wash</TabsTrigger>
                    <TabsTrigger value="standard">Standard Wash</TabsTrigger>
                    <TabsTrigger value="combined">Combined Wash</TabsTrigger>
                  </TabsList>
                  
                  {/* Search Bar - Right aligned */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search by Order ID..."
                      value={orderIdSearch}
                      onChange={(e) => setOrderIdSearch(e.target.value)}
                      className="pl-10 pr-10 py-2 w-full sm:w-60"
                    />
                    {orderIdSearch && (
                      <button
                        onClick={() => setOrderIdSearch('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters Row - Below the tabs */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  {/* Date Filter */}
                  <Popover open={showDateFilterPopover} onOpenChange={setShowDateFilterPopover}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {dateFilter === 'all' ? 'All Dates' :
                          dateFilter === 'today' ? 'Today' :
                          dateFilter === 'yesterday' ? 'Yesterday' :
                          dateFilter === 'this_week' ? 'This Week' :
                          dateFilter === 'this_month' ? 'This Month' :
                          'Custom Date Range'}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Filter by Date</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="all-dates-history"
                              name="date-filter-history"
                              checked={dateFilter === 'all'}
                              onChange={() => setDateFilter('all')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="all-dates-history" className="text-sm">All Dates</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="today-history"
                              name="date-filter-history"
                              checked={dateFilter === 'today'}
                              onChange={() => setDateFilter('today')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="today-history" className="text-sm">Today</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="yesterday-history"
                              name="date-filter-history"
                              checked={dateFilter === 'yesterday'}
                              onChange={() => setDateFilter('yesterday')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="yesterday-history" className="text-sm">Yesterday</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="this-week-history"
                              name="date-filter-history"
                              checked={dateFilter === 'this_week'}
                              onChange={() => setDateFilter('this_week')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="this-week-history" className="text-sm">This Week</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="this-month-history"
                              name="date-filter-history"
                              checked={dateFilter === 'this_month'}
                              onChange={() => setDateFilter('this_month')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="this-month-history" className="text-sm">This Month</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="custom-range-history"
                              name="date-filter-history"
                              checked={dateFilter === 'custom'}
                              onChange={() => setDateFilter('custom')}
                              className="h-4 w-4 text-primary"
                            />
                            <label htmlFor="custom-range-history" className="text-sm">Custom Range</label>
                          </div>
                        </div>
                        
                        {dateFilter === 'custom' && (
                          <div className="space-y-2 pt-2 border-t border-gray-100">
                            <div className="space-y-1">
                              <label htmlFor="start-date-history" className="text-xs font-medium">Start Date</label>
                              <Input
                                id="start-date-history"
                                type="date"
                                value={customDateRange.start}
                                onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                                className="h-9"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label htmlFor="end-date-history" className="text-xs font-medium">End Date</label>
                              <Input
                                id="end-date-history"
                                type="date"
                                value={customDateRange.end}
                                onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                                className="h-9"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={resetDateFilter}
                          >
                            Reset
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => setShowDateFilterPopover(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Active Filters Display - Only for date filter */}
                  {dateFilter !== 'all' && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Active Filters:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                        {dateFilter === 'today' ? 'Today' :
                        dateFilter === 'yesterday' ? 'Yesterday' :
                        dateFilter === 'this_week' ? 'This Week' :
                        dateFilter === 'this_month' ? 'This Month' :
                        'Custom Date Range'}
                        <button
                          onClick={resetDateFilter}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    </div>
                  )}
                </div>
                
                <TabsContent value="all">
                  <DataTable
                    columns={historyColumns}
                    data={getFilteredPaymentHistory()}
                    keyField="id"
                    emptyMessage="No payment history found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
                
                <TabsContent value="express">
                  <DataTable
                    columns={historyColumns}
                    data={applyDateFilter(applyOrderIdSearch(filteredPaymentHistory.filter(payment => payment.washType === 'express')))}
                    keyField="id"
                    emptyMessage="No express wash payment history found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
                
                <TabsContent value="standard">
                  <DataTable
                    columns={historyColumns}
                    data={applyDateFilter(applyOrderIdSearch(filteredPaymentHistory.filter(payment => payment.washType === 'standard')))}
                    keyField="id"
                    emptyMessage="No standard wash payment history found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
                
                <TabsContent value="combined">
                  <DataTable
                    columns={historyColumns}
                    data={applyDateFilter(applyOrderIdSearch(filteredPaymentHistory.filter(payment => payment.washType === 'combined')))}
                    keyField="id"
                    emptyMessage="No combined wash payment history found"
                    searchPlaceholder="Search by Order ID..."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Payment Modal */}
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
                {formatIndianRupees(selectedOrder.amount)}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wash Type
              </label>
              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-gray-700">
                {selectedOrder.washType === 'express' ? 'Express Wash' : 
                 selectedOrder.washType === 'standard' ? 'Standard Wash' : 
                 'Combined Wash'}
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

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrderDetails && (
        <Dialog open={showOrderDetailsModal} onOpenChange={setShowOrderDetailsModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Complete information about order {selectedOrderDetails.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Order Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedOrderDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ordered Date</p>
                    <p className="font-medium">{new Date(selectedOrderDetails.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wash Type</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      selectedOrderDetails.washType === 'express' ? 'bg-purple-100 text-purple-800' : 
                      selectedOrderDetails.washType === 'standard' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedOrderDetails.washType === 'express' ? 'Express Wash' : 
                      selectedOrderDetails.washType === 'standard' ? 'Standard Wash' : 
                      'Combined Wash'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Unpaid
                    </span>
                  </div>
                  {selectedOrderDetails.deliveredDate && (
                    <div>
                      <p className="text-xs text-gray-500">Delivered Date</p>
                      <p className="font-medium">{new Date(selectedOrderDetails.deliveredDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"><Phone className="h-4 w-4" /></span>
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-medium">{selectedOrderDetails.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"><Phone className="h-4 w-4" /></span>
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="font-medium">+91 {Math.floor(Math.random() * 9000000000) + 1000000000}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"><MapPin className="h-4 w-4" /></span>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium">123 Main Street, Apartment 4B</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Service Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Services</span>
                    <span className="text-gray-600 font-medium">Price</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  
                  {getServiceDetails(selectedOrderDetails.washType).map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="text-gray-600">{formatIndianRupees(service.price)}</span>
                    </div>
                  ))}
                  
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Total Amount</span>
                    <span>{formatIndianRupees(selectedOrderDetails.amount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"><Calendar className="h-4 w-4" /></span>
                    <div>
                      <p className="text-xs text-gray-500">Expected Delivery</p>
                      <p className="font-medium">{new Date(new Date(selectedOrderDetails.date).getTime() + 86400000 * 2).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {selectedOrderDetails.deliveredDate && (
                    <div className="flex items-start">
                      <span className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"><Calendar className="h-4 w-4" /></span>
                      <div>
                        <p className="text-xs text-gray-500">Delivered Date</p>
                        <p className="font-medium">{new Date(selectedOrderDetails.deliveredDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"><Package className="h-4 w-4" /></span>
                    <div>
                      <p className="text-xs text-gray-500">Items Count</p>
                      <p className="font-medium">{Math.floor(Math.random() * 10) + 5} items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setShowOrderDetailsModal(false)}
              >
                Close
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setShowOrderDetailsModal(false);
                  openPaymentModal(selectedOrderDetails);
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default StudioPayments;
