import React, { useState } from "react";

type Option = {
  value: string;
  label: string;
};

type ObjectMultiSelectDropdownProps = {
  options: Option[]; // All available options
  value: string[]; // Array of selected labels
  placeholder?: string;
  onChange: (selectedOptions: string[]) => void; // Updates selected labels
};

const ObjectMultiSelectDropdown: React.FC<ObjectMultiSelectDropdownProps> = ({
  options,
  value,
  placeholder = "Select options",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(!isOpen);
  };

  const handleSelect = (selectedLabel: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    if (!value.includes(selectedLabel)) {
      onChange([...value, selectedLabel]); // Add selected label to value
    }
  };

  const handleRemove = (selectedLabel: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    onChange(value.filter((label) => label !== selectedLabel)); // Remove the label
  };

  return (
    <div className="relative w-full md:w-80" onClick={(e) => e.stopPropagation()}>
      {/* Dropdown Trigger */}
      <div
        className="border border-gray-300 p-2 rounded cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span>
          {value.length > 0
            ? value.join(", ")
            : placeholder}
        </span>
        <button
          className="text-gray-500"
          type="button" // Explicitly set type="button" to prevent acting as a submit button
        >
          &#x25BC;
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto z-10"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            e.stopPropagation(); // Prevent event bubbling
          }}
        >
          {options
            .filter((option) => !value.includes(option.label)) // Exclude already selected options
            .map((option) => (
              <div
                key={option.value}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={(e) => handleSelect(option.label, e)} // Pass event
              >
                {option.label}
              </div>
            ))}
        </div>
      )}

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {value.map((label) => (
          <div
            key={label}
            className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center"
          >
            <span>{label}</span>
            <button
              className="ml-2 focus:outline-none"
              type="button" // Explicitly set type="button" to prevent acting as a submit button
              onClick={(e) => handleRemove(label, e)} // Pass event
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectMultiSelectDropdown;