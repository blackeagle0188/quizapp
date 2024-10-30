"use client";
import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import classNames from "classnames";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  defaultValues?: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  selectClassName?: string;
  menuClassName?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  defaultValues = [],
  onChange,
  placeholder,
  className,
  selectClassName,
  menuClassName,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);

  const handleChange = (selectedOptions: MultiValue<Option>) => {
    const newValue = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedValues(newValue);
    onChange(newValue);
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      className: classNames(selectClassName),
    }),
    menu: (provided: any) => ({
      ...provided,
      className: classNames(menuClassName),
    }),
  };

  return (
    <div className={classNames(className)}>
      <Select
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        styles={customStyles}
      />
    </div>
  );
};
