import React, { useState, useEffect } from 'react';
import { 
  Edit2, 
  Calendar, 
  Clock, 
  Plus, 
  Minus, 
  X, 
  Search,
  Copy,
  MapPin,
  User,
  Heart,
  Shield,
  Brain,
  Pill,
  Users,
  Home
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { format, differenceInDays, differenceInWeeks } from 'date-fns';

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

const CARE_LEVELS: CareLevel[] = [
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

const COMMON_TASKS = [
  'Light breakfast',
  'Medication',
  'Transfer bed to chair',
  'Personal hygiene',
  'Mobility assistance',
  'Meal preparation',
  'Companionship',
  'Safety check'
];

export const CareRequirements: React.FC = () => {
  const [data, setData] = useState<CareRequirementsData>({
    district: 'North District',
    careStartDate: '',
    careEndDate: '',
    selectedCareLevel: null,
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

  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [skillSearch, setSkillSearch] = useState('');
  const [conditionInput, setConditionInput] = useState('');

  // Calculate care duration
  const calculateDuration = () => {
    if (!data.careStartDate || !data.careEndDate) return '';
    
    const start = new Date(data.careStartDate);
    const end = new Date(data.careEndDate);
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

  // Update weekly schedule when care level changes
  useEffect(() => {
    if (data.selectedCareLevel) {
      const careLevel = CARE_LEVELS.find(level => level.id === data.selectedCareLevel);
      if (careLevel) {
        const newSchedule = data.weeklySchedule.map(daySchedule => ({
          ...daySchedule,
          visits: generateDefaultVisits(careLevel.visits)
        }));
        setData(prev => ({ ...prev, weeklySchedule: newSchedule }));
      }
    }
  }, [data.selectedCareLevel]);

  const generateDefaultVisits = (visitCount: number): Visit[] => {
    const visits: Visit[] = [];
    
    for (let i = 0; i < visitCount; i++) {
      const period = i < Math.ceil(visitCount / 2) ? 'AM' : 'PM';
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
      setData(prev => ({
        ...prev,
        selectedCareLevel: levelId,
        additionalSkills: prev.additionalSkills.filter(skill => 
          !careLevel.defaultSkills.includes(skill)
        )
      }));
    }
  };

  const addSkill = (skill: string) => {
    if (!data.additionalSkills.includes(skill)) {
      setData(prev => ({
        ...prev,
        additionalSkills: [...prev.additionalSkills, skill]
      }));
    }
    setSkillSearch('');
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      additionalSkills: prev.additionalSkills.filter(s => s !== skill)
    }));
  };

  const getAvailableSkills = () => {
    const selectedLevel = CARE_LEVELS.find(level => level.id === data.selectedCareLevel);
    const usedSkills = selectedLevel ? selectedLevel.defaultSkills : [];
    
    return ALL_SKILLS.filter(skill => 
      !usedSkills.includes(skill) && 
      !data.additionalSkills.includes(skill) &&
      skill.toLowerCase().includes(skillSearch.toLowerCase())
    );
  };

  const getAllCurrentSkills = () => {
    const selectedLevel = CARE_LEVELS.find(level => level.id === data.selectedCareLevel);
    const defaultSkills = selectedLevel ? selectedLevel.defaultSkills : [];
    return [...defaultSkills, ...data.additionalSkills];
  };

  const addMedicalCondition = () => {
    if (conditionInput.trim() && !data.medicalConditions.includes(conditionInput.trim())) {
      setData(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, conditionInput.trim()]
      }));
      setConditionInput('');
    }
  };

  const removeMedicalCondition = (condition: string) => {
    setData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter(c => c !== condition)
    }));
  };

  const copyDayToRemaining = (dayIndex: number) => {
    const sourceDay = data.weeklySchedule[dayIndex];
    const newSchedule = data.weeklySchedule.map((day, index) => 
      index > dayIndex ? { ...day, visits: [...sourceDay.visits] } : day
    );
    setData(prev => ({ ...prev, weeklySchedule: newSchedule }));
  };

  const copyDayToAll = (dayIndex: number) => {
    const sourceDay = data.weeklySchedule[dayIndex];
    const newSchedule = data.weeklySchedule.map((day, index) => 
      index !== dayIndex ? { ...day, visits: [...sourceDay.visits] } : day
    );
    setData(prev => ({ ...prev, weeklySchedule: newSchedule }));
  };

  return (
    <div className="care-requirements min-h-screen bg-gray-50 pb-20">
      <div className="care-requirements__container max-w-4xl mx-auto p-6">
        
        {/* Page Header */}
        <div className="care-requirements__header bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Care Requirements</h1>
          <p className="text-gray-600">Configure care settings and schedule for the client</p>
        </div>

        {/* Client Assignment Section */}
        <div className="care-requirements__section bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <div className="care-requirements__assignment flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-600" />
              <p className="text-gray-900">
                Based upon client's home location, this client will be assigned to{' '}
                <span className="font-semibold text-blue-600">{data.district}</span>
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
        <div className="care-requirements__section bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Care Duration
          </h2>
          
          <div className="care-duration__fields grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Care Start Date"
              type="date"
              value={data.careStartDate}
              onChange={(e) => setData(prev => ({ ...prev, careStartDate: e.target.value }))}
            />
            <Input
              label="Care End Date"
              type="date"
              value={data.careEndDate}
              onChange={(e) => setData(prev => ({ ...prev, careEndDate: e.target.value }))}
            />
            <div className="care-duration__display">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Care Duration
              </label>
              <div className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 min-h-[44px] flex items-center">
                <span className="text-gray-900 font-medium">
                  {calculateDuration() || 'Select dates'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Care Level Selection */}
        <div className="care-requirements__section bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart size={20} />
            Care Level Selection
          </h2>
          
          <div className="care-level__grid grid grid-cols-1 md:grid-cols-2 gap-4">
            {CARE_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => handleCareLevel(level.id)}
                className={`care-level__button p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  data.selectedCareLevel === level.id
                    ? 'care-level__button--selected border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{level.name}</h3>
                  <span className="text-sm text-gray-600">({level.description})</span>
                </div>
                <div className="care-level__skills flex flex-wrap gap-1">
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
        {data.selectedCareLevel && (
          <div className="care-requirements__section bg-white rounded-xl p-6 border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={20} />
              Care Skills & Requirements
            </h2>
            
            {/* Current Skills Display */}
            <div className="skills__current mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {getAllCurrentSkills().map((skill) => {
                  const isDefault = CARE_LEVELS.find(l => l.id === data.selectedCareLevel)?.defaultSkills.includes(skill);
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
            <div className="skills__add">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Add Additional Skills:</h3>
              <div className="relative">
                <Input
                  placeholder="Search for skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  icon={<Search size={16} />}
                />
                {skillSearch && getAvailableSkills().length > 0 && (
                  <div className="skills__dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                    {getAvailableSkills().map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Carer Preferences */}
        <div className="care-requirements__section bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={20} />
            Carer Preferences
          </h2>
          
          <div className="carer-preferences__fields space-y-4">
            {/* Preferred Carer Toggle */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Preferred Carer:</label>
              <div className="flex gap-2">
                <Button
                  variant={data.preferredCarer ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setData(prev => ({ ...prev, preferredCarer: true }))}
                >
                  Yes
                </Button>
                <Button
                  variant={!data.preferredCarer ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setData(prev => ({ ...prev, preferredCarer: false }))}
                >
                  No
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Carer Language"
                options={LANGUAGES}
                value={data.carerLanguage}
                onChange={(e) => setData(prev => ({ ...prev, carerLanguage: e.target.value }))}
              />
              <Select
                label="Gender Preference"
                options={GENDER_PREFERENCES}
                value={data.genderPreference}
                onChange={(e) => setData(prev => ({ ...prev, genderPreference: e.target.value }))}
              />
            </div>

            {data.preferredCarer && (
              <Select
                label="Preferred Carer Name"
                options={DUMMY_CARERS}
                value={data.preferredCarerName}
                onChange={(e) => setData(prev => ({ ...prev, preferredCarerName: e.target.value }))}
                placeholder="Select a carer"
              />
            )}
          </div>
        </div>

        {/* Weekly Schedule */}
        {data.selectedCareLevel && (
          <div className="care-requirements__section bg-white rounded-xl p-6 border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Weekly Schedule
            </h2>
            
            <div className="weekly-schedule__grid grid grid-cols-1 md:grid-cols-7 gap-4">
              {data.weeklySchedule.map((daySchedule, index) => (
                <div
                  key={daySchedule.day}
                  className={`weekly-schedule__day border rounded-lg p-3 ${
                    daySchedule.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-gray-900">{daySchedule.day}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 size={14} />}
                      onClick={() => setEditingDay(daySchedule.day)}
                      className="p-1"
                    />
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="text-xs text-gray-600">
                      AM: {daySchedule.visits.filter(v => v.period === 'AM').length} visits
                    </div>
                    <div className="text-xs text-gray-600">
                      PM: {daySchedule.visits.filter(v => v.period === 'PM').length} visits
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Copy size={12} />}
                      onClick={() => copyDayToRemaining(index)}
                      className="w-full text-xs"
                    >
                      Copy to remaining
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Copy size={12} />}
                      onClick={() => copyDayToAll(index)}
                      className="w-full text-xs"
                    >
                      Copy to all
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="care-requirements__section bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain size={20} />
            Additional Information
          </h2>
          
          <div className="additional-info__fields space-y-4">
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
                {data.medicalConditions.map((condition) => (
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[120px] placeholder:text-gray-400"
                placeholder="Enter detailed care plan notes, special instructions, or important information..."
                value={data.careNotes}
                onChange={(e) => setData(prev => ({ ...prev, careNotes: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="care-requirements__actions bg-white rounded-xl p-6 border border-gray-100 sticky bottom-6">
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
                onClick={() => console.log('Cancel')}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => console.log('Save care requirements', data)}
              >
                Save Care Requirements
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Edit Modal */}
      {editingDay && (
        <div className="visit-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="visit-modal__content bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                />
              </div>
            </div>
            
            <div className="visit-modal__body p-6">
              <p className="text-gray-600 mb-4">
                Configure visit times and tasks for {editingDay}
              </p>
              
              {/* This would contain the detailed visit editing interface */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600">
                  Detailed visit editing interface would be implemented here with:
                </p>
                <ul className="text-sm text-gray-500 mt-2 space-y-1">
                  <li>• Editable time fields for each visit</li>
                  <li>• Duration adjustment controls</li>
                  <li>• Task assignment with searchable multi-select</li>
                  <li>• Add/delete visit functionality</li>
                </ul>
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
                  onClick={() => setEditingDay(null)}
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