
import React from 'react';

interface ToggleSwitchProps {
  isEnabled: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isEnabled,
  onChange,
  label,
  disabled = false
}) => {
  return (
    <div className="flex items-center">
      {label && (
        <label className="mr-2 text-sm text-gray-600">{label}</label>
      )}
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${isEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
        aria-pressed={isEnabled}
      >
        <span
          className={`${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
