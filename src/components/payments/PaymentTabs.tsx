
import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UnpaidOrder, PaymentRecord } from '@/types/paymentTypes';
import WashTypeTabs from './WashTypeTabs';
import SearchBar from './SearchBar';
import DateFilterPopover from './DateFilterPopover';
import DataTable from '../ui/DataTable';
import { Button } from "@/components/ui/button";

interface PaymentTabsProps {
  viewType: 'unpaid' | 'history';
  setViewType: (value: 'unpaid' | 'history') => void;
  unpaidColumns: any[];
  historyColumns: any[];
  filteredData: (UnpaidOrder | PaymentRecord)[];
  mainWashTypeTab: 'all' | 'express' | 'standard' | 'combined';
  setMainWashTypeTab: (value: 'all' | 'express' | 'standard' | 'combined') => void;
  orderIdSearch: string;
  setOrderIdSearch: (value: string) => void;
  dateFilter: 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';
  setDateFilter: (value: 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom') => void;
  customDateRange: {start: string, end: string};
  setCustomDateRange: (value: {start: string, end: string}) => void;
  showDateFilterPopover: boolean;
  setShowDateFilterPopover: (value: boolean) => void;
  resetDateFilter: () => void;
  selectedOrders: UnpaidOrder[];
  setSelectedOrders: (orders: UnpaidOrder[]) => void;
  toggleSelectAllOrders: (isSelected: boolean) => void;
  openBulkPaymentModal: () => void;
}

const PaymentTabs: React.FC<PaymentTabsProps> = ({
  viewType,
  setViewType,
  unpaidColumns,
  historyColumns,
  filteredData,
  mainWashTypeTab,
  setMainWashTypeTab,
  orderIdSearch,
  setOrderIdSearch,
  dateFilter,
  setDateFilter,
  customDateRange,
  setCustomDateRange,
  showDateFilterPopover,
  setShowDateFilterPopover,
  resetDateFilter,
  selectedOrders,
  setSelectedOrders,
  toggleSelectAllOrders,
  openBulkPaymentModal
}) => {
  // Add useEffect to track changes to selectedOrders for debugging
  useEffect(() => {
    console.log("Selected orders updated:", selectedOrders.length, selectedOrders.map(o => o.id));
  }, [selectedOrders]);

  // Update the selection handling to properly track selected orders
  const handleSelectionChange = (selectedOrderIds: string[]) => {
    console.log("Selection changed to:", selectedOrderIds);
    if (viewType === 'unpaid') {
      const ordersToSelect = (filteredData as UnpaidOrder[]).filter(order => 
        selectedOrderIds.includes(order.id)
      );
      setSelectedOrders(ordersToSelect);
    }
  };

  return (
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
            >
              <div className="flex justify-between items-center mb-4">
                <WashTypeTabs 
                  mainWashTypeTab={mainWashTypeTab} 
                  setMainWashTypeTab={setMainWashTypeTab} 
                />
                
                {/* Search Bar - Right aligned */}
                <SearchBar
                  orderIdSearch={orderIdSearch}
                  setOrderIdSearch={setOrderIdSearch}
                />
              </div>

              {/* Filters Row - Below the tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                {/* Date Filter */}
                <DateFilterPopover 
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  customDateRange={customDateRange}
                  setCustomDateRange={setCustomDateRange}
                  showDateFilterPopover={showDateFilterPopover}
                  setShowDateFilterPopover={setShowDateFilterPopover}
                  resetDateFilter={resetDateFilter}
                />
                
                {/* Bulk Payment Button */}
                {selectedOrders.length > 0 && (
                  <Button 
                    variant="success" 
                    onClick={openBulkPaymentModal}
                    className="ml-auto"
                  >
                    Mark {selectedOrders.length} Orders as Paid
                  </Button>
                )}
              </div>
            </Tabs>
          </div>
          
          <DataTable
            columns={unpaidColumns}
            data={filteredData as UnpaidOrder[]}
            keyField="id"
            emptyMessage="No unpaid orders found"
            selectable={true}
            onSelectionChange={handleSelectionChange}
            onSelectAll={toggleSelectAllOrders}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="history">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Tabs 
              defaultValue="all" 
              className="w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <WashTypeTabs 
                  mainWashTypeTab={mainWashTypeTab} 
                  setMainWashTypeTab={setMainWashTypeTab} 
                />

                {/* Search Bar */}
                <SearchBar
                  orderIdSearch={orderIdSearch}
                  setOrderIdSearch={setOrderIdSearch}
                />
              </div>

              {/* Date Filter */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <DateFilterPopover 
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  customDateRange={customDateRange}
                  setCustomDateRange={setCustomDateRange}
                  showDateFilterPopover={showDateFilterPopover}
                  setShowDateFilterPopover={setShowDateFilterPopover}
                  resetDateFilter={resetDateFilter}
                />
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
  );
};

export default PaymentTabs;
