import { useState } from "react";

interface DropdownProps<T> {
    value: T | null;
    options: T[];
    onChange: (value: T) => void;
    mode?: {
        display: keyof T | ((item: T) => string);
        value?: keyof T;
    };
    placeholder?: string;
    className?: string;
}

const CustomDropdown = <T,>({
    value,
    options,
    onChange,
    mode,
    placeholder = "Select an option",
    className = "",
}: DropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const getDisplayValue = (item: T | null): string => {
        if (!item) return placeholder;

        if (mode?.display) {
            if (typeof mode.display === "function") {
                return mode.display(item);
            }
            // If `item` is an object, safely access the property
            if (typeof item === "object" && item !== null) {
                return String(item[mode.display as keyof T]);
            }
        }

        return String(item); 
    };
    const filteredOptions = options.filter((option) =>
        getDisplayValue(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`relative ${className}`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
                {getDisplayValue(value)}
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
                    />
                    <ul className="max-h-40 overflow-y-auto py-1">
                        {filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onChange(option);
                                    setIsOpen(false);
                                    setSearchTerm("")
                                }}
                            >
                                {getDisplayValue(option)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;