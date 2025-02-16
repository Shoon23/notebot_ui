import React from "react";
import "./style.css";

interface SelectOptionProps {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  selectHandler: (selectedValue: string) => void; // Prop for handling selection
  initialValue?: string; // Optional prop for initial value
}

const SelectOption: React.FC<SelectOptionProps> = ({
  label,
  options,
  selectHandler,
  initialValue = "", // Default to empty string if not provided
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectHandler(e.target.value); // Call the handler with the selected value
  };

  return (
    <div
      style={{
        height: "75px",
        margin: "5px 0",
      }}
    >
      <div
        style={{
          marginBottom: "5px",
        }}
      >
        {label}
      </div>
      <select
        className="select-box"
        defaultValue={initialValue}
        onChange={handleSelectChange}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
