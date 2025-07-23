import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active = false,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5  rounded-lg transition-all duration-200 text-left ${
        active
          ? 'bg-primary-600 text-white font-medium'
          : 'text-white hover:text-primary-100 hover:bg-gray-800 '
      }`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium truncate">{label}</span>
    </button>
  );
};