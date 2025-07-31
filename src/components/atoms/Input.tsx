import React, { forwardRef } from 'react';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';  // <-- import lucide icon
import "react-datepicker/dist/react-datepicker.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  // Custom input for datepicker to show icon inside
  const CustomDateInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange }, ref) => {
    const inputClasses = clsx(
      'w-full px-3 py-2.5 border border-gray-300 text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[44px] placeholder:text-gray-400',
      error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
      className,
      'pl-10' // padding for icon
    );
    return (
      <div className="relative w-full cursor-pointer">
        <input
          id={inputId}
          className={inputClasses}
          onClick={onClick}
          value={value}
          onChange={onChange}
          ref={ref}
          readOnly
          placeholder="YYYY-MM-DD"
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
      </div>
    );
  });

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        {(() => {
          if (props.type === 'date') {
            // Controlled date value: parse string to Date or null
            const dateValue = props.value ? new Date(props.value as string) : null;

            return (
              <DatePicker
                id={inputId}
                selected={dateValue}
                onChange={(date: Date | null) => {
                  // simulate native event to keep same onChange signature
                  const event = {
                    target: {
                      value: date ? date.toISOString().split('T')[0] : '',
                      name: props.name,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  props.onChange && props.onChange(event);
                }}
                dateFormat="yyyy-MM-dd"
                customInput={<CustomDateInput />}
                wrapperClassName="w-full"
                // you can forward other props here as needed
              />
            );
          } else {
            const inputClasses = clsx(
              'w-full px-3 py-2.5 border border-gray-300 text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[44px] placeholder:text-gray-400',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              className
            );

            return (
              <input
                id={inputId}
                className={inputClasses}
                {...props}
              />
            );
          }
        })()}

        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
