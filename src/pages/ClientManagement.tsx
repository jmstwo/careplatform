import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  Plus,
  User,
  Bell,
  Pill,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StatCard } from '../components/molecules/StatCard';
import { ActionButton } from '../components/molecules/ActionButton';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Button } from '../components/atoms/Button';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  age: number;
  postcode: string;
  serviceLevel: 0 | 1 | 2 | 3;
  startDate: string;
  endDate: string;
  district: string;
  status: 'Pending' | 'Active' | 'Discharged';
  hasAlerts: boolean;
}

type SortField = 'name' | 'age' | 'startDate' | 'endDate' | 'district' | 'status';
type SortDirection = 'asc' | 'desc';

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 78,
    postcode: 'S1 2HE',
    serviceLevel: 2,
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    district: 'North District',
    status: 'Active',
    hasAlerts: true
  },
  {
    id: '2',
    name: 'Michael Brown',
    age: 65,
    postcode: 'S10 3AB',
    serviceLevel: 1,
    startDate: '2024-02-01',
    endDate: '2024-07-01',
    district: 'South District',
    status: 'Active',
    hasAlerts: false
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 82,
    postcode: 'S11 8QR',
    serviceLevel: 3,
    startDate: '2024-01-20',
    endDate: '2024-05-20',
    district: 'East District',
    status: 'Pending',
    hasAlerts: true
  },
  {
    id: '4',
    name: 'James Davis',
    age: 71,
    postcode: 'S2 4DF',
    serviceLevel: 0,
    startDate: '2023-12-01',
    endDate: '2024-03-01',
    district: 'West District',
    status: 'Discharged',
    hasAlerts: false
  },
  {
    id: '5',
    name: 'Lisa Taylor',
    age: 69,
    postcode: 'S3 7GH',
    serviceLevel: 2,
    startDate: '2024-02-10',
    endDate: '2024-08-10',
    district: 'Central District',
    status: 'Active',
    hasAlerts: false
  },
  {
    id: '6',
    name: 'Robert Miller',
    age: 75,
    postcode: 'S4 5JK',
    serviceLevel: 1,
    startDate: '2024-01-05',
    endDate: '2024-06-05',
    district: 'North District',
    status: 'Active',
    hasAlerts: true
  }
];

const ENTRIES_PER_PAGE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' }
];

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Discharged', label: 'Discharged' },
  { value: 'HasAlerts', label: 'Has Alerts' }
];

const SERVICE_LEVEL_OPTIONS = [
  { value: '', label: 'All Service Levels' },
  { value: '0', label: 'SL 0' },
  { value: '1', label: 'SL 1' },
  { value: '2', label: 'SL 2' },
  { value: '3', label: 'SL 3' }
];

const DISTRICT_OPTIONS = [
  { value: '', label: 'All Districts' },
  { value: 'North District', label: 'North District' },
  { value: 'South District', label: 'South District' },
  { value: 'East District', label: 'East District' },
  { value: 'West District', label: 'West District' },
  { value: 'Central District', label: 'Central District' }
];

export const ClientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceLevelFilter, setServiceLevelFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Calculate statistics
  const stats = useMemo(() => {
    const activeClients = MOCK_CLIENTS.filter(c => c.status === 'Active').length;
    const pendingClients = MOCK_CLIENTS.filter(c => c.status === 'Pending').length;
    const clientsWithAlerts = MOCK_CLIENTS.filter(c => c.hasAlerts).length;
    const staffOnDuty = 45; // Mock data
    
    return {
      activeClients,
      staffOnDuty,
      pendingClients,
      activeAlerts: clientsWithAlerts
    };
  }, []);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = MOCK_CLIENTS.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.postcode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || 
                           (statusFilter === 'HasAlerts' ? client.hasAlerts : client.status === statusFilter);
      
      const matchesServiceLevel = !serviceLevelFilter || 
                                 client.serviceLevel.toString() === serviceLevelFilter;
      
      const matchesDistrict = !districtFilter || client.district === districtFilter;
      
      return matchesSearch && matchesStatus && matchesServiceLevel && matchesDistrict;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'startDate' || sortField === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, statusFilter, serviceLevelFilter, districtFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClients.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const paginatedClients = filteredAndSortedClients.slice(startIndex, startIndex + parseInt(entriesPerPage));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getServiceLevelBadge = (level: number) => {
    const colors = {
      0: 'bg-gray-100 text-gray-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[level as keyof typeof colors]}`}>
        SL {level}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Discharged': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Client Management</h1>
            <p className="text-gray-600">Manage client profiles and care plans</p>
          </div>
          
          <ActionButton
            label="Add New Client"
            icon={<Plus size={16} />}
            variant="primary"
            size="md"
            onClick={() => console.log('Navigate to add client')}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Clients"
          value={stats.activeClients}
          icon={<Users size={20} />}
          color="blue"
          onClick={() => console.log('View active clients')}
        />
        <StatCard
          title="Staff on Duty"
          value={stats.staffOnDuty}
          icon={<UserCheck size={20} />}
          color="green"
          onClick={() => console.log('View staff on duty')}
        />
        <StatCard
          title="Pending"
          value={stats.pendingClients}
          icon={<Clock size={20} />}
          color="yellow"
          onClick={() => console.log('View pending clients')}
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={<AlertTriangle size={20} />}
          color="red"
          onClick={() => console.log('View active alerts')}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search clients by name or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[150px]"
            />
            <Select
              options={SERVICE_LEVEL_OPTIONS}
              value={serviceLevelFilter}
              onChange={(e) => setServiceLevelFilter(e.target.value)}
              className="min-w-[150px]"
            />
            <Select
              options={DISTRICT_OPTIONS}
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="min-w-[150px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select
              options={ENTRIES_PER_PAGE_OPTIONS}
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(e.target.value);
                setCurrentPage(1);
              }}
              className="w-20"
            />
            <span className="text-sm text-gray-600">entries</span>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + parseInt(entriesPerPage), filteredAndSortedClients.length)} of {filteredAndSortedClients.length} entries
          </div>
        </div>
      </div>

      {/* Client Data Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="name">Client Info</SortableHeader>
                <SortableHeader field="startDate">Start Date</SortableHeader>
                <SortableHeader field="endDate">End Date</SortableHeader>
                <SortableHeader field="district">District</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          {client.hasAlerts && (
                            <AlertTriangle size={16} className="text-red-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age {client.age} • {client.postcode}
                        </div>
                        <div className="mt-1">
                          {getServiceLevelBadge(client.serviceLevel)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(client.startDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(client.endDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(client.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<User size={16} />}
                        onClick={() => console.log('View profile', client.id)}
                        className="p-2"
                      >
                        <span className="sr-only">View Profile</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Bell size={16} />}
                        onClick={() => console.log('View alerts', client.id)}
                        className="p-2"
                      >
                        <span className="sr-only">View Alerts</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pill size={16} />}
                        onClick={() => console.log('View EMAR', client.id)}
                        className="p-2"
                      >
                        <span className="sr-only">View EMAR</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  icon={<ChevronLeft size={16} />}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant={currentPage === totalPages ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  icon={<ChevronRight size={16} />}
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};