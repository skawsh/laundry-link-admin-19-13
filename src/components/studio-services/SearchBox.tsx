
import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  onSearch?: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  searchInputRef,
  onSearch 
}) => {
  // Call the onSearch callback whenever searchQuery changes
  useEffect(() => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);

  return (
    <div className="relative w-full sm:w-96">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search services, items or prices..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary/40"
      />
      {searchQuery && (
        <button
          onClick={() => {
            setSearchQuery('');
            if (onSearch) onSearch('');
          }}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
