
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  orderIdSearch: string;
  setOrderIdSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ orderIdSearch, setOrderIdSearch }) => {
  return (
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
  );
};

export default SearchBar;
