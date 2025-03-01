import { UnpaidOrder, PaymentRecord, DateFilterOption } from "../types/paymentTypes";

// Get service details for different wash types
export const getServiceDetails = (washType: 'express' | 'standard' | 'combined') => {
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

// Apply date filter to data
export const applyDateFilter = <T extends UnpaidOrder | PaymentRecord>(
  orders: T[], 
  dateFilter: DateFilterOption,
  customDateRange: {start: string, end: string}
): T[] => {
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
export const applyOrderIdSearch = <T extends UnpaidOrder | PaymentRecord>(
  orders: T[], 
  orderIdSearch: string
): T[] => {
  if (!orderIdSearch) return orders;
  
  return orders.filter(order => {
    const orderId = 'orderId' in order ? order.orderId : order.id;
    return orderId.toLowerCase().includes(orderIdSearch.toLowerCase());
  });
};

// Apply wash type filter to data
export const applyWashTypeFilter = <T extends UnpaidOrder | PaymentRecord>(
  orders: T[], 
  washType: 'all' | 'express' | 'standard' | 'combined'
): T[] => {
  if (washType !== 'all') {
    return orders.filter(order => order.washType === washType);
  }
  return orders;
};

// Filter orders to only include those with delivery dates (for stats)
export const filterDeliveredOrders = (orders: UnpaidOrder[]): UnpaidOrder[] => {
  return orders;  // All orders now have delivery dates by type definition
};

// New function to filter orders by driver
export const filterOrdersByDriver = (
  orders: UnpaidOrder[], 
  driverId: string
): UnpaidOrder[] => {
  return orders.filter(order => order.assignedTo === driverId);
};

// Group orders by wash type
export const groupOrdersByWashType = (orders: UnpaidOrder[]) => {
  return {
    express: orders.filter(order => order.washType === 'express'),
    standard: orders.filter(order => order.washType === 'standard'),
    combined: orders.filter(order => order.washType === 'combined'),
    all: orders
  };
};

// Get wash type display name
export const getWashTypeDisplayName = (washType: 'express' | 'standard' | 'combined' | undefined) => {
  switch (washType) {
    case 'express':
      return 'Express Wash';
    case 'standard':
      return 'Standard Wash';
    case 'combined':
      return 'Express & Standard';
    default:
      return 'Standard Wash';
  }
};
