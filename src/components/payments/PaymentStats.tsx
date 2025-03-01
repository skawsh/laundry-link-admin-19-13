
import React from 'react';
import StatsCard from '../ui/StatsCard';
import { UnpaidOrder } from '@/types/paymentTypes';
import { formatIndianRupees } from '@/utils/dateUtils';
import { filterDeliveredOrders } from '@/utils/orderUtils';

interface PaymentStatsProps {
  filteredUnpaidOrders: UnpaidOrder[];
}

const PaymentStats: React.FC<PaymentStatsProps> = ({ filteredUnpaidOrders }) => {
  // Only consider orders with delivery dates for stats
  const deliveredOrders = filterDeliveredOrders(filteredUnpaidOrders);
  
  // Statistics calculations based on filtered data
  const expressWashOrders = deliveredOrders.filter(order => order.washType === 'express');
  const standardWashOrders = deliveredOrders.filter(order => order.washType === 'standard');
  const combinedWashOrders = deliveredOrders.filter(order => order.washType === 'combined');
  
  const expressWashCount = expressWashOrders.length;
  const standardWashCount = standardWashOrders.length;
  const combinedWashCount = combinedWashOrders.length;
  
  const totalUnpaidCount = expressWashCount + standardWashCount + combinedWashCount;

  const expressWashAmount = expressWashOrders.reduce((sum, order) => sum + order.amount, 0);
  const standardWashAmount = standardWashOrders.reduce((sum, order) => sum + order.amount, 0);
  const combinedWashAmount = combinedWashOrders.reduce((sum, order) => sum + order.amount, 0);
  
  const totalUnpaidAmount = expressWashAmount + standardWashAmount + combinedWashAmount;
  
  return (
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
  );
};

export default PaymentStats;
