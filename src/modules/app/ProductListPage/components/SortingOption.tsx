import React from "react";

type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Name: Z to A", value: "name_desc" },
];

type SortingOptionsProps = {
  currentSort: string;
  onSortChange: (sort: string) => void;
};

const SortingOptions = ({ currentSort, onSortChange }: SortingOptionsProps) => {
  return (
    <div className="flex items-center mb-6">
      <label htmlFor="sort-select" className="mr-2 text-sm font-medium">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="select select-bordered select-sm w-40"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortingOptions;
