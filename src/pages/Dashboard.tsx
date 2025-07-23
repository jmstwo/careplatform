import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  FileText,
  UserX,
  AlertCircle,
  Plus,
  Calendar,
  Settings,
  Filter
} from 'lucide-react';
import { StatCard } from '../components/molecules/StatCard';
import { ActionButton } from '../components/molecules/ActionButton';
import { Select } from '../components/atoms/Select';
import { Input } from '../components/atoms/Input';
import { DASHBOARD_STATS, DISTRICTS, DATE_RANGES } from '../utils/constants';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    district: 'All Districts',
    date: format(new Date(), 'yyyy-MM-dd'),
    range: 'Today'
  });

  const districtOptions = DISTRICTS.map(district => ({
    value: district,
    label: district
  }));

  const rangeOptions = DATE_RANGES.map(range => ({
    value: range,
    label: range
  }));

  const statsData = [
    {
      title: 'Active Clients',
      value: DASHBOARD_STATS.ACTIVE_CLIENTS,
      icon: <Users size={20} />,
      color: 'blue' as const
    },
    {
      title: 'Staff on Duty', 
      value: DASHBOARD_STATS.STAFF_ON_DUTY,
      icon: <UserCheck size={20} />,
      color: 'green' as const
    },
    {
      title: 'Pending Clients',
      value: DASHBOARD_STATS.PENDING_CLIENTS,
      icon: <Clock size={20} />,
      color: 'yellow' as const
    },
    {
      title: 'Active Alerts',
      value: DASHBOARD_STATS.ACTIVE_ALERTS,
      icon: <AlertTriangle size={20} />,
      color: 'red' as const
    },
    {
      title: 'Pending Assessments',
      value: DASHBOARD_STATS.PENDING_ASSESSMENTS,
      icon: <FileText size={20} />,
      color: 'blue' as const
    },
    {
      title: 'Clients Ending Soon',
      value: DASHBOARD_STATS.CLIENTS_ENDING_SOON,
      icon: <Clock size={20} />,
      color: 'purple' as const
    },
    {
      title: 'Staff on Leave',
      value: DASHBOARD_STATS.STAFF_ON_LEAVE,
      icon: <UserX size={20} />,
      color: 'gray' as const
    },
    {
      title: 'Incident Reporting',
      value: DASHBOARD_STATS.INCIDENT_REPORTING,
      icon: <AlertCircle size={20} />,
      color: 'orange' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sheffield Council</h1>
            <p className="text-gray-600">Sheffield Care Coordination Team</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 lg:items-end">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <Select
                options={districtOptions}
                value={filters.district}
                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                className="min-w-[150px]"
              />
            </div>
            
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="min-w-[120px]"
            />
            
            <Select
              options={rangeOptions}
              value={filters.range}
              onChange={(e) => setFilters(prev => ({ ...prev, range: e.target.value }))}
              className="min-w-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            label="Add New Client"
            icon={<Plus size={16} />}
            variant="primary"
            size="md"
            onClick={() => console.log('Add New Client')}
          />
          <ActionButton
            label="View Rota"
            icon={<Calendar size={16} />}
            variant="success"
            size="md"
            onClick={() => console.log('View Rota')}
          />
          <ActionButton
            label="EMAR Charts"
            icon={<FileText size={16} />}
            variant="warning"
            size="md"
            onClick={() => console.log('EMAR Charts')}
          />
          <ActionButton
            label="Settings"
            icon={<Settings size={16} />}
            variant="secondary"
            size="md"
            onClick={() => console.log('Settings')}
          />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            onClick={() => console.log(`Clicked ${stat.title}`)}
          />
        ))}
      </div>
    </div>
  );
};
