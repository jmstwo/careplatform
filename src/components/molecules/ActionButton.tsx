import React from 'react';
import { Button } from '../atoms/Button';
import { ActionButtonProps } from '../../types';

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  variant,
  size,
  onClick,
  disabled = false
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      icon={icon}
      iconPosition="left"
    >
      {label}
    </Button>
  );
};