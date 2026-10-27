import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'เลือกรายการ',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-black font-bold text-sm flex items-center justify-between gap-3 shadow-[2px_2px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? 'ring-2 ring-black' : ''
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono font-normal">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-700 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-black' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000000] py-1 max-h-60 overflow-y-auto no-scrollbar animate-in fade-in-50 zoom-in-95 duration-150">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-xs text-neutral-400 text-center font-bold">
              ไม่มีตัวเลือก
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-3.5 py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-black text-white hover:bg-neutral-800'
                      : 'text-black hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon}
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-normal ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-200'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] ml-2 flex-shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
