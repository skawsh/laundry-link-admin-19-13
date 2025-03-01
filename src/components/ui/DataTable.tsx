
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TableColumn<T> {
  header: string | React.ReactNode;
  accessor: keyof T | ((row: T, index: number) => React.ReactNode);
  width?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  emptyMessage?: string;
  initialSearchQuery?: string;
  searchSuggestions?: boolean;
  onSuggestionClick?: (value: string) => void;
  searchFields?: Array<keyof T>;
  selectedRows?: string[];
}

function DataTable<T>({
  columns,
  data,
  keyField,
  searchPlaceholder = 'Search...',
  onSearch,
  emptyMessage = 'No data available',
  initialSearchQuery = '',
  searchSuggestions = false,
  onSuggestionClick,
  searchFields = [],
  selectedRows = []
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getSuggestions = (query: string): string[] => {
    if (!query || query.length < 2 || !searchFields.length) return [];
    
    const suggestionSet = new Set<string>();
    
    data.forEach(item => {
      searchFields.forEach(field => {
        const value = item[field];
        if (typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())) {
          suggestionSet.add(value);
        }
      });
    });
    
    return Array.from(suggestionSet).slice(0, 5);
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2 && searchSuggestions) {
      const newSuggestions = getSuggestions(searchQuery);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, data, searchSuggestions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const isRowSelected = (rowId: string) => {
    return selectedRows.includes(rowId);
  };

  return (
    <div className="bg-white rounded-lg shadow-subtle overflow-hidden">
      {onSearch && (
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.length >= 2 && setSuggestions(getSuggestions(searchQuery))}
              onBlur={handleBlur}
              className="block w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-10 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent"
            />
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            
            {showSuggestions && searchSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                <ul className="py-1 text-sm text-gray-700 max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => {
                const rowId = String(row[keyField]);
                const isSelected = isRowSelected(rowId);
                
                return (
                  <tr 
                    key={rowId} 
                    className={cn(
                      "transition-colors", 
                      isSelected 
                        ? "bg-emerald-50 hover:bg-emerald-100" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    {columns.map((column, index) => (
                      <td key={index} className="px-4 py-3 text-sm text-gray-700">
                        {typeof column.accessor === 'function'
                          ? column.accessor(row, rowIndex)
                          : row[column.accessor] as React.ReactNode}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-sm text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
