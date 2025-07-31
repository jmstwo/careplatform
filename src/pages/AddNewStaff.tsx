import React, { useState } from 'react';
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
  Check
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
  preferredShifts: string[];
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

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface AddNewStaffProps {
  onNavigate?: (path: string) => void;
}

export const AddNewStaff: React.FC<AddNewStaffProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'work'>('personal');
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
    preferredShifts: [],
    weeklySchedule: DAYS_OF_WEEK.map(day => ({
      day,
      am: false,
      pm: false
    }))
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update weekly schedule when preferred shifts change
  React.useEffect(() => {
    const newSchedule = data.weeklySchedule.map(daySchedule => ({
      ...daySchedule,
      am: data.preferredShifts.includes('AM') || data.preferredShifts.includes('Both'),
      pm: data.preferredShifts.includes('PM') || data.preferredShifts.includes('Both')
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

  const handlePreferredShiftsChange = (shift: string) => {
    setData(prev => {
      const currentShifts = prev.preferredShifts;
      let newShifts: string[];
      
      if (shift === 'Both') {
        newShifts = currentShifts.includes('Both') ? [] : ['Both'];
      } else {
        if (currentShifts.includes('Both')) {
          newShifts = [shift];
        } else if (currentShifts.includes(shift)) {
          newShifts = currentShifts.filter(s => s !== shift);
        } else {
          newShifts = [...currentShifts.filter(s => s !== 'Both'), shift];
          if (newShifts.includes('AM') && newShifts.includes('PM')) {
            newShifts = ['Both'];
          }
        }
      }
      
      return { ...prev, preferredShifts: newShifts };
    });
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
    if (validatePersonalDetails()) {
      setActiveTab('work');
    }
  };

  return (
    <div className="add-new-staff min-h-screen bg-gray-50 pb-20">
      <div className="add-new-staff__container max-w-4xl mx-auto p-6">
        
        {/* Page Header */}
        <div className="add-new-staff__header bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Add New Staff Member</h1>
          <p className="text-gray-600">Enter staff member details and work preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="add-new-staff__tabs bg-white rounded-xl border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User size={16} />
                Personal Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'work'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Briefcase size={16} />
                Work Details
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="add-new-staff__section">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} />
                    Basic Information
                  </h2>
                  
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

                  <div className="mt-4">
                    <MultiSelect
                      label="Spoken Languages"
                      options={LANGUAGE_OPTIONS}
                      value={data.spokenLanguages}
                      onChange={(languages) => setData(prev => ({ ...prev, spokenLanguages: languages }))}
                      placeholder="Select languages"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="add-new-staff__section">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Address Information
                  </h2>
                  
                  <PostcodeLookup
                    postcode={data.postcode}
                    onPostcodeChange={(postcode) => setData(prev => ({ ...prev, postcode }))}
                    onAddressSelect={handleAddressSelect}
                    error={errors.postcode}
                  />

                  {data.selectedAddress && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                        <Check size={16} />
                        Selected Address
                      </h4>
                      <p className="text-sm text-green-700">
                        {data.selectedAddress.formatted_address.join(', ')}
                      </p>
                    </div>
                  )}

                  {(!data.selectedAddress && data.postcode) && (
                    <div className="mt-4 space-y-4">
                      <h4 className="text-sm font-medium text-gray-700">Manual Address Entry</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Address Line 1"
                          value={data.manualAddress.line1}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            manualAddress: { ...prev.manualAddress, line1: e.target.value }
                          }))}
                          placeholder="Enter address line 1"
                        />
                        <Input
                          label="Address Line 2"
                          value={data.manualAddress.line2}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            manualAddress: { ...prev.manualAddress, line2: e.target.value }
                          }))}
                          placeholder="Enter address line 2"
                        />
                        <Input
                          label="City"
                          value={data.manualAddress.city}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            manualAddress: { ...prev.manualAddress, city: e.target.value }
                          }))}
                          placeholder="Enter city"
                        />
                        <Input
                          label="County"
                          value={data.manualAddress.county}
                          onChange={(e) => setData(prev => ({
                            ...prev,
                            manualAddress: { ...prev.manualAddress, county: e.target.value }
                          }))}
                          placeholder="Enter county"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'work' && (
              <div className="space-y-6">
                {/* Employment Information */}
                <div className="add-new-staff__section">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} />
                    Employment Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Join Date *"
                      type="date"
                      value={data.joinDate}
                      onChange={(e) => setData(prev => ({ ...prev, joinDate: e.target.value }))}
                      error={errors.joinDate}
                    />
                    <Input
                      label="Leave Date"
                      type="date"
                      value={data.leaveDate}
                      onChange={(e) => setData(prev => ({ ...prev, leaveDate: e.target.value }))}
                    />
                    <Select
                      label="Preferred District *"
                      options={DISTRICTS}
                      value={data.preferredDistrict}
                      onChange={(e) => setData(prev => ({ ...prev, preferredDistrict: e.target.value }))}
                      error={errors.preferredDistrict}
                    />
                    <Input
                      label="Vehicle Number"
                      value={data.vehicleNumber}
                      onChange={(e) => setData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      placeholder="Enter vehicle number"
                      icon={<Car size={16} />}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Availability *
                    </label>
                    <div className="flex gap-4">
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="availability"
                            value={option.value}
                            checked={data.availability === option.value}
                            onChange={(e) => setData(prev => ({ ...prev, availability: e.target.value }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Shifts
                    </label>
                    <div className="flex gap-4">
                      {['AM', 'PM', 'Both'].map((shift) => (
                        <label key={shift} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={data.preferredShifts.includes(shift)}
                            onChange={() => handlePreferredShiftsChange(shift)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{shift}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Work Schedule */}
                <div className="add-new-staff__section">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Work Schedule
                  </h2>
                  
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
                          />
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
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="add-new-staff__actions bg-white rounded-xl p-6 border border-gray-100 sticky bottom-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => console.log('Save as draft')}
            >
              Save as Draft
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => onNavigate?.('/staff-management')}
              >
                Cancel
              </Button>
              
              {activeTab === 'personal' ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextTab}
                >
                  Next: Work Details
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                >
                  Add Staff Member
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Times Modal */}
      {editingDay && (
        <div className="custom-times-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="custom-times-modal__content bg-white rounded-xl max-w-md w-full">
            <div className="custom-times-modal__header p-6 border-b border-gray-200">
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
                />
              </div>
            </div>
            
            <div className="custom-times-modal__body p-6">
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
            
            <div className="custom-times-modal__footer p-6 border-t border-gray-200">
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