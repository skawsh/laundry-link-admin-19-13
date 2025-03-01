
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataTable from '@/components/ui/DataTable';
import SearchBar from '@/components/payments/SearchBar';
import WashTypeTabs from '@/components/payments/WashTypeTabs';
import DateFilterPopover from '@/components/payments/DateFilterPopover';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { DateFilterOption } from '@/types/paymentTypes';

interface PaymentTabsProps {
  viewType: 'unpaid' | 'history';
  setViewType: (value: 'unpaid' | 'history') => void;
  unpaidColumns: any[];
  historyColumns: any[];
  filteredData: any[];
  mainWashTypeTab: 'all' | 'express' | 'standard' | 'combined';
  setMainWashTypeTab: (value: 'all' | 'express' | 'standard' | 'combined') => void;
  orderIdSearch: string;
  setOrderIdSearch: (value: string) => void;
  dateFilter: DateFilterOption;
  setDateFilter: (value: DateFilterOption) => void;
  customDateRange: {start: string, end: string};
  setCustomDateRange: (value: {start: string, end: string}) => void;
  showDateFilterPopover: boolean;
  setShowDateFilterPopover: (value: boolean) => void;
  resetDateFilter: () => void;
  openBulkPaymentModal: () => void;
  selectedOrderIds?: string[]; // Added this prop
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
  openBulkPaymentModal,
  selectedOrderIds = []
}) => {
  return (
    <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'unpaid' | 'history')} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="unpaid">Unpaid Orders</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <WashTypeTabs 
            activeTab={mainWashTypeTab}
            setActiveTab={setMainWashTypeTab}
          />
          
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
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <SearchBar 
          value={orderIdSearch}
          onChange={setOrderIdSearch} 
          placeholder={viewType === 'unpaid' ? "Search by Order ID..." : "Search by Order ID or Payment ID..."}
        />
        
        {viewType === 'unpaid' && selectedOrderIds && selectedOrderIds.length > 0 && (
          <Button
            onClick={openBulkPaymentModal}
            variant="success"
            className="flex items-center ml-4"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Mark {selectedOrderIds.length} Orders as Paid</span>
          </Button>
        )}
      </div>
      
      <TabsContent value="unpaid" className="mt-0">
        <DataTable 
          columns={unpaidColumns}
          data={filteredData}
          keyField="id"
          emptyMessage="No unpaid orders found"
          selectedRows={selectedOrderIds}
        />
      </TabsContent>
      
      <TabsContent value="history" className="mt-0">
        <DataTable 
          columns={historyColumns}
          data={filteredData}
          keyField="id"
          emptyMessage="No payment history found"
        />
      </TabsContent>
    </Tabs>
  );
};

export default PaymentTabs;
