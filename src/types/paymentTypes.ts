export type DateFilterOption = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

// Add address field to UnpaidOrder interface
export interface UnpaidOrder {
  id: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  washType?: 'express' | 'standard' | 'combined';
  address?: string;
  assignedTo?: string;
}

export interface PaymentRecord {
  orderId: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'card' | 'upi' | 'cash';
  status: 'success' | 'failed' | 'refunded';
  washType: 'express' | 'standard' | 'combined';
}
