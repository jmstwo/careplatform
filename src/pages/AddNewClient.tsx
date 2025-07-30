import { ArrowLeft, ArrowRight, MapPin, User, Heart, FileText, Edit2, Calendar, Clock, Plus, X, Search, Copy, Shield, Brain, Check } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { PostcodeLookup } from '../components/molecules/PostcodeLookup';
import { format, differenceInDays, differenceInWeeks } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'; 
import { MultiSelect } from '../components/atoms/MultiSelect';

const CARE_LEVELS = [
  {
    id: 1,
    name: 'Service Level 1',
    visits: 2,
    defaultSkills: ['End of Life Care', 'Mental Health'],
    description: '2 daily visits'
  },
  {
    id: 2,
    name: 'Service Level 2',
    visits: 3,
    defaultSkills: ['End of Life Care', 'Medication Management', 'Dementia Care'],
    description: '3 daily visits'
  },
  {
    id: 3,
    name: 'Service Level 3',
    visits: 4,
    defaultSkills: ['End of Life Care', 'Medication Management', 'Dementia Care', 'Mobility Support'],
    description: '4 daily visits'
  },
  {
    id: 4,
    name: 'Service Level 4',
    visits: 0,
    defaultSkills: [],
    description: 'TBD visits'
  }
];

const ALL_SKILLS = [
  'Dementia Care',
  'First Aid',
  'Medication Management',
  'Mental Health',
  'Mobility Support',
  'Personal Care',
  'End of Life Care'
];

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'welsh', label: 'Welsh' },
  { value: 'polish', label: 'Polish' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'other', label: 'Other' }
];

const GENDER_PREFERENCES = [
  { value: '', label: 'No Preference' },
  { value: 'male', label: 'Male Carer' },
  { value: 'female', label: 'Female Carer' }
];

const DUMMY_CARERS = [
  { value: 'john-smith', label: 'John Smith' },
  { value: 'sarah-johnson', label: 'Sarah Johnson' },
  { value: 'michael-brown', label: 'Michael Brown' },
  { value: 'emma-davis', label: 'Emma Davis' },
  { value: 'james-wilson', label: 'James Wilson' },
  { value: 'lisa-taylor', label: 'Lisa Taylor' }
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface CareLevel {
  id: number;
  name: string;
  visits: number;
  defaultSkills: string[];
  description: string;
}

interface Visit {
  id: string;
  time: string;
  duration: number;
  period: 'AM' | 'PM';
  tasks: string[];
}

interface DaySchedule {
  day: string;
  visits: Visit[];
  enabled: boolean;
}

interface CareRequirementsData {
  district: string;
  careStartDate: string;
  careEndDate: string;
  selectedCareLevel: number | null;
  additionalSkills: string[];
  preferredCarer: boolean;
  carerLanguage: string;
  genderPreference: string;
  preferredCarerName: string;
  weeklySchedule: DaySchedule[];
  medicalConditions: string[];
  careNotes: string;
}

interface BasicInfoData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    county: string;
    postcode: string;
  };
  spokenLanguage: string;
  nextOfKin: {
    name: string;
    contactNumber: string;
    relationship: string;
  };
  registeredDoctor: {
    name: string;
    contactNumber: string;
  };
  otherResidents: string;
  keyBoxInfo: string;
  keyBoxLocation: string;
  preferredGender: string;
  preferredLanguage: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface AddNewClientProps {
  onNavigate: (path: string) => void;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'welsh', label: 'Welsh' },
  { value: 'scottish-gaelic', label: 'Scottish Gaelic' },
  { value: 'irish', label: 'Irish' },
  { value: 'polish', label: 'Polish' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'other', label: 'Other' }
];

const relationshipOptions = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'partner', label: 'Partner' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'mother', label: 'Mother' },
  { value: 'father', label: 'Father' },
  { value: 'sister', label: 'Sister' },
  { value: 'brother', label: 'Brother' },
  { value: 'friend', label: 'Friend' },
  { value: 'neighbour', label: 'Neighbour' },
  { value: 'other', label: 'Other' }
];

const preferredGenderOptions = [
  { value: '', label: 'No Preference' },
  { value: 'male', label: 'Male Carer' },
  { value: 'female', label: 'Female Carer' }
];

export const AddNewClient: React.FC<AddNewClientProps> = ({ onNavigate }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [skillSearch, setSkillSearch] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      county: '',
      postcode: ''
    },
    spokenLanguage: 'english',
    nextOfKin: {
      name: '',
      contactNumber: '',
      relationship: ''
    },
    registeredDoctor: {
      name: '',
      contactNumber: ''
    },
    otherResidents: '',
    keyBoxInfo: '',
    keyBoxLocation: '',
    preferredGender: '',
    preferredLanguage: ''
  });

  const [careRequirements, setCareRequirements] = useState<CareRequirementsData>({
    district: 'North District',
    careStartDate: '',
    careEndDate: '',
    selectedCareLevel: 1,
    additionalSkills: [],
    preferredCarer: false,
    carerLanguage: 'english',
    genderPreference: '',
    preferredCarerName: '',
    weeklySchedule: DAYS_OF_WEEK.map(day => ({
      day,
      visits: [],
      enabled: true 
    })),
    medicalConditions: [],
    careNotes: ''
  });

  // Calculate care duration
  const calculateDuration = () => {
    if (!careRequirements.careStartDate || !careRequirements.careEndDate) return '';
    
    const start = new Date(careRequirements.careStartDate);
    const end = new Date(careRequirements.careEndDate);
    const totalDays = differenceInDays(end, start);
    
    if (totalDays < 7) {
      return `${totalDays} days`;
    }
    
    const weeks = differenceInWeeks(end, start);
    const remainingDays = totalDays - (weeks * 7);
    
    if (remainingDays === 0) {
      return `${weeks} weeks`;
    }
    
    return `${weeks} weeks ${remainingDays} days`;
  };

  const generateDefaultVisits = (visitCount: number): Visit[] => {
    const visits: Visit[] = [];
    for (let i = 0; i < visitCount; i++) {
      const period: 'AM' | 'PM' = i < Math.ceil(visitCount / 2) ? 'AM' : 'PM';
      visits.push({
        id: `visit-${i}`,
        time: '',
        duration: 30,
        period,
        tasks: []
      });
    }
    return visits;
  };

  const handleCareLevel = (levelId: number) => {
    const careLevel = CARE_LEVELS.find(level => level.id === levelId);
    if (careLevel) {
      setCareRequirements(prev => ({
        ...prev,
        selectedCareLevel: levelId,
        additionalSkills: prev.additionalSkills.filter(skill => 
          !careLevel.defaultSkills.includes(skill)
        )
      }));
    }
  };

  const addSkill = (skill: string) => {
    if (!careRequirements.additionalSkills.includes(skill)) {
      setCareRequirements(prev => ({
        ...prev,
        additionalSkills: [...prev.additionalSkills, skill]
      }));
    }
    setSkillSearch('');
  };

  const removeSkill = (skill: string) => {
    setCareRequirements(prev => ({
      ...prev,
      additionalSkills: prev.additionalSkills.filter(s => s !== skill)
    }));
  };

  const getAvailableSkills = () => {
    const selectedLevel = CARE_LEVELS.find(level => level.id === careRequirements.selectedCareLevel);
    const usedSkills = selectedLevel ? selectedLevel.defaultSkills : [];
    
    return ALL_SKILLS.filter(skill => 
      !usedSkills.includes(skill) && 
      !careRequirements.additionalSkills.includes(skill) &&
      skill.toLowerCase().includes(skillSearch.toLowerCase())
    );
  };

  const getAllCurrentSkills = () => {
    const selectedLevel = CARE_LEVELS.find(level => level.id === careRequirements.selectedCareLevel);
    const defaultSkills = selectedLevel ? selectedLevel.defaultSkills : [];
    return [...defaultSkills, ...careRequirements.additionalSkills];
  };

  const addMedicalCondition = () => {
    if (conditionInput.trim() && !careRequirements.medicalConditions.includes(conditionInput.trim())) {
      setCareRequirements(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, conditionInput.trim()]
      }));
      setConditionInput('');
    }
  };

  const removeMedicalCondition = (condition: string) => {
    setCareRequirements(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter(c => c !== condition)
    }));
  };

  const copyDayToNext = (dayIndex: number) => {
    const sourceDay = careRequirements.weeklySchedule[dayIndex];
    const nextDayIndex = dayIndex + 1;
    
    // Only copy if there is a next day (not the last day of the week)
    if (nextDayIndex < careRequirements.weeklySchedule.length) {
      const newSchedule = careRequirements.weeklySchedule.map((day, index) => 
        index === nextDayIndex ? { ...day, visits: [...sourceDay.visits] } : day
      );
      setCareRequirements(prev => ({ ...prev, weeklySchedule: newSchedule }));
    }
  };

  const copyDayToAll = (dayIndex: number) => {
    const sourceDay = careRequirements.weeklySchedule[dayIndex];
    const newSchedule = careRequirements.weeklySchedule.map((day, index) => 
      index !== dayIndex ? { ...day, visits: [...sourceDay.visits] } : day
    );
    setCareRequirements(prev => ({ ...prev, weeklySchedule: newSchedule }));
  };

  // Update weekly schedule when care level changes
  useEffect(() => {
    if (careRequirements.selectedCareLevel) {
      const careLevel = CARE_LEVELS.find(level => level.id === careRequirements.selectedCareLevel);
      if (careLevel) {
        const newSchedule = careRequirements.weeklySchedule.map(daySchedule => ({
          ...daySchedule,
          visits: generateDefaultVisits(careLevel.visits)
        }));
        setCareRequirements(prev => ({ 
          ...prev, 
          weeklySchedule: newSchedule 
        }));
      }
    }
  }, [careRequirements.selectedCareLevel]);

  const validateBasicInfo = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields validation
    if (!basicInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!basicInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!basicInfo.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!basicInfo.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!basicInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!basicInfo.address.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    }
    if (!basicInfo.address.line1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }
    if (!basicInfo.nextOfKin.name.trim()) {
      newErrors.nextOfKinName = 'Next of kin name is required';
    }
    if (!basicInfo.nextOfKin.contactNumber.trim()) {
      newErrors.nextOfKinContact = 'Next of kin contact number is required';
    }
    if (!basicInfo.nextOfKin.relationship) {
      newErrors.nextOfKinRelationship = 'Relationship is required';
    }
    if (!basicInfo.registeredDoctor.name.trim()) {
      newErrors.doctorName = 'Registered doctor name is required';
    }
    if (!basicInfo.registeredDoctor.contactNumber.trim()) {
      newErrors.doctorContact = 'Doctor contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBasicInfo(prev => ({
        ...prev,
        [parent]: {
          ...((typeof prev[parent as keyof BasicInfoData] === 'object' && prev[parent as keyof BasicInfoData] !== null && !Array.isArray(prev[parent as keyof BasicInfoData]) ? prev[parent as keyof BasicInfoData] as object : {})),
          [child]: value
        }
      }));
    } else {
      setBasicInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddressSelect = (address: any) => {
    setBasicInfo(prev => ({
      ...prev,
      address: {
        line1: address.line_1 || '',
        line2: address.line_2 || '',
        city: address.post_town || '',
        county: address.county || '',
        postcode: address.postcode || prev.address.postcode
      }
    }));

    // Clear address-related errors
    setErrors(prev => ({
      ...prev,
      addressLine1: '',
      postcode: ''
    }));
  };

  const [skillDropdownOpen, setSkillDropdownOpen] = useState<boolean>(false);

  const updateVisitCount = (dayIndex: number, period: 'AM' | 'PM', count: number) => {
    setCareRequirements(prev => {
      const newSchedule = [...prev.weeklySchedule];
      const currentDay = newSchedule[dayIndex];

      const otherVisits = currentDay.visits.filter(v => v.period !== period);

      const newVisits = [
        ...otherVisits,
        ...Array(count).fill(null).map((_, index) => ({
          id: `visit-${period}-${index}`,
          time: '',
          duration: 30,
          period,
          tasks: []
        }))
      ];

      newSchedule[dayIndex] = {
        ...currentDay,
        visits: newVisits
      };

      return {
        ...prev,
        weeklySchedule: newSchedule
      };
    });
  };

  const handleNextTab = () => {
    if (currentTab === 1) {
      if (validateBasicInfo()) {
        setCurrentTab(2);
      }
    } else if (currentTab === 2) {
      setCurrentTab(3);
    }
  };

  const handlePreviousTab = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleCancel = () => {
    onNavigate('/');
  };

  const tabs = [
    { id: 1, label: 'Basic Information', icon: <User size={16} /> },
    { id: 2, label: 'Care Requirements', icon: <Heart size={16} /> },
    { id: 3, label: 'Additional Details', icon: <FileText size={16} /> }
  ];

  const ALL_TASKS = [
    'Medication',
    'Personal Care',
    'Meal Preparation',
    'Mobility Support',
    'Companionship',
    'Housekeeping',
    'Wound Care',
    'Toileting',
    'Other',
  ];

  // State for editing visits in the popup
  const [visitEdits, setVisitEdits] = useState<Visit[]>([]);
  useEffect(() => {
    if (editingDay) {
      const dayObj = careRequirements.weeklySchedule.find(d => d.day === editingDay);
      setVisitEdits(dayObj ? JSON.parse(JSON.stringify(dayObj.visits)) : []);
    }
  }, [editingDay]);

  // For MultiSelect options
  const ALL_TASK_OPTIONS = [
    { value: 'medication', label: 'Medication' },
    { value: 'personal-care', label: 'Personal Care' },
    { value: 'meal-preparation', label: 'Meal Preparation' },
    { value: 'mobility-support', label: 'Mobility Support' },
    { value: 'companionship', label: 'Companionship' },
    { value: 'housekeeping', label: 'Housekeeping' },
    { value: 'wound-care', label: 'Wound Care' },
    { value: 'toileting', label: 'Toileting' },
    { value: 'other', label: 'Other' },
  ];
  const ALL_SKILL_OPTIONS = ALL_SKILLS.map(skill => ({ value: skill, label: skill }));

  // Remove period dropdown, infer period from time
  const handleVisitChange = (index: number, field: keyof Visit, value: any) => {
    setVisitEdits(prev => prev.map((v, i) => {
      if (i !== index) return v;
      let updated = { ...v, [field]: value };
      return updated;
    }));
  };

  const handleTaskToggle = (visitIdx: number, task: string) => {
    setVisitEdits(prev => prev.map((v, i) => {
      if (i !== visitIdx) return v;
      const hasTask = v.tasks.includes(task);
      return {
        ...v,
        tasks: hasTask ? v.tasks.filter(t => t !== task) : [...v.tasks, task],
      };
    }));
  };

  const handleDeleteVisit = (index: number) => {
    setVisitEdits(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVisit = () => {
    setVisitEdits(prev => [
      ...prev,
      {
        id: `visit-${Date.now()}`,
        time: '',
        duration: 30,
        period: 'AM',
        tasks: [],
      },
    ]);
  };

  const handleSaveVisits = () => {
    setCareRequirements(prev => ({
      ...prev,
      weeklySchedule: prev.weeklySchedule.map(day =>
        day.day === editingDay ? { ...day, visits: visitEdits } : day
      ),
    }));
    setEditingDay(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 add-client-page">
      
      <div className="mx-auto add-client-container">
        {/* Header */}
            {/* Back Button */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleCancel}
              icon={<ArrowLeft size={16} />}
              iconPosition="left"
              className="mb-6 hover:-translate-x-0.5 back-button"
            >
              Back
            </Button>

        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 rounded-tr-xl rounded-tl-xl page-header">
          <div className="px-4 py-4 sm:px-6 header-content">
        

            {/* Main Heading */}
            <div className="mb-6 main-heading-section">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Add New Client</h1>
              <p className="text-sm sm:text-base text-gray-600">Complete the client registration process</p>
            </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center pb-4 progress-indicator-section">
            <div className="flex items-center space-x-2 w-full sm:space-x-4 progress-tabs">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <div className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all w-full justify-center duration-200 min-h-[44px] ${
                  currentTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : currentTab > tab.id 
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                } tab-item`}>
                  <div className="flex-shrink-0">
                    {tab.icon}
                  </div>
                  <span className="font-medium text-xs sm:text-sm hidden sm:inline">{tab.label}</span>
                  <span className="font-medium text-xs sm:hidden">{tab.id}</span>
                </div>
                {index < tabs.length - 1 && (
                  <div className={`w-4 sm:w-8 h-0.5 transition-colors duration-200 tab-connector ${
                    currentTab > tab.id ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
            </div>
          </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white form-content">
          {currentTab === 1 && (
            <div className="p-4 sm:p-6 basic-info-tab">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3 section-title">Basic Information</h2>
              
              <div className="space-y-6 form-sections">
                {/* Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 personal-details-section">
                  <Input
                    label="First Name *"
                    value={basicInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={errors.firstName}
                    placeholder="Enter first name"
                  />
                  <Input
                    label="Last Name *"
                    value={basicInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={errors.lastName}
                    placeholder="Enter last name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 personal-info-grid">
                  <Input
                    label="Date of Birth *"
                    type="date"
                    value={basicInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    error={errors.dateOfBirth}
                  />
                  <Select
                    label="Gender *"
                    options={genderOptions}
                    value={basicInfo.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    error={errors.gender}
                    placeholder="Select Gender"
                  />
                  <Input
                    label="Phone Number *"
                    type="tel"
                    value={basicInfo.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    error={errors.phoneNumber}
                    placeholder="e.g., 07123 456789"
                  />
                </div>

                {/* Address Section */}
                <div className="border-t border-gray-100 pt-6 address-section">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2 subsection-title">
                    <MapPin size={16} />
                    Address Information
                  </h3>
                  
                  <div className="postcode-lookup-wrapper">
                    <PostcodeLookup
                    onAddressSelect={handleAddressSelect}
                    postcode={basicInfo.address.postcode}
                    onPostcodeChange={(postcode) => handleInputChange('address.postcode', postcode)}
                    error={errors.postcode}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 address-lines-grid">
                    <Input
                      label="Address Line 1 *"
                      value={basicInfo.address.line1}
                      onChange={(e) => handleInputChange('address.line1', e.target.value)}
                      error={errors.addressLine1}
                      placeholder="House number and street name"
                    />
                    <Input
                      label="Address Line 2"
                      value={basicInfo.address.line2}
                      onChange={(e) => handleInputChange('address.line2', e.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 city-county-grid">
                    <Input
                      label="City/Town"
                      value={basicInfo.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      placeholder="City or town"
                    />
                    <Input
                      label="County"
                      value={basicInfo.address.county}
                      onChange={(e) => handleInputChange('address.county', e.target.value)}
                      placeholder="County"
                    />
                  </div>
                </div>

                {/* Language */}
                <div className="border-t border-gray-100 pt-6 language-section">
                  <Select
                    label="Spoken Language *"
                    options={languageOptions}
                    value={basicInfo.spokenLanguage}
                    onChange={(e) => handleInputChange('spokenLanguage', e.target.value)}
                  />
                </div>

                {/* Next of Kin */}
                <div className="border-t border-gray-100 pt-6 next-of-kin-section">
                  <h3 className="text-base font-medium text-gray-900 mb-4 subsection-title">Next of Kin / Emergency Contact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 next-of-kin-grid">
                    <Input
                      label="Name *"
                      value={basicInfo.nextOfKin.name}
                      onChange={(e) => handleInputChange('nextOfKin.name', e.target.value)}
                      error={errors.nextOfKinName}
                      placeholder="Full name"
                    />
                    <Input
                      label="Contact Number *"
                      type="tel"
                      value={basicInfo.nextOfKin.contactNumber}
                      onChange={(e) => handleInputChange('nextOfKin.contactNumber', e.target.value)}
                      error={errors.nextOfKinContact}
                      placeholder="Phone number"
                    />
                    <Select
                      label="Relationship *"
                      options={relationshipOptions}
                      value={basicInfo.nextOfKin.relationship}
                      onChange={(e) => handleInputChange('nextOfKin.relationship', e.target.value)}
                      error={errors.nextOfKinRelationship}
                      placeholder="Select Relationship"
                    />
                  </div>
                </div>

                {/* Registered Doctor */}
                <div className="border-t border-gray-100 pt-6 doctor-section">
                  <h3 className="text-base font-medium text-gray-900 mb-4 subsection-title">Registered Doctor</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 doctor-info-grid">
                    <Input
                      label="Doctor Name *"
                      value={basicInfo.registeredDoctor.name}
                      onChange={(e) => handleInputChange('registeredDoctor.name', e.target.value)}
                      error={errors.doctorName}
                      placeholder="Dr. Full Name"
                    />
                    <Input
                      label="Contact Number *"
                      type="tel"
                      value={basicInfo.registeredDoctor.contactNumber}
                      onChange={(e) => handleInputChange('registeredDoctor.contactNumber', e.target.value)}
                      error={errors.doctorContact}
                      placeholder="Surgery phone number"
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="border-t border-gray-100 pt-6 additional-info-section">
                  <h3 className="text-base font-medium text-gray-900 mb-4 subsection-title">Additional Information (Optional)</h3>
                  <div className="space-y-4 additional-fields">
                    <Input
                      label="Other Residents/Pets"
                      value={basicInfo.otherResidents}
                      onChange={(e) => handleInputChange('otherResidents', e.target.value)}
                      placeholder="List other people or pets in the household"
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 key-info-grid">
                      <Input
                        label="Key Box/Access Info"
                        value={basicInfo.keyBoxInfo}
                        onChange={(e) => handleInputChange('keyBoxInfo', e.target.value)}
                        placeholder="Key safe code or access instructions"
                      />
                      <Input
                        label="Key Box Location"
                        value={basicInfo.keyBoxLocation}
                        onChange={(e) => handleInputChange('keyBoxLocation', e.target.value)}
                        placeholder="Where is the key box located?"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 preferences-grid">
                      <Select
                        label="Preferred Carer Gender"
                        options={preferredGenderOptions}
                        value={basicInfo.preferredGender}
                        onChange={(e) => handleInputChange('preferredGender', e.target.value)}
                      />
                      <Select
                        label="Preferred Communication Language"
                        options={languageOptions}
                        value={basicInfo.preferredLanguage}
                        onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 2 && (
            <div className="p-4 sm:p-6 care-requirements-tab">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3 section-title">Care Requirements</h2>
              
              <div className="space-y-6 form-sections">
                {/* Client Assignment Section */}
                <div className="care-requirements__section bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-blue-600" />
                      <p className="text-gray-900">
                        Based upon client's home location, this client will be assigned to{' '}
                        <span className="font-semibold text-blue-600">{careRequirements.district}</span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 size={16} />}
                      onClick={() => console.log('Edit district')}
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Care Duration Section */}
                <div className="care-requirements__section bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Care Duration
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Care Start Date *"
                      type="date"
                      value={careRequirements.careStartDate}
                      onChange={(e) => setCareRequirements(prev => ({ ...prev, careStartDate: e.target.value }))}
                    />
                    <Input
                      label="Care End Date *"
                      type="date"
                      value={careRequirements.careEndDate}
                      onChange={(e) => setCareRequirements(prev => ({ ...prev, careEndDate: e.target.value }))}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Care Duration
                      </label>
                      <div className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 min-h-[44px] flex items-center">
                        <span className="text-gray-900">
                          {calculateDuration() || 'Select dates'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Care Level Selection */}
                <div className="care-requirements__section bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Heart size={20} />
                    Care Level Selection
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CARE_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => handleCareLevel(level.id)}
                        className={`care-level__button p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          careRequirements.selectedCareLevel === level.id
                            ? 'care-level__button--selected border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{level.name}</h4>
                          <span className="text-sm text-gray-600">({level.description})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {level.defaultSkills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Management */}
                {careRequirements.selectedCareLevel && (
                  <div className="care-requirements__section bg-white rounded-lg p-6 border border-gray-100">
                    <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Shield size={20} />
                      Care Skills & Requirements
                    </h3>
                    
                    {/* Current Skills Display */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Current Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {getAllCurrentSkills().map((skill) => {
                          const isDefault = CARE_LEVELS.find(l => l.id === careRequirements.selectedCareLevel)?.defaultSkills.includes(skill);
                          return (
                            <span
                              key={skill}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                isDefault 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {skill}
                              {!isDefault && (
                                <button
                                  onClick={() => removeSkill(skill)}
                                  className="ml-2 text-green-600 hover:text-green-800"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add Additional Skills */}
              {/* Add Additional Skills - Multi-Select */}
              <div>
      {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Add Additional Skills:</h4> */}
      <MultiSelect
        label="Add Additional Skills:"
        options={ALL_SKILL_OPTIONS}
        value={careRequirements.additionalSkills}
        onChange={skills => setCareRequirements(prev => ({ ...prev, additionalSkills: skills }))}
        placeholder="Select additional skills..."
      />
    </div>
  </div>
)}


                {/* Carer Preferences Section */}
                <div className="care-requirements__section bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} />
                    Carer Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Preferred Carer Toggle */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Preferred Carer:</label>
                      <div className="flex gap-2">
                        <Button
                          variant={careRequirements.preferredCarer ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setCareRequirements(prev => ({ ...prev, preferredCarer: true }))}
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!careRequirements.preferredCarer ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setCareRequirements(prev => ({ ...prev, preferredCarer: false }))}
                        >
                          No
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Carer Language"
                        options={LANGUAGES}
                        value={careRequirements.carerLanguage}
                        onChange={(e) => setCareRequirements(prev => ({ ...prev, carerLanguage: e.target.value }))}
                      />
                      <Select
                        label="Gender Preference"
                        options={GENDER_PREFERENCES}
                        value={careRequirements.genderPreference}
                        onChange={(e) => setCareRequirements(prev => ({ ...prev, genderPreference: e.target.value }))}
                      />
                    </div>

                    {careRequirements.preferredCarer && (
                      <Select
                        label="Preferred Carer Name"
                        options={DUMMY_CARERS}
                        value={careRequirements.preferredCarerName}
                        onChange={(e) => setCareRequirements(prev => ({ ...prev, preferredCarerName: e.target.value }))}
                        placeholder="Select a carer"
                      />
                    )}
                  </div>
                </div>

                {/* Weekly Schedule Management */}
                {careRequirements.selectedCareLevel && (
                  <div className="care-requirements__section bg-white rounded-lg p-6 border border-gray-100">
                    <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Clock size={20} />
                      Weekly Schedule
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 ">
                      {careRequirements.weeklySchedule.map((daySchedule, index) => (
                        <div
                          key={daySchedule.day}
                          className={`weekly-schedule__day border rounded-lg p-3 relative ${
                            daySchedule.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-xs sm:text-sm text-gray-900">
                              {window.innerWidth < 640 ? daySchedule.day.slice(0, 3) : daySchedule.day}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Edit2 size={12} />}
                              onClick={() => setEditingDay(daySchedule.day)}
                              className="p-1 absolute top-[2px] right-0 hover:border-transparent hover:bg-transparent hover:text-primary-600"
                            >
                              {''}
                            </Button>
                          </div>
                          
                          <div className="flex mb-3 gap-2 ">
                            <div className="text-xs text-gray-600 flex items-center gap-1 flex-col">
                              AM:      <input
            type="number"
            min={0}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center w-full"
            value={daySchedule.visits.filter(v => v.period === 'AM').length}
            onChange={(e) => updateVisitCount(index, 'AM', parseInt(e.target.value) || 0)}
          />
                            </div>
                            <div className="text-xs text-gray-600 flex items-center gap-1 flex-col">
                              PM: 
                              <input
            type="number"
            min={0}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center w-full"
            value={daySchedule.visits.filter(v => v.period === 'PM').length}
            onChange={(e) => updateVisitCount(index, 'PM', parseInt(e.target.value) || 0)}
          />
    
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Copy size={10} />}
                              onClick={() => copyDayToNext(index)}
                              
                              className="w-full text-xs p-1"
                            >
                              Copy →
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Copy size={10} />}
                              onClick={() => copyDayToAll(index)}
                              className="w-full text-xs p-1"
                            >
                              Copy All
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="care-requirements__section bg-white rounded-lg p-6 border border-gray-100">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Brain size={20} />
                    Additional Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Medical Conditions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical Conditions
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Enter medical condition"
                          value={conditionInput}
                          onChange={(e) => setConditionInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addMedicalCondition()}
                        />
                        <Button
                          variant="primary"
                          size="md"
                          icon={<Plus size={16} />}
                          onClick={addMedicalCondition}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {careRequirements.medicalConditions.map((condition) => (
                          <span
                            key={condition}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800"
                          >
                            {condition}
                            <button
                              onClick={() => removeMedicalCondition(condition)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Care Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Care Plan/Notes
                      </label>
                      <textarea
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[120px] placeholder:text-gray-400"
                        placeholder="Enter detailed care plan notes, special instructions, or important information..."
                        value={careRequirements.careNotes}
                        onChange={(e) => setCareRequirements(prev => ({ ...prev, careNotes: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 3 && (
            <div className="p-4 sm:p-6 additional-details-tab">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3 section-title">Additional Details</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center placeholder-content">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Details Section</h3>
                <p className="text-gray-600">
                  This section will contain additional client details and documentation.
                  Specifications for this tab are pending and will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 sticky bottom-0 form-actions">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 action-buttons-container">
              <div className="previous-button-wrapper">
                {currentTab > 1 && (
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
                
                {currentTab < 3 ? (
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
                    onClick={() => console.log('Save client')}
                    fullWidth={true}
                    className="sm:w-auto order-1 sm:order-2 save-button"
                  >
                    Save Client
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Edit Modal */}
      {editingDay && (
        <div className="visit-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="visit-modal__content bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="visit-modal__header p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit {editingDay} Schedule
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={16} />}
                  onClick={() => setEditingDay(null)}
                >
                  {''}
                </Button>
              </div>
            </div>
            <div className="visit-modal__body p-6">
              <div className="space-y-6">
                {visitEdits.length === 0 && (
                  <div className="text-gray-500 text-center">No visits scheduled for this day.</div>
                )}
                {visitEdits.map((visit, idx) => (
                  <div key={visit.id} className="bg-gray-50 rounded-lg p-2 mb-2 border border-gray-200 flex flex-col sm:flex-row items-center gap-2 relative">
                    <div className="flex-1 grid grid-cols-[auto_1fr_1fr_1fr] gap-3 items-baseline">
                    <div className="flex items-center justify-center pl-2 pr-2 ">
                        <span className="text-xs text-gray-500 bg-gray-100 px-1 py-1 border border-gray-200 rounded-md min-h-[20px] flex items-center">
                          {visit.period || '-'}
                        </span>
                      </div>
                      
                      <Input
                        label="Time"
                        type="time"
                        value={visit.time}
                        onChange={e => handleVisitChange(idx, 'time', e.target.value)}
                      />
                     
                      <Input
                        label="Duration (min)"
                        type="number"
                        min={1}
                        value={visit.duration}
                        onChange={e => handleVisitChange(idx, 'duration', parseInt(e.target.value) || 0)}
                        className=""
                      />
                      <MultiSelect
                        label="Tasks"
                        options={ALL_TASK_OPTIONS}
                        value={visit.tasks}
                        onChange={tasks => handleVisitChange(idx, 'tasks', tasks)}
                        placeholder="Select tasks..."
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVisit(idx)}
                      icon={<Trash2 size={16} />}
                      aria-label="Delete visit"
                      className="mt-0 text-gray-400 hover:border-transparent hover:bg-transparent hover:text-primary-600"
                    >
                      {''}
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={handleAddVisit} icon={<Plus size={16} />}>Add Visit</Button>
              </div>
            </div>
            <div className="visit-modal__footer p-6 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setEditingDay(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveVisits}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};