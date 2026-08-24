"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export type SortOption = {
  value: string;
  label: string;
};

export function SortDropdown({
  options,
  label = "SORT BY",
  value,
  defaultValue,
  onValueChange,
}: {
  options: SortOption[];
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value ?? ""
  );
  const currentValue = value ?? internalValue;

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <Select
        value={currentValue}
        onValueChange={(next) => {
          setInternalValue(next);
          onValueChange?.(next);
        }}
      >
        <SelectTrigger className="h-8 min-w-[10rem] gap-6 rounded-lg bg-white px-3 text-sm text-foreground">
          {/* Radix fails to bubble the item text into the trigger here. */}
          <span data-slot="select-value">
            {options.find((option) => option.value === currentValue)?.label}
          </span>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}