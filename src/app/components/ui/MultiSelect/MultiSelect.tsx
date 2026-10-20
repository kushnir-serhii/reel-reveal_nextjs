"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoTriangleDown } from "react-icons/go";
import { FilterArray } from "@/typification";
import { capitalizeFirstLetter } from "@/utils";
import { multiSelectVariants } from "./MultiSelect.variants";

interface SearchSelectProps {
  placeholder: string;
  options: FilterArray;
  selectedOptions: FilterArray;
  isMulti?: boolean;
  setValue?: (selectedValues: (string | number)[]) => void;
}

export const MultiSelect: React.FC<SearchSelectProps> = ({
  placeholder,
  options = [],
  selectedOptions,
  isMulti,
  setValue,
}) => {
  const [selectedValues, setSelectedValues] = useState<FilterArray>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const dropdownWithSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValues(selectedOptions);
  }, [selectedOptions, selectedOptions.length]);

  // Close drop down on tap outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownWithSearchRef.current &&
        !dropdownWithSearchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChange = (option: string | number) => {
    // if (isDisabled) return;

    let updatedValues = [];
    if (selectedValues.includes(option)) {
      updatedValues = selectedValues.filter((val) => val !== option);
    } else {
      updatedValues = [...selectedValues, option];
    }
    setSelectedValues(updatedValues);
  };

  useEffect(() => {
    setIsDisabled(false);
    setSelectedValues(selectedOptions);
  }, []);

  useEffect(() => {
    if (!isOpen) setValue?.(selectedValues);
  }, [isOpen]);

  useEffect(() => {
    if (!isMulti) {
      const isDisabledButton = !isMulti ? selectedValues.length > 0 : false;
      setIsDisabled(isDisabledButton);
      if (isDisabledButton) return;
    }
  }, [selectedValues]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const { root, trigger, icon, dropdown, list, item, option, dropdownBottom } =
    multiSelectVariants({ open: isOpen });

  return (
    <div
      className={root()}
      ref={dropdownWithSearchRef}
      aria-label="Select"
      onKeyDown={(e) => (e.key === "Enter" ? toggleDropdown() : null)}
    >
      <div onClick={toggleDropdown} className={trigger()}>
        <div>{placeholder}</div>

        <div>
          <GoTriangleDown className={icon()} />
        </div>
      </div>

      {options.length > 0 && (
        <div className={dropdown()}>
          <ul className={list()}>
            {options.map((opt, index) => (
              <li key={index} className={item()}>
                <button
                  type="button"
                  disabled={isDisabled}
                  className={option({
                    selected: selectedValues.includes(opt),
                    disabled: isDisabled,
                  })}
                  onClick={() => handleSelectChange(opt)}
                >
                  {typeof opt === "string" ? capitalizeFirstLetter(opt) : opt}
                </button>
              </li>
            ))}
          </ul>
          <div className={dropdownBottom()} />
        </div>
      )}
    </div>
  );
};
