/**
 * ProfileModal organism component
 *
 * A reusable modal for displaying user or profile information, following Atomic Design principles.
 *
 * @component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {() => void} onClose - Function to close the modal
 * @param {object} userData - Data for the profile (can be any shape)
 * @param {React.ReactNode} children - Custom content to render inside the modal
 *
 * @example
 * <ProfileModal isOpen={open} onClose={handleClose} userData={user}>
 *   <div>Custom content here</div>
 * </ProfileModal>
 */
import React from 'react';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: any;
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  children,
  title = 'Profile',
  actions
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 profile-modal__backdrop">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl profile-modal__container">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white profile-modal__header">
          <div className="text-xl font-semibold text-gray-900 profile-modal__title">{title}</div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none profile-modal__close"
            aria-label="Close"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] profile-modal__content">
          {children}
        </div>
        {/* Modal Actions */}
        {actions && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 profile-modal__actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}; 