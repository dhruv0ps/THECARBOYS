import React from "react";
import CustomDropdown from "./CustomDropdown";

interface MakeDropdownProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const MakeDropdown: React.FC<MakeDropdownProps> = ({ value, onChange }) => {
  const makeOptions = [
    { label: "Select your car make", value: null }, // Placeholder option (not selectable)
    { label: "Acura", value: "Acura" },
    { label: "Alfa Romeo", value: "Alfa Romeo" },
    { label: "Aston Martin", value: "Aston Martin" },
    { label: "Audi", value: "Audi" },
    { label: "Bentley", value: "Bentley" },
    { label: "BMW", value: "BMW" },
    { label: "Bricklin", value: "Bricklin" },
    { label: "Bugatti", value: "Bugatti" },
    { label: "Buick", value: "Buick" },
    { label: "BYD", value: "BYD" },
    { label: "Cadillac", value: "Cadillac" },
    { label: "Campagna Motors", value: "Campagna Motors" },
    { label: "Chevrolet", value: "Chevrolet" },
    { label: "Chrysler", value: "Chrysler" },
    { label: "Citroën", value: "Citroën" },
    { label: "Conquest Vehicles", value: "Conquest Vehicles" },
    { label: "Dodge", value: "Dodge" },
    { label: "Dubuc Motors", value: "Dubuc Motors" },
    { label: "ElectraMeccanica", value: "ElectraMeccanica" },
    { label: "Ferrari", value: "Ferrari" },
    { label: "Fiat", value: "Fiat" },
    { label: "Ford", value: "Ford" },
    { label: "Geely", value: "Geely" },
    { label: "Genesis", value: "Genesis" },
    { label: "GMC", value: "GMC" },
    { label: "Honda", value: "Honda" },
    { label: "Hyundai", value: "Hyundai" },
    { label: "Infiniti", value: "Infiniti" },
    { label: "Jaguar", value: "Jaguar" },
    { label: "Jeep", value: "Jeep" },
    { label: "Kia", value: "Kia" },
    { label: "Lamborghini", value: "Lamborghini" },
    { label: "Land Rover", value: "Land Rover" },
    { label: "Lexus", value: "Lexus" },
    { label: "Lincoln", value: "Lincoln" },
    { label: "Lotus", value: "Lotus" },
    { label: "Maserati", value: "Maserati" },
    { label: "Mazda", value: "Mazda" },
    { label: "McLaren", value: "McLaren" },
    { label: "Mercedes-Benz", value: "Mercedes-Benz" },
    { label: "Mini", value: "Mini" },
    { label: "Mitsubishi", value: "Mitsubishi" },
    { label: "Nissan", value: "Nissan" },
    { label: "Peugeot", value: "Peugeot" },
    { label: "Polestar", value: "Polestar" },
    { label: "Porsche", value: "Porsche" },
    { label: "Ram", value: "Ram" },
    { label: "Renault", value: "Renault" },
    { label: "Rolls-Royce", value: "Rolls-Royce" },
    { label: "Subaru", value: "Subaru" },
    { label: "Suzuki", value: "Suzuki" },
    { label: "Tesla", value: "Tesla" },
    { label: "Toyota", value: "Toyota" },
    { label: "Volkswagen", value: "Volkswagen" },
    { label: "Volvo", value: "Volvo" },
    {label: "Other",value:"Other"}
  ];

  return (
    <CustomDropdown<{ label: string; value: string | null }>
      value={makeOptions.find((option) => option.value === value) || null} 
      options={makeOptions.slice(1)} 
      onChange={(selected) => onChange(selected.value ?? null)} 
      mode={{ display: "label", value: "value" }}
      placeholder="Select your car make"
    />
  );
};

export default MakeDropdown;
