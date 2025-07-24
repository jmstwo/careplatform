import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, AlertCircle } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

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

interface PostcodeLookupProps {
  onAddressSelect: (address: Address) => void;
  postcode: string;
  onPostcodeChange: (postcode: string) => void;
  error?: string;
}

export const PostcodeLookup: React.FC<PostcodeLookupProps> = ({
  onAddressSelect,
  postcode,
  onPostcodeChange,
  error
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showAddresses, setShowAddresses] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);

  // Mock API function - In production, replace with actual UK postcode API
  const searchPostcode = async (postcodeQuery: string): Promise<Address[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data for demonstration - replace with actual API call
    if (postcodeQuery.toLowerCase().includes('sw1a')) {
      return [
        {
          line_1: '10 Downing Street',
          line_2: '',
          line_3: '',
          post_town: 'London',
          county: 'Greater London',
          postcode: 'SW1A 2AA',
          country: 'England',
          formatted_address: ['10 Downing Street', 'London', 'SW1A 2AA']
        },
        {
          line_1: '11 Downing Street',
          line_2: '',
          line_3: '',
          post_town: 'London',
          county: 'Greater London',
          postcode: 'SW1A 2AB',
          country: 'England',
          formatted_address: ['11 Downing Street', 'London', 'SW1A 2AB']
        }
      ];
    } else if (postcodeQuery.toLowerCase().includes('m1')) {
      return [
        {
          line_1: '1 Manchester Road',
          line_2: '',
          line_3: '',
          post_town: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M1 1AA',
          country: 'England',
          formatted_address: ['1 Manchester Road', 'Manchester', 'M1 1AA']
        },
        {
          line_1: '2 Manchester Road',
          line_2: 'Apartment 1',
          line_3: '',
          post_town: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M1 1AB',
          country: 'England',
          formatted_address: ['2 Manchester Road', 'Apartment 1', 'Manchester', 'M1 1AB']
        }
      ];
    } else if (postcodeQuery.trim()) {
      // Return empty array for other postcodes to simulate "no results"
      return [];
    }
    
    return [];
  };

  const handlePostcodeSearch = async () => {
    if (!postcode.trim()) {
      setSearchError('Please enter a postcode');
      return;
    }

    setLoading(true);
    setSearchError('');
    setAddresses([]);

    try {
      const results = await searchPostcode(postcode);
      
      if (results.length === 0) {
        setSearchError('No addresses found for this postcode. Please check the postcode or enter address manually.');
        setManualEntry(true);
      } else {
        setAddresses(results);
        setShowAddresses(true);
        setManualEntry(false);
      }
    } catch (err) {
      setSearchError('Unable to search postcode. Please enter address manually.');
      setManualEntry(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    onAddressSelect(address);
    setShowAddresses(false);
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    setShowAddresses(false);
    setSearchError('');
  };

  // Auto-search when postcode is entered (UK postcodes are typically 6-8 characters)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (postcode.length >= 5 && postcode.length <= 8 && !showAddresses) {
        handlePostcodeSearch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [postcode]);

  return (
    <div className="space-y-4">
      {/* Postcode Search */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            label="Postcode *"
            value={postcode}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              onPostcodeChange(value);
              setShowAddresses(false);
              setSearchError('');
            }}
            error={error || searchError}
            placeholder="e.g., SW1A 2AA"
            icon={<MapPin size={16} />}
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="primary"
            onClick={handlePostcodeSearch}
            loading={loading}
            disabled={!postcode.trim()}
            icon={<Search size={16} />}
            className="mb-1"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Address Results */}
      {showAddresses && addresses.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <MapPin size={14} />
              Select an address ({addresses.length} found)
            </h4>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {addresses.map((address, index) => (
              <button
                key={index}
                onClick={() => handleAddressSelect(address)}
                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="text-sm text-gray-900">
                  {address.formatted_address.join(', ')}
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleManualEntry}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Can't find your address? Enter manually
            </button>
          </div>
        </div>
      )}

      {/* Manual Entry Option */}
      {(searchError || manualEntry) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Manual Address Entry
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                {searchError || 'You can enter the address details manually below.'}
              </p>
              <button
                onClick={() => {
                  setManualEntry(false);
                  setSearchError('');
                  setShowAddresses(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to postcode search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Information Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              UK Postcode Lookup Implementation
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              This component demonstrates UK postcode lookup functionality. For production use, integrate with:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Ideal API:</strong> Royal Mail PAF (Postcode Address File) - Most accurate, requires license</li>
              <li>• <strong>Alternative:</strong> Postcodes.io - Free, open-source UK postcode API</li>
              <li>• <strong>Commercial:</strong> GetAddress.io, Loqate, or SmartyStreets for enhanced features</li>
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              Current implementation uses mock data for demonstration. Try postcodes: SW1A, M1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};