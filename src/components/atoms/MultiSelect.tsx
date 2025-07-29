import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, X, Search, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) && !value.includes(opt.value)
  );

  const handleSelect = (val: string) => {
    if (!value.includes(val)) {
      onChange([...value, val]);
    }
  };

  const handleRemove = (val: string) => {
    onChange(value.filter(v => v !== val));
  };

  const handleSelectAll = () => {
    const all = [
      ...value,
      ...filteredOptions.map(opt => opt.value).filter(v => !value.includes(v)),
    ];
    onChange(all);
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={`w-full ${className}`} ref={wrapperRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div
        className="relative cursor-pointer"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
      >
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between min-h-[40px]">
          <div className="flex-1 flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.slice(0, 3).map(val => {
                const opt = options.find(o => o.value === val);
                return (
                  <span key={val} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                    {opt?.label || val}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemove(val);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X size={10} />
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="text-gray-400 text-sm">{placeholder}</span>
            )}
            {value.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-0.5">+{value.length - 3} more</span>
            )}
          </div>
          <div className="ml-2 text-gray-400">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        {open && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-80 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder={`Search...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Select All Visible ({filteredOptions.length})
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => (
                  <div
                    key={opt.value}
                    className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer ${value.includes(opt.value) ? 'bg-blue-50' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      handleSelect(opt.value);
                    }}
                  >
                    <span className={`text-sm ${value.includes(opt.value) ? 'text-blue-900 font-medium' : 'text-gray-900'}`}>{opt.label}</span>
                    {value.includes(opt.value) && <Check size={16} className="text-blue-600" />}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  {search ? 'No options match your search' : 'No options available'}
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-600">{value.length} selected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
