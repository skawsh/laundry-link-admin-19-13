
import React from 'react';
import { FilterType } from './types';

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
          activeFilter === 'all' 
            ? 'bg-admin-primary text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange('services')}
        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
          activeFilter === 'services' 
            ? 'bg-admin-primary text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Services
      </button>
      <button
        onClick={() => onFilterChange('subservices')}
        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
          activeFilter === 'subservices' 
            ? 'bg-admin-primary text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Subservices
      </button>
      <button
        onClick={() => onFilterChange('items')}
        className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
          activeFilter === 'items' 
            ? 'bg-admin-primary text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Items
      </button>
    </div>
  );
};

export default FilterButtons;
