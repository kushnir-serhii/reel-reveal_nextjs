"use client";

import { useEffect, useState } from "react";
import { Icon } from "../Icon";
import { FilterArray } from "@/typification";
import { capitalizeFirstLetter } from "@/utils";
import { listSelectedValuesVariants } from "./ListSelectedValues.variants";

interface ListSelectedValuesProps {
  selectedValues: FilterArray;
  removeValue: (valueToRemove: string | number) => void;
}
export const ListSelectedValues: React.FC<ListSelectedValuesProps> = ({
  selectedValues,
  removeValue,
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [selectedList, setSelectedList] = useState<FilterArray>([]);

  
  useEffect(() => {
    if (selectedList.length) {
      // Incrementally show strings
      setTimeout(() => {
        selectedValues.forEach((_, index) => {
          setTimeout(() => setVisibleCount((prev) => prev + 1), index * 100);
        });
      }, 300);
    }

    // return () => {
    // };
  }, [selectedList, selectedValues]);
  
  useEffect(() => {
    if (selectedValues.length !== selectedList.length) {
      
      setVisibleCount(0);
      setSelectedList(selectedValues);
    }
  }, [selectedValues.length, selectedList.length, selectedValues]);
  const removeselectedItem = (valueToRemove: string | number) => {
    removeValue(valueToRemove);
    setSelectedList((prev) => prev.filter((value) => value !== valueToRemove));
  };

  const { list, item, removeBtn, removeIcon } = listSelectedValuesVariants({
    empty: selectedList.length === 0,
  });

  return (
    <ul className={list()}>
      {selectedList.map((value, index) => (
        <li key={index} className={item({ visible: index < visibleCount })}>
          {typeof value === "string" ? capitalizeFirstLetter(value) : value}
          <button
            type="button"
            className={removeBtn()}
            onClick={() => removeselectedItem(value)}
          >
            <Icon id="cross" width={12} height={12} className={removeIcon()} />
          </button>
        </li>
      ))}
    </ul>
  );
};
