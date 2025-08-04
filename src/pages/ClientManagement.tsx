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
  ChevronRight,
  X,
  Edit2,
  Settings,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Activity
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
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  medicalConditions: string[];
  careNotes: string;
}

type SortField = 'name' | 'age' | 'startDate' | 'endDate' | 'district' | 'status' | 'serviceLevel';
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
    hasAlerts: true,
    phone: '0114 123 4567',
    email: 'sarah.johnson@email.com',
    address: '123 Main Street, Sheffield, S1 2HE',
    emergencyContact: 'John Johnson (Son) - 0114 987 6543',
    medicalConditions: ['Diabetes', 'Hypertension'],
    careNotes: 'Requires assistance with medication management and mobility support.'
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
    hasAlerts: false,
    phone: '0114 234 5678',
    email: 'michael.brown@email.com',
    address: '456 Oak Avenue, Sheffield, S10 3AB',
    emergencyContact: 'Emma Brown (Daughter) - 0114 876 5432',
    medicalConditions: ['Arthritis'],
    careNotes: 'Independent with most activities, requires help with heavy lifting.'
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
    hasAlerts: true,
    phone: '0114 345 6789',
    email: 'emma.wilson@email.com',
    address: '789 Elm Road, Sheffield, S11 8QR',
    emergencyContact: 'David Wilson (Son) - 0114 765 4321',
    medicalConditions: ['Dementia', 'Heart Disease'],
    careNotes: 'Requires 24/7 supervision and specialized dementia care.'
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
    hasAlerts: false,
    phone: '0114 456 7890',
    email: 'james.davis@email.com',
    address: '321 Pine Street, Sheffield, S2 4DF',
    emergencyContact: 'Mary Davis (Wife) - 0114 654 3210',
    medicalConditions: ['Recovered from surgery'],
    careNotes: 'Successfully completed rehabilitation program.'
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
    hasAlerts: false,
    phone: '0114 567 8901',
    email: 'lisa.taylor@email.com',
    address: '654 Birch Lane, Sheffield, S3 7GH',
    emergencyContact: 'Robert Taylor (Husband) - 0114 543 2109',
    medicalConditions: ['Osteoporosis', 'Vision Impairment'],
    careNotes: 'Needs assistance with reading and navigation.'
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
    hasAlerts: true,
    phone: '0114 678 9012',
    email: 'robert.miller@email.com',
    address: '987 Cedar Court, Sheffield, S4 5JK',
    emergencyContact: 'Susan Miller (Daughter) - 0114 432 1098',
    medicalConditions: ['COPD', 'Mobility Issues'],
    careNotes: 'Requires oxygen therapy and mobility assistance.'
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'care' | 'emar' | 'incidents' | 'alerts'>('basic');

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
      0: 'bg-gray-100 text-gray-700 border-gray-200',
      1: 'bg-blue-50 text-blue-700 border-blue-200',
      2: 'bg-orange-50 text-orange-700 border-orange-200',
      3: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colors[level as keyof typeof colors]}`}>
        SL {level}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-50 text-green-700 border-green-200',
      'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Discharged': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  const handleClientAction = (client: Client, action: 'profile' | 'alerts' | 'emar') => {
    setSelectedClient(client);
    switch (action) {
      case 'profile':
        setActiveTab('basic');
        break;
      case 'alerts':
        setActiveTab('alerts');
        break;
      case 'emar':
        setActiveTab('emar');
        break;
    }
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode; className?: string }> = ({ field, children, className = "" }) => (
    <th 
      className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors select-none ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          <div className="text-blue-600">
            {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        )}
      </div>
    </th>
  );

  const ClientProfileModal: React.FC = () => {
    if (!selectedClient) return null;

    const tabs = [
      { id: 'basic', label: 'Basic Details', icon: <User size={16} /> },
      { id: 'care', label: 'Care Requirements', icon: <FileText size={16} /> },
      { id: 'emar', label: 'EMAR', icon: <Pill size={16} /> },
      { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={16} /> },
      { id: 'alerts', label: 'Alerts/Log', icon: <Bell size={16} /> },
      { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Modal Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h2>
                  <p className="text-sm text-gray-600">Age {selectedClient.age} • {selectedClient.postcode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit2 size={16} />}
                  onClick={() => console.log('Edit client')}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={20} />}
                  onClick={() => setSelectedClient(null)}
                  className="p-2"
                >
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 mt-4 bg-gray-50 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User size={20} />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-900">{selectedClient.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Phone size={16} />
                          {selectedClient.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Mail size={16} />
                          {selectedClient.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Age</label>
                        <p className="text-gray-900">{selectedClient.age} years old</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Postcode</label>
                        <p className="text-gray-900">{selectedClient.postcode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin size={20} />
                      Address & Care Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Address</label>
                        <p className="text-gray-900">{selectedClient.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">District</label>
                        <p className="text-gray-900">{selectedClient.district}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Service Level</label>
                        <div className="mt-1">
                          {getServiceLevelBadge(selectedClient.serviceLevel)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">
                          {getStatusBadge(selectedClient.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Period</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Start Date</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Calendar size={16} />
                        {format(new Date(selectedClient.startDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">End Date</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Calendar size={16} />
                        {format(new Date(selectedClient.endDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <p className="text-gray-900">{selectedClient.emergencyContact}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.medicalConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedClient.careNotes}</p>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Care Requirements</h3>
                  <p className="text-gray-600">Detailed care requirements and schedule information would be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'emar' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">EMAR Records</h3>
                  <p className="text-gray-600">Electronic Medication Administration Records would be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'incidents' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Incident History</h3>
                  <p className="text-gray-600">Client incident reports and history would be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Alerts & Activity Log</h3>
                  <p className="text-gray-600">System alerts and activity logs would be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Management */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Settings size={20} />
                      Status Management
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Status
                        </label>
                        <div className="mb-3">
                          {getStatusBadge(selectedClient.status)}
                        </div>
                        <Select
                          label="Change Status"
                          options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Pending', label: 'Pending' },
                            { value: 'Discharged', label: 'Discharged' },
                            { value: 'On Hold', label: 'On Hold' },
                            { value: 'Suspended', label: 'Suspended' }
                          ]}
                          value={selectedClient.status}
                          onChange={(e) => console.log('Status change:', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Level
                        </label>
                        <div className="mb-3">
                          {getServiceLevelBadge(selectedClient.serviceLevel)}
                        </div>
                        <Select
                          label="Change Service Level"
                          options={[
                            { value: '0', label: 'Service Level 0' },
                            { value: '1', label: 'Service Level 1' },
                            { value: '2', label: 'Service Level 2' },
                            { value: '3', label: 'Service Level 3' }
                          ]}
                          value={selectedClient.serviceLevel.toString()}
                          onChange={(e) => console.log('Service level change:', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Carer Restrictions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users size={20} />
                      Carer Restrictions
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender Preference
                        </label>
                        <Select
                          options={[
                            { value: '', label: 'No Preference' },
                            { value: 'male', label: 'Male Carer Only' },
                            { value: 'female', label: 'Female Carer Only' }
                          ]}
                          value=""
                          onChange={(e) => console.log('Gender preference:', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language Requirements
                        </label>
                        <Select
                          options={[
                            { value: 'english', label: 'English' },
                            { value: 'welsh', label: 'Welsh' },
                            { value: 'polish', label: 'Polish' },
                            { value: 'urdu', label: 'Urdu' },
                            { value: 'other', label: 'Other' }
                          ]}
                          value="english"
                          onChange={(e) => console.log('Language requirement:', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Carer
                        </label>
                        <Select
                          options={[
                            { value: '', label: 'No Preference' },
                            { value: 'john-smith', label: 'John Smith' },
                            { value: 'sarah-johnson', label: 'Sarah Johnson' },
                            { value: 'michael-brown', label: 'Michael Brown' },
                            { value: 'emma-davis', label: 'Emma Davis' }
                          ]}
                          value=""
                          onChange={(e) => console.log('Preferred carer:', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            onChange={(e) => console.log('Restrict unfamiliar carers:', e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">Restrict unfamiliar carers</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Care Notes Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Care Notes & Instructions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Enter any special care instructions or notes..."
                        defaultValue={selectedClient.careNotes}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => console.log('Save care notes')}
                      >
                        Save Notes
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => console.log('Reset changes')}
                  >
                    Reset Changes
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => console.log('Save all settings')}
                  >
                    Save All Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
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

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search and Filters - Redesigned */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search clients by name or postcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={16} />}
                  className="bg-white"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <Select
                  options={STATUS_FILTER_OPTIONS}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="min-w-[140px] bg-white"
                />
                <Select
                  options={SERVICE_LEVEL_OPTIONS}
                  value={serviceLevelFilter}
                  onChange={(e) => setServiceLevelFilter(e.target.value)}
                  className="min-w-[140px] bg-white"
                />
                <Select
                  options={DISTRICT_OPTIONS}
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="min-w-[140px] bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Show</span>
                <Select
                  options={ENTRIES_PER_PAGE_OPTIONS}
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-20 bg-white"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">entries</span>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + parseInt(entriesPerPage), filteredAndSortedClients.length)} of {filteredAndSortedClients.length} entries
              </div>
              {(searchTerm || statusFilter || serviceLevelFilter || districtFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setServiceLevelFilter('');
                    setDistrictFilter('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Client Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader field="name">Client Name</SortableHeader>
                <SortableHeader field="age">Age</SortableHeader>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Postcode
                </th>
                <SortableHeader field="serviceLevel">Service Level</SortableHeader>
                <SortableHeader field="startDate">Start Date</SortableHeader>
                <SortableHeader field="endDate">End Date</SortableHeader>
                <SortableHeader field="district">District</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleClientAction(client, 'profile')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {client.name}
                      </button>
                      {client.hasAlerts && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.postcode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getServiceLevelBadge(client.serviceLevel)}
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
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<User size={16} />}
                        onClick={() => handleClientAction(client, 'profile')}
                        className="p-2 hover:bg-blue-50 hover:text-blue-600"
                        title="View Profile"
                      >
                        <span className="sr-only">View Profile</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Bell size={16} />}
                        onClick={() => handleClientAction(client, 'alerts')}
                        className="p-2 hover:bg-yellow-50 hover:text-yellow-600"
                        title="View Alerts"
                      >
                        <span className="sr-only">View Alerts</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pill size={16} />}
                        onClick={() => handleClientAction(client, 'emar')}
                        className="p-2 hover:bg-green-50 hover:text-green-600"
                        title="View EMAR"
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
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  icon={<ChevronLeft size={16} />}
                  className="border border-gray-300"
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
                        className={`w-10 h-10 p-0 ${currentPage !== pageNum ? 'border border-gray-300' : ''}`}
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
                        className={`w-10 h-10 p-0 ${currentPage !== totalPages ? 'border border-gray-300' : ''}`}
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
                  className="border border-gray-300"
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

      {/* Client Profile Modal */}
      <ClientProfileModal />
    </div>
  );
};