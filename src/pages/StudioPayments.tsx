
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

// Sample data with combined wash type renamed to "both" and realistic names/dates
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
  { id: 'ORD-2001', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-07-05', amount: 540, isPaid: false, washType: 'express', customerName: 'Rachel Green' },
  { id: 'ORD-2002', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-07-08', amount: 320, isPaid: false, washType: 'standard', customerName: 'Joey Tribbiani' },
  { id: 'ORD-2003', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-07-10', amount: 410, isPaid: false, washType: 'combined', customerName: 'Chandler Bing', deliveredDate: '2023-07-13' },
  { id: 'ORD-2004', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-07-15', amount: 380, isPaid: false, washType: 'express', customerName: 'Monica Geller', deliveredDate: '2023-07-17' },
  { id: 'ORD-2005', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-07-18', amount: 430, isPaid: false, washType: 'standard', customerName: 'Ross Geller' },
  { id: 'ORD-2006', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-07-22', amount: 390, isPaid: false, washType: 'combined', customerName: 'Phoebe Buffay' },
  { id: 'ORD-2007', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-08-05', amount: 520, isPaid: false, washType: 'express', customerName: 'Richard Burke', deliveredDate: '2023-08-08' },
  { id: 'ORD-2008', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-08-10', amount: 480, isPaid: false, washType: 'standard', customerName: 'Janice Hosenstein', deliveredDate: '2023-08-13' },
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
  { id: 'PMT-3001', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3001', amount: 550, paymentDate: '2023-09-05', referenceNumber: 'UTR11223344', washType: 'express', deliveredDate: '2023-09-07' },
  { id: 'PMT-3002', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3002', amount: 470, paymentDate: '2023-09-10', referenceNumber: 'UTR22334455', washType: 'standard', deliveredDate: '2023-09-13' },
  { id: 'PMT-3003', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3003', amount: 510, paymentDate: '2023-09-15', referenceNumber: 'UTR33445566', washType: 'combined', deliveredDate: '2023-09-18' },
  { id: 'PMT-3004', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-3004', amount: 490, paymentDate: '2023-09-20', referenceNumber: 'UTR44556677', washType: 'express', deliveredDate: '2023-09-23' },
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

  // Apply date filter to data - modified to use only ordered date
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
      // Always use order date for filtering, regardless if it's unpaid or payment history
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
          title="Both Unpaid Amount"
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
                    <TabsTrigger value="combined">Both</TabsTrigger>
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
                          
                          {dateFilter === 'custom' && (
                            <div className="pt-2 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label htmlFor="start-date" className="text-xs text-gray-500">Start Date</label>
                                  <input
                                    type="date"
                                    id="start-date"
                                    value={customDateRange.start}
                                    onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                                    className="w-full text-sm p-1.5 border border-gray-300 rounded-md"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="end-date" className="text-xs text-gray-500">End Date</label>
                                  <input
                                    type="date"
                                    id="end-date"
                                    value={customDateRange.end}
                                    onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                                    className="w-full text-sm p-1.5 border border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
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
                </div>
              </Tabs>
            </div>
            
            <DataTable
              columns={unpaidColumns}
              data={filteredData as UnpaidOrder[]}
              keyField="id"
              emptyMessage="No unpaid orders found"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center mb-4">
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
                    <TabsTrigger value="combined">Both</TabsTrigger>
                  </TabsList>

                  {/* Search Bar */}
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

                {/* Date Filter */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
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
                          
                          {dateFilter === 'custom' && (
                            <div className="pt-2 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label htmlFor="start-date-history" className="text-xs text-gray-500">Start Date</label>
                                  <input
                                    type="date"
                                    id="start-date-history"
                                    value={customDateRange.start}
                                    onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                                    className="w-full text-sm p-1.5 border border-gray-300 rounded-md"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="end-date-history" className="text-xs text-gray-500">End Date</label>
                                  <input
                                    type="date"
                                    id="end-date-history"
                                    value={customDateRange.end}
                                    onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                                    className="w-full text-sm p-1.5 border border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
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
                </div>
              </Tabs>
            </div>
            
            <DataTable
              columns={historyColumns}
              data={filteredData as PaymentRecord[]}
              keyField="id"
              emptyMessage="No payment history found"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[450px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Enter payment details for order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Order ID
                </label>
                <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded-md">
                  {selectedOrder?.id}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Amount
                </label>
                <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded-md">
                  {selectedOrder ? formatIndianRupees(selectedOrder.amount) : ''}
                </div>
              </div>
              
              <div>
                <label htmlFor="payment-date" className="text-sm font-medium text-gray-700 block mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  id="payment-date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="payment-reference" className="text-sm font-medium text-gray-700 block mb-1">
                  Payment Reference / UTR
                </label>
                <input
                  type="text"
                  id="payment-reference"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              onClick={confirmPayment}
              variant="success"
              className="ml-2"
            >
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Order Details Modal */}
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
                  {selectedOrderDetails?.washType === 'express' ? 'Express Wash' : 
                   selectedOrderDetails?.washType === 'standard' ? 'Standard Wash' : 'Both'}
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
    </AdminLayout>
  );
};

export default StudioPayments;
