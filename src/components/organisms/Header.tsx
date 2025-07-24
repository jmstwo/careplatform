import React, { useState, useEffect } from 'react';
import { Bell, Settings, Search, LogOut, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../atoms/Button';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

// UK Time Clock Component
const UKTimeClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  useEffect(() => {
    // Function to get UK time
    const getUKTime = () => {
      // Create a date object with the current time
      const now = new Date();
      
      // Format the date to UK time by specifying the timezone
      // This uses the browser's ability to format dates in specific timezones
      const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
      
      return ukTime;
    };
    
    // Set initial time
    setCurrentTime(getUKTime());
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(getUKTime());
    }, 1000);
    
    // Clean up on unmount
    return () => clearInterval(timer);
  }, []);
  
  // Format time in UK format (24-hour clock)
  const formattedTime = format(currentTime, 'HH:mm:ss');
  
  return (
    <div className="text-md">
      <span className="text-gray-600">{formattedTime}</span>
      {/* <span className="text-xs text-gray-500 ml-2">UK Time</span> */}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ sidebarCollapsed = false }) => {
  const { user, logout } = useAuth();

  return (
    <header className={`bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 transition-all duration-300 ${
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    } lg:ml-0`}>
      {/* Left section - Search */}
      {/* <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg max-w-md w-full">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-0 outline-none text-sm flex-1"
          />
        </div>
      </div> */}

      {/* Center section - UK Clock */}
      <div className="flex items-center gap-2">
        <Clock size={18} className="text-gray-500" />
        <UKTimeClock />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            icon={<Bell size={18} />}
            className="p-2 hover:bg-gray-50"
          >
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          icon={<Settings size={18} />}
          className="p-2 hover:bg-gray-50"
        >
          <span className="sr-only">Settings</span>
        </Button>

        {/* User info with logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'SJ'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            icon={<LogOut size={16} />}
            className="p-2 hover:bg-gray-50 text-gray-500"
          >
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};