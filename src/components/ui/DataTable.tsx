import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TableColumn<T> {
  header: string;
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
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onSelectAll?: (isSelected: boolean) => void;
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
  selectable = false,
  onSelectionChange,
  onSelectAll
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

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

  useEffect(() => {
    setSelectedRows(new Set());
    setSelectAll(false);
  }, [data]);

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

  const handleRowSelect = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelectedRows));
    }
    
    setSelectAll(newSelectedRows.size === data.length);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allIds = data.map(row => String(row[keyField]));
      setSelectedRows(new Set(allIds));
      if (onSelectionChange) {
        onSelectionChange(allIds);
      }
    } else {
      setSelectedRows(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
    
    if (onSelectAll) {
      onSelectAll(newSelectAll);
    }
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
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </div>
                </th>
              )}
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
              data.map((row, rowIndex) => (
                <tr key={String(row[keyField])} className="hover:bg-gray-50 transition-colors">
                  {selectable && (
                    <td className="w-12 px-4 py-3">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selectedRows.has(String(row[keyField]))}
                          onCheckedChange={() => handleRowSelect(String(row[keyField]))}
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((column, index) => (
                    <td key={index} className="px-4 py-3 text-sm text-gray-700">
                      {typeof column.accessor === 'function'
                        ? column.accessor(row, rowIndex)
                        : row[column.accessor] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={selectable ? columns.length + 1 : columns.length}
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
