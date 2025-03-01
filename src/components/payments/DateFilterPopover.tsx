
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateFilterOption } from '@/types/paymentTypes';

interface DateFilterPopoverProps {
  dateFilter: DateFilterOption;
  setDateFilter: (value: DateFilterOption) => void;
  customDateRange: {start: string, end: string};
  setCustomDateRange: (value: {start: string, end: string}) => void;
  showDateFilterPopover: boolean;
  setShowDateFilterPopover: (value: boolean) => void;
  resetDateFilter: () => void;
}

const DateFilterPopover: React.FC<DateFilterPopoverProps> = ({
  dateFilter,
  setDateFilter,
  customDateRange,
  setCustomDateRange,
  showDateFilterPopover,
  setShowDateFilterPopover,
  resetDateFilter
}) => {
  return (
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
  );
};

export default DateFilterPopover;
