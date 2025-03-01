
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  subtext?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, subtext, onClick }) => {
  return (
    <div 
      className={`bg-white p-5 rounded-lg shadow-subtle transition-all duration-300 hover:shadow-card ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1 text-gray-800">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
          )}
          
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium mr-1 ${
                  change.trend === 'up'
                    ? 'text-green-600'
                    : change.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-500'
                }`}
              >
                {change.value}
              </span>
              <span className="text-xs text-gray-400">vs. last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-gray-50 rounded-md text-admin-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
