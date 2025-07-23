import React from 'react';
import { StatCardProps } from '../../types';

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  onClick
}) => {
  const isImportant = color === 'red' || color === 'orange';
  
  return (
    <div
      className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
        isImportant 
          ? 'bg-red-50 border-red-100 hover:shadow-sm' 
          : 'bg-white border-gray-100 hover:shadow-sm'
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-semibold ${isImportant ? 'text-red-600' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${
          isImportant ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-600'
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );
};