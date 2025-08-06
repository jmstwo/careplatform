import React from 'react';
import { ActionButton } from '../components/molecules/ActionButton';
import { ROUTES } from '../utils/constants';
import { 
  Plus
} from 'lucide-react';

interface StaffManagementProps {
  onNavigate?: (path: string) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Staff Management</h1>
        <p className="text-gray-600">Staff management functionality will be implemented here.</p>
        <div className="mt-4">
          <ActionButton
            label="Add New Staff"
            icon={<Plus size={16} />}
            variant="primary"
            size="md"
            onClick={() => {
              console.log('Navigating to:', ROUTES.ADD_STAFF);
              onNavigate(ROUTES.ADD_STAFF);
            }}
          />
        </div>
      </div>
    </div>
  );
};