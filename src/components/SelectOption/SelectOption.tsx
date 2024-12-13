import React from "react";
import "./style.css";

interface SelectOptionProps {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}

const SelectOption: React.FC<SelectOptionProps> = ({ label, options }) => {
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
      <select className="select-box" defaultValue={""}>
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectOption;
