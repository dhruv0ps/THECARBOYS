import React, { useState } from 'react';

type MultiSelectDropdownProps = {
  options: string[];
  value: string[];
  placeholder?: string;
  onChange: (selectedOptions: string[]) => void;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, value, placeholder, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown open/close
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle item selection
  const handleSelect = (item: string) => {
    if (!value.includes(item)) {
      const updatedItems = [...value, item];
      onChange(updatedItems); // Pass the updated selection to the parent component
      setIsOpen(false); // Close the dropdown after selecting an item
    }
  };

  // Handle removing a selected item
  const handleRemove = (item: string) => {
    const updatedItems = value.filter((i) => i !== item);
    onChange(updatedItems); // Pass the updated selection to the parent component
  };

  return (
    <div className="relative w-full md:w-80">
      {/* Dropdown Trigger */}
      <div
        className="border border-gray-300 p-2 rounded cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span>{value.length ? `${value.length} selected` : placeholder}</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto z-10">
          {options.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {/* Selected Items Display */}
      <div className="flex flex-wrap gap-2 mt-3">
        {value.map((item) => (
          <div
            key={item}
            className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center"
          >
            <span>{item}</span>
            <button
              className="ml-2 focus:outline-none"
              onClick={() => handleRemove(item)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
