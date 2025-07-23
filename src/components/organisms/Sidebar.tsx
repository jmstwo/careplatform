import React, { useState } from 'react';
import { 
  Home,
  Bell,
  Calendar,
  Users,
  UserCheck,
  Pill,
  Clock,
  FileText,
  AlertTriangle,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { NavItem } from '../molecules/NavItem';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, href: '/' },
  { id: 'alerts', label: 'Alerts', icon: <Bell size={20} />, href: '/alerts' },
  { id: 'rota', label: 'Rota Management', icon: <Calendar size={20} />, href: '/rota-management' },
  { id: 'clients', label: 'Client Management', icon: <Users size={20} />, href: '/client-management' },
  { id: 'staff', label: 'Staff Management', icon: <UserCheck size={20} />, href: '/staff-management' },
  { id: 'emar', label: 'EMAR', icon: <Pill size={20} />, href: '/emar' },
  { id: 'timesheets', label: 'Timesheets', icon: <Clock size={20} />, href: '/timesheets' },
  { id: 'patches', label: 'Patches', icon: <FileText size={20} />, href: '/patches' },
  { id: 'reports', label: 'Reports', icon: <FileText size={20} />, href: '/reports' },
  { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={20} />, href: '/incidents' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileOpen = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileOpen} 
        />
      )}

      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-700 lg:hidden"
        onClick={toggleMobileOpen}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 w-64 z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold ">SC</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-large ">Sheffield Care</h1>
              <p className="text-gray-400 text-xs">Care Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 text-sm p-4 space-y-1 bg-gray-900">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentPath === item.href}
              onClick={() => {
                onNavigate(item.href);
                if (mobileOpen) setMobileOpen(false);
              }}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};