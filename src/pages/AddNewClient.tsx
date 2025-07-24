import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, User, Heart, FileText } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { PostcodeLookup } from '../components/molecules/PostcodeLookup';

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

const genderOptions = [
  { value: '', label: 'Select Gender' },
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
  { value: '', label: 'Select Relationship' },
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

export const AddNewClient: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
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
          ...prev[parent as keyof BasicInfoData],
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
    // Navigate back to client management or dashboard
    window.history.back();
  };

  const tabs = [
    { id: 1, label: 'Basic Information', icon: <User size={16} /> },
    { id: 2, label: 'Care Requirements', icon: <Heart size={16} /> },
    { id: 3, label: 'Additional Details', icon: <FileText size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              icon={<ArrowLeft size={16} />}
              className="text-gray-600 hover:text-gray-900"
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Add New Client</h1>
              <p className="text-gray-600">Complete the client registration process</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentTab === tab.id 
                    ? 'bg-primary-100 text-primary-700' 
                    : currentTab > tab.id 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.icon}
                  <span className="font-medium text-sm">{tab.label}</span>
                </div>
                {index < tabs.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentTab > tab.id ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl border border-gray-100">
          {currentTab === 1 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="border-t pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={16} />
                    Address Information
                  </h3>
                  
                  <PostcodeLookup
                    onAddressSelect={handleAddressSelect}
                    postcode={basicInfo.address.postcode}
                    onPostcodeChange={(postcode) => handleInputChange('address.postcode', postcode)}
                    error={errors.postcode}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                <div className="border-t pt-6">
                  <Select
                    label="Spoken Language *"
                    options={languageOptions}
                    value={basicInfo.spokenLanguage}
                    onChange={(e) => handleInputChange('spokenLanguage', e.target.value)}
                  />
                </div>

                {/* Next of Kin */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Next of Kin / Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    />
                  </div>
                </div>

                {/* Registered Doctor */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Registered Doctor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="border-t pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Additional Information (Optional)</h3>
                  <div className="space-y-4">
                    <Input
                      label="Other Residents/Pets"
                      value={basicInfo.otherResidents}
                      onChange={(e) => handleInputChange('otherResidents', e.target.value)}
                      placeholder="List other people or pets in the household"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Care Requirements</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Care Requirements Section</h3>
                <p className="text-gray-600">
                  This section will contain detailed care requirements and assessment forms.
                  The EMAR system will provide specific data requirements for implementation.
                </p>
              </div>
            </div>
          )}

          {currentTab === 3 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Details</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
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
          <div className="border-t border-gray-100 p-6">
            <div className="flex justify-between">
              <div>
                {currentTab > 1 && (
                  <Button
                    variant="secondary"
                    onClick={handlePreviousTab}
                    icon={<ArrowLeft size={16} />}
                    iconPosition="left"
                  >
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                
                {currentTab < 3 ? (
                  <Button
                    variant="primary"
                    onClick={handleNextTab}
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={() => console.log('Save client')}
                  >
                    Save Client
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};