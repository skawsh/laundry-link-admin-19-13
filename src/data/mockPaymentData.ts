
import { UnpaidOrder, PaymentRecord } from "../types/paymentTypes";
import { createOrderDate, createDeliveredDate } from "../utils/dateUtils";

// Sample data with 2025 dates and realistic names/dates
export const initialUnpaidOrders: UnpaidOrder[] = [
  (() => {
    const date = createOrderDate(1, 10);
    return { id: 'ORD-1001', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 450, isPaid: false, washType: 'standard', customerName: 'John Doe', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 12);
    return { id: 'ORD-1002', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 320, isPaid: false, washType: 'express', customerName: 'Jane Smith', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 15);
    return { id: 'ORD-1003', studioId: 2, studioName: 'Sparkle Clean Laundry', date, amount: 550, isPaid: false, washType: 'standard', customerName: 'Robert Johnson', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 16);
    return { id: 'ORD-1004', studioId: 3, studioName: 'Fresh Fold Services', date, amount: 400, isPaid: false, washType: 'express', customerName: 'Emily Wilson', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 18);
    return { id: 'ORD-1005', studioId: 2, studioName: 'Sparkle Clean Laundry', date, amount: 280, isPaid: false, washType: 'standard', customerName: 'Michael Brown', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 20);
    return { id: 'ORD-1006', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 380, isPaid: false, washType: 'standard', customerName: 'Sarah Davis', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 22);
    return { id: 'ORD-1007', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 290, isPaid: false, washType: 'express', customerName: 'Thomas Miller', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 25);
    return { id: 'ORD-1008', studioId: 3, studioName: 'Fresh Fold Services', date, amount: 650, isPaid: false, washType: 'combined', customerName: 'Laura Wilson', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 26);
    return { id: 'ORD-1009', studioId: 2, studioName: 'Sparkle Clean Laundry', date, amount: 520, isPaid: false, washType: 'combined', customerName: 'Alex Johnson', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(1, 28);
    return { id: 'ORD-1010', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 470, isPaid: false, washType: 'combined', customerName: 'Maya Patel', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(2, 5);
    return { id: 'ORD-2001', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 540, isPaid: false, washType: 'express', customerName: 'Rachel Green', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(2, 8);
    return { id: 'ORD-2002', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 320, isPaid: false, washType: 'standard', customerName: 'Joey Tribbiani', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(2, 10);
    return { id: 'ORD-2003', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 410, isPaid: false, washType: 'combined', customerName: 'Chandler Bing', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(2, 15);
    return { id: 'ORD-2004', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 380, isPaid: false, washType: 'express', customerName: 'Monica Geller', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(2, 18);
    return { id: 'ORD-2005', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 430, isPaid: false, washType: 'standard', customerName: 'Ross Geller', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(2, 22);
    return { id: 'ORD-2006', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 390, isPaid: false, washType: 'combined', customerName: 'Phoebe Buffay', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(3, 5);
    return { id: 'ORD-2007', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 520, isPaid: false, washType: 'express', customerName: 'Richard Burke', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
  (() => {
    const date = createOrderDate(3, 10);
    return { id: 'ORD-2008', studioId: 1, studioName: 'Saiteja Laundry', date, amount: 480, isPaid: false, washType: 'standard', customerName: 'Janice Hosenstein', deliveredDate: createDeliveredDate(date), status: 'pending' };
  })(),
];

export const initialPaymentHistory: PaymentRecord[] = [
  (() => {
    const date = createOrderDate(1, 5);
    return { 
      id: 'PMT-2001', 
      studioId: 1, 
      studioName: 'Saiteja Laundry', 
      orderId: 'ORD-1000', 
      amount: 520, 
      paymentDate: date, 
      referenceNumber: 'UTR12345678', 
      washType: 'standard', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Emma Watson',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(1, 4);
    return { 
      id: 'PMT-2002', 
      studioId: 2, 
      studioName: 'Sparkle Clean Laundry', 
      orderId: 'ORD-995', 
      amount: 420, 
      paymentDate: date, 
      referenceNumber: 'UTR87654321', 
      washType: 'express', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Chris Evans',
      paymentMethod: 'Bank Transfer', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(1, 2);
    return { 
      id: 'PMT-2003', 
      studioId: 1, 
      studioName: 'Saiteja Laundry', 
      orderId: 'ORD-990', 
      amount: 350, 
      paymentDate: date, 
      referenceNumber: 'UTR23456789', 
      washType: 'standard', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Tom Holland',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(1, 3);
    return { 
      id: 'PMT-2004', 
      studioId: 3, 
      studioName: 'Fresh Fold Services', 
      orderId: 'ORD-985', 
      amount: 600, 
      paymentDate: date, 
      referenceNumber: 'UTR98765432', 
      washType: 'express', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Scarlett Johansson',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(1, 28);
    return { 
      id: 'PMT-2005', 
      studioId: 4, 
      studioName: 'Royal Wash', 
      orderId: 'ORD-980', 
      amount: 480, 
      paymentDate: date, 
      referenceNumber: 'UTR34567890', 
      washType: 'standard', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Robert Downey Jr.',
      paymentMethod: 'Bank Transfer', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(1, 25);
    return { 
      id: 'PMT-2006', 
      studioId: 1, 
      studioName: 'Saiteja Laundry', 
      orderId: 'ORD-975', 
      amount: 410, 
      paymentDate: date, 
      referenceNumber: 'UTR45678901', 
      washType: 'express', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Chris Hemsworth',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(1, 22);
    return { 
      id: 'PMT-2007', 
      studioId: 3, 
      studioName: 'Fresh Fold Services', 
      orderId: 'ORD-970', 
      amount: 580, 
      paymentDate: date, 
      referenceNumber: 'UTR56789012', 
      washType: 'combined', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Mark Ruffalo',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(1, 20);
    return { 
      id: 'PMT-2008', 
      studioId: 2, 
      studioName: 'Sparkle Clean Laundry', 
      orderId: 'ORD-965', 
      amount: 490, 
      paymentDate: date, 
      referenceNumber: 'UTR67890123', 
      washType: 'combined', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Elizabeth Olsen',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(2, 5);
    return { 
      id: 'PMT-3001', 
      studioId: 1, 
      studioName: 'Saiteja Laundry', 
      orderId: 'ORD-3001', 
      amount: 550, 
      paymentDate: date, 
      referenceNumber: 'UTR11223344', 
      washType: 'express', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Paul Bettany',
      paymentMethod: 'Bank Transfer', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(2, 10);
    return { 
      id: 'PMT-3002', 
      studioId: 1, 
      studioName: 'Saiteja Laundry', 
      orderId: 'ORD-3002', 
      amount: 470, 
      paymentDate: date, 
      referenceNumber: 'UTR22334455', 
      washType: 'standard', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Sebastian Stan',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(2, 15);
    return { 
      id: 'PMT-3003', 
      studioId: 1, 
      studioName: 'Saiteja Laundry', 
      orderId: 'ORD-3003', 
      amount: 510, 
      paymentDate: date, 
      referenceNumber: 'UTR33445566', 
      washType: 'combined', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Anthony Mackie',
      paymentMethod: 'UPI', 
      status: 'completed' 
    };
  })(),
  (() => {
    const date = createOrderDate(2, 20);
    return { 
      id: 'PMT-3004', 
      studioId: 1, 
      studioName: 'Saiteja Laundry', 
      orderId: 'ORD-3004', 
      amount: 490, 
      paymentDate: date, 
      referenceNumber: 'UTR44556677', 
      washType: 'express', 
      deliveredDate: createDeliveredDate(date),
      customerName: 'Jeremy Renner',
      paymentMethod: 'Bank Transfer', 
      status: 'completed' 
    };
  })(),
];
