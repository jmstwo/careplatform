import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Clock, 
  Car,
  Users,
  Phone,
  Mail,
  Globe,
  Edit2,
  X,
  Plus,
  Minus,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { MultiSelect } from '../components/atoms/MultiSelect';
import { PostcodeLookup } from '../components/molecules/PostcodeLookup';
import { format } from 'date-fns';

interface Address {
  line_1: string;
  line_2?: string;
  line_3?: string;
  post_town: string;
  county: string;
  postcode: string;
  country: string;
  formatted_address: string[];
}

interface DaySchedule {
  day: string;
  am: boolean;
  pm: boolean;
  customTimes?: {
    startTime: string;
    endTime: string;
  };
}

interface StaffData {
  // Personal Details
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  phone: string;
  email: string;
  spokenLanguages: string[];
  
  // Address
  postcode: string;
  selectedAddress: Address | null;
  manualAddress: {
    line1: string;
    line2: string;
    city: string;
    county: string;
    postcode: string;
  };
  
  // Work Details
  joinDate: string;
  leaveDate: string;
  preferredDistrict: string;
  vehicleNumber: string;
  availability: string;
  preferredShifts: string;
  weeklySchedule: DaySchedule[];
}

const ROLES = [
  { value: '', label: 'Select Role' },
  { value: 'carer', label: 'Carer' },
  { value: 'planner-admin', label: 'Planner/Admin' },
  { value: 'assessor', label: 'Assessor' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'on-leave', label: 'On Leave' },
  { value: 'sick-leave', label: 'Sick Leave' },
  { value: 'inactive', label: 'Inactive' }
];

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'welsh', label: 'Welsh' },
  { value: 'polish', label: 'Polish' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'hindi', label: 'Hindi' }
];

const DISTRICTS = [
  { value: '', label: 'Select District' },
  { value: 'north', label: 'North District' },
  { value: 'south', label: 'South District' },
  { value: 'east', label: 'East District' },
  { value: 'west', label: 'West District' },
  { value: 'central', label: 'Central District' }
];

const AVAILABILITY_OPTIONS = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' }
];

const PREFERRED_SHIFTS_OPTIONS = [
  { value: '', label: 'Select Preferred Shift' },
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
  { value: 'Both', label: 'Both' }
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface AddNewStaffProps {
  onNavigate?: (path: string) => void;
}

export const AddNewStaff: React.FC<AddNewStaffProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [customTimes, setCustomTimes] = useState({ startTime: '', endTime: '' });
  
  const [data, setData] = useState<StaffData>({
    // Personal Details
    firstName: '',
    lastName: '',
    role: '',
    status: 'active',
    phone: '',
    email: '',
    spokenLanguages: ['english'],
    
    // Address
    postcode: '',
    selectedAddress: null,
    manualAddress: {
      line1: '',
      line2: '',
      city: '',
      county: '',
      postcode: ''
    },
    
    // Work Details
    joinDate: '',
    leaveDate: '',
    preferredDistrict: '',
    vehicleNumber: '',
    availability: 'full-time',
    preferredShifts: '',
    weeklySchedule: DAYS_OF_WEEK.map(day => ({
      day,
      am: false,
      pm: false
    }))
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTimesOpen, setCustomTimesOpen] = useState(false);

  // Add a ref for the form content
  const formContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Update weekly schedule when preferred shifts change
  React.useEffect(() => {
    const newSchedule = data.weeklySchedule.map(daySchedule => ({
      ...daySchedule,
      am: data.preferredShifts === 'AM' || data.preferredShifts === 'Both',
      pm: data.preferredShifts === 'PM' || data.preferredShifts === 'Both'
    }));
    
    setData(prev => ({ ...prev, weeklySchedule: newSchedule }));
  }, [data.preferredShifts]);

  const handleAddressSelect = (address: Address) => {
    setData(prev => ({
      ...prev,
      selectedAddress: address,
      postcode: address.postcode
    }));
    setErrors(prev => ({ ...prev, postcode: '' }));
  };

  const handleDayScheduleChange = (dayIndex: number, period: 'am' | 'pm', checked: boolean) => {
    setData(prev => ({
      ...prev,
      weeklySchedule: prev.weeklySchedule.map((day, index) =>
        index === dayIndex ? { ...day, [period]: checked } : day
      )
    }));
  };

  const handleCustomTimesSave = () => {
    if (editingDay && customTimes.startTime && customTimes.endTime) {
      const dayIndex = DAYS_OF_WEEK.indexOf(editingDay);
      setData(prev => ({
        ...prev,
        weeklySchedule: prev.weeklySchedule.map((day, index) =>
          index === dayIndex 
            ? { 
                ...day, 
                customTimes: { 
                  startTime: customTimes.startTime, 
                  endTime: customTimes.endTime 
                } 
              }
            : day
        )
      }));
    }
    setEditingDay(null);
    setCustomTimes({ startTime: '', endTime: '' });
  };

  const validatePersonalDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.role) newErrors.role = 'Role is required';
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email is invalid';
    if (!data.postcode.trim()) newErrors.postcode = 'Postcode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateWorkDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.joinDate) newErrors.joinDate = 'Join date is required';
    if (!data.preferredDistrict) newErrors.preferredDistrict = 'Preferred district is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    let isValid = true;
    
    if (activeTab === 'personal') {
      isValid = validatePersonalDetails();
    } else {
      isValid = validateWorkDetails();
    }
    
    if (isValid) {
      console.log('Staff data:', data);
      // Handle form submission
    }
  };

  const handleNextTab = () => {
    if (activeTab === 'personal') {
      if (validatePersonalDetails()) {
        setActiveTab('work');
      }
    } else if (activeTab === 'work') {
      setActiveTab('additional');
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === 'work') {
      setActiveTab('personal');
    } else if (activeTab === 'additional') {
      setActiveTab('work');
    }
  };

  const handleCancel = () => {
    onNavigate?.('/staff-management');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User size={16} /> },
    { id: 'work', label: 'Work Details', icon: <Briefcase size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 add-staff-page">
      
      <div className="mx-auto add-staff-container">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 rounded-tr-xl rounded-tl-xl page-header">
          <div className="px-4 py-4 sm:px-6 header-content">
        

            {/* Main Heading */}
            <div className="mb-6 main-heading-section">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Add New Staff Member</h1>
              <p className="text-sm sm:text-base text-gray-600">Complete the staff registration process</p>
            </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center pb-4 progress-indicator-section">
            <div className="flex items-center space-x-2 w-full sm:space-x-4 progress-tabs">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all w-full justify-center duration-200 min-h-[44px] ${
                    activeTab === tab.id 
                      ? 'bg-primary-600 text-white shadow-sm' 
                      : activeTab > tab.id 
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                  } tab-item cursor-pointer`}
                  onClick={() => {
                    // Allow going back to any previous tab
                    if (tab.id < activeTab) {
                      setActiveTab(tab.id);
                    }
                    // Allow staying on current tab
                    else if (tab.id === activeTab) {
                      // Do nothing, already on this tab
                    }
                    // For forward navigation, validate current form
                    else if (tab.id > activeTab) {
                      if (activeTab === 'personal') {
                        if (validatePersonalDetails()) {
                          setActiveTab(tab.id);
                        }
                      }
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    {tab.icon}
                  </div>
                  <span className="font-medium text-xs sm:text-sm hidden sm:inline">{tab.label}</span>
                  <span className="font-medium text-xs sm:hidden">{index + 1}</span>
                </div>
                {index < tabs.length - 1 && (
                  <div className={`w-4 sm:w-8 h-0.5 transition-colors duration-200 tab-connector ${
                    activeTab > tab.id ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
            </div>
          </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white form-content" ref={formContentRef}>
          {activeTab === 'personal' && (
            <div className="p-4 sm:p-6 personal-details-tab">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3 section-title">Personal Details</h2>
              
              <div className="space-y-6 form-sections">
                {/* Basic Information */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      value={data.firstName}
                      onChange={(e) => setData(prev => ({ ...prev, firstName: e.target.value }))}
                      error={errors.firstName}
                      placeholder="Enter first name"
                    />
                    <Input
                      label="Last Name *"
                      value={data.lastName}
                      onChange={(e) => setData(prev => ({ ...prev, lastName: e.target.value }))}
                      error={errors.lastName}
                      placeholder="Enter last name"
                    />
                    <Select
                      label="Role *"
                      options={ROLES}
                      value={data.role}
                      onChange={(e) => setData(prev => ({ ...prev, role: e.target.value }))}
                      error={errors.role}
                    />
                    <Select
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={data.status}
                      onChange={(e) => setData(prev => ({ ...prev, status: e.target.value }))}
                    />
                    <Input
                      label="Phone *"
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData(prev => ({ ...prev, phone: e.target.value }))}
                      error={errors.phone}
                      placeholder="Enter phone number"
                      icon={<Phone size={16} />}
                    />
                    <Input
                      label="Email *"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                      error={errors.email}
                      placeholder="Enter email address"
                      icon={<Mail size={16} />}
                    />
                  </div>
                </div>
                  {/* Languages Section */}
                <div className="border-t border-gray-100 pt-6 languages-section">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Globe size={20} />
                    Spoken Languages
                  </h3>
                  
                  <MultiSelect
                    label="Languages"
                    options={LANGUAGE_OPTIONS}
                    value={data.spokenLanguages}
                    onChange={(languages) => setData(prev => ({ ...prev, spokenLanguages: languages }))}
                    placeholder="Select languages..."
                  />
                </div>

                {/* Address Section */}
                <div className="border-t border-gray-100 pt-6 address-section">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Address Information
                  </h3>
                  
                  <div className="postcode-lookup-wrapper">
                    <PostcodeLookup
                      onAddressSelect={handleAddressSelect}
                      postcode={data.postcode}
                      onPostcodeChange={(postcode) => setData(prev => ({ ...prev, postcode }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 address-lines-grid">
                    <Input
                      label="Address Line 1 *"
                      value={data.manualAddress.line1}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        manualAddress: { ...prev.manualAddress, line1: e.target.value }
                      }))}
                      placeholder="House number and street name"
                    />
                    <Input
                      label="Address Line 2"
                      value={data.manualAddress.line2}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        manualAddress: { ...prev.manualAddress, line2: e.target.value }
                      }))}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 city-county-grid">
                    <Input
                      label="City/Town"
                      value={data.manualAddress.city}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        manualAddress: { ...prev.manualAddress, city: e.target.value }
                      }))}
                      placeholder="City or town"
                    />
                    <Input
                      label="County"
                      value={data.manualAddress.county}
                      onChange={(e) => setData(prev => ({ 
                        ...prev, 
                        manualAddress: { ...prev.manualAddress, county: e.target.value }
                      }))}
                      placeholder="County"
                    />
                  </div>
                </div>

              
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="p-4 sm:p-6 work-details-tab">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3 section-title">Work Details</h2>
              
              <div className="space-y-6 form-sections">
                {/* Employment Details */}
                <div className="work-details__section bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} />
                    Employment Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Join Date *"
                      type="date"
                      value={data.joinDate}
                      onChange={(e) => setData(prev => ({ ...prev, joinDate: e.target.value }))}
                    />
                    <Input
                      label="Leave Date"
                      type="date"
                      value={data.leaveDate}
                      onChange={(e) => setData(prev => ({ ...prev, leaveDate: e.target.value }))}
                    />
                    <Select
                      label="Preferred District"
                      options={[
                        { value: '', label: 'Select District' },
                        { value: 'north', label: 'North District' },
                        { value: 'south', label: 'South District' },
                        { value: 'east', label: 'East District' },
                        { value: 'west', label: 'West District' },
                        { value: 'central', label: 'Central District' }
                      ]}
                      value={data.preferredDistrict}
                      onChange={(e) => setData(prev => ({ ...prev, preferredDistrict: e.target.value }))}
                    />
                    <Input
                      label="Vehicle Number"
                      value={data.vehicleNumber}
                      onChange={(e) => setData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      placeholder="Enter vehicle registration"
                      icon={<Car size={16} />}
                    />
                  </div>
                </div>

                {/* Availability Section */}
                <div className="work-details__section bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Availability & Schedule
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Availability"
                        options={[
                          { value: '', label: 'Select Availability' },
                          { value: 'full-time', label: 'Full Time' },
                          { value: 'part-time', label: 'Part Time' },
                        
                        ]}
                        value={data.availability}
                        onChange={(e) => setData(prev => ({ ...prev, availability: e.target.value }))}
                      />
                      <Select
                        label="Preferred Shifts"
                        options={[
                          { value: '', label: 'Select Shifts' },
                          { value: 'AM', label: 'AM' },
                          { value: 'PM', label: 'PM' },
                          { value: 'Both', label: 'Both' },
                          
                        ]}
                        value={data.preferredShifts}
                        onChange={(e) => setData(prev => ({ ...prev, preferredShifts: e.target.value }))}
                      />
                    </div>

                    {/* Weekly Schedule */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Schedule</h4>
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                        {data.weeklySchedule.map((daySchedule, index) => (
                          <div
                            key={daySchedule.day}
                            className="border border-gray-200 rounded-lg p-3 bg-white"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium text-sm text-gray-900">{daySchedule.day}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Edit2 size={14} />}
                                onClick={() => {
                                  setEditingDay(daySchedule.day);
                                  if (daySchedule.customTimes) {
                                    setCustomTimes(daySchedule.customTimes);
                                  }
                                }}
                                className="p-1"
                              >
                                {''}
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={daySchedule.am}
                                  onChange={(e) => handleDayScheduleChange(index, 'am', e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-xs text-gray-700">AM</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={daySchedule.pm}
                                  onChange={(e) => handleDayScheduleChange(index, 'pm', e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-xs text-gray-700">PM</span>
                              </label>
                            </div>

                            {daySchedule.customTimes && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                  Custom
                                </span>
                                <div className="text-xs text-gray-600 mt-1">
                                  {daySchedule.customTimes.startTime} - {daySchedule.customTimes.endTime}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 sticky bottom-0 form-actions">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 action-buttons-container">
              <div className="previous-button-wrapper">
                {activeTab !== 'personal' && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handlePreviousTab}
                    icon={<ArrowLeft size={16} />}
                    iconPosition="left"
                    fullWidth={true}
                    className="sm:w-auto previous-button"
                  >
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 main-action-buttons">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleCancel}
                  fullWidth={true}
                  className="sm:w-auto order-2 sm:order-1 cancel-button"
                >
                  Cancel
                </Button>
                
                {activeTab !== 'work' ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNextTab}
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                    fullWidth={true}
                    className="sm:w-auto order-1 sm:order-2 next-button"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="md"
                    onClick={handleSubmit}
                    fullWidth={true}
                    className="sm:w-auto order-1 sm:order-2 save-button"
                  >
                    Save Staff Member
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Times Modal */}
      {editingDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Custom Times - {editingDay}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={16} />}
                  onClick={() => {
                    setEditingDay(null);
                    setCustomTimes({ startTime: '', endTime: '' });
                  }}
                >
                  {''}
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={customTimes.startTime}
                  onChange={(e) => setCustomTimes(prev => ({ ...prev, startTime: e.target.value }))}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={customTimes.endTime}
                  onChange={(e) => setCustomTimes(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setEditingDay(null);
                    setCustomTimes({ startTime: '', endTime: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCustomTimesSave}
                  disabled={!customTimes.startTime || !customTimes.endTime}
                >
                  Save Times
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};