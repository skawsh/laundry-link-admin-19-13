
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UnpaidOrder, PaymentRecord } from '@/types/paymentTypes';
import WashTypeTabs from './WashTypeTabs';
import SearchBar from './SearchBar';
import DateFilterPopover from './DateFilterPopover';
import DataTable from '../ui/DataTable';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  openBulkPaymentModal: () => void;
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
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
  selectedItems,
  setSelectedItems
}) => {
  const [selectAll, setSelectAll] = useState(false);

  // Reset selections when view type changes
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [viewType, mainWashTypeTab, orderIdSearch, dateFilter, setSelectedItems]);

  // Handle selection of individual items
  const handleSelect = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = (filteredData as any[]).map(item => item.id as string);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state when selections change
  useEffect(() => {
    if (filteredData.length > 0 && selectedItems.length === filteredData.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, filteredData]);

  // Add checkbox to columns
  const unpaidColumnsWithCheckbox = [
    {
      header: (
        <Checkbox 
          checked={selectAll}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
      ),
      accessor: (row: UnpaidOrder) => (
        <Checkbox 
          checked={selectedItems.includes(row.id)}
          onCheckedChange={() => handleSelect(row.id)}
          aria-label={`Select order ${row.id}`}
        />
      ),
      width: '40px'
    },
    ...unpaidColumns
  ];

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
                <div className="flex items-center gap-3">
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
                </div>
                
                {/* Bulk Payment Button */}
                <Button 
                  variant="success" 
                  onClick={openBulkPaymentModal}
                  className="ml-auto"
                  disabled={selectedItems.length === 0}
                >
                  {selectedItems.length > 0 
                    ? `Mark ${selectedItems.length} ${selectedItems.length === 1 ? 'Order' : 'Orders'} as Paid` 
                    : 'Mark Selected as Paid'}
                </Button>
              </div>
            </Tabs>
          </div>
          
          <DataTable
            columns={unpaidColumnsWithCheckbox}
            data={filteredData as UnpaidOrder[]}
            keyField="id"
            emptyMessage="No unpaid orders found"
            selectedRows={selectedItems}
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
