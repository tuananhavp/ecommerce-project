import { useEffect, useState } from "react";

import { capitalizeFirstLetter } from "@/helpers";
import { useProductStore } from "@/store/productStore";

import { CATEGORIES } from "../../HomePage/constants";

const FilterSidebar = () => {
  const { filters, setPriceRange, setCategory, toggleTrending, toggleInStock, setRating, clearFilters, applyFilters } =
    useProductStore();

  const [priceValues, setPriceValues] = useState([filters.priceRange.min, filters.priceRange.max]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const maxPrice = 1000; // Adjust based on your product pricing

  // Initialize selected categories based on current filter
  useEffect(() => {
    if (filters.category) {
      setSelectedCategories([filters.category]);
    } else {
      setSelectedCategories([]);
    }
  }, [filters.category]);

  // Handle min price input change
  const handleMinPriceChange = (value: string) => {
    const newValue: number = Number(value);
    if (newValue >= 0 && newValue <= priceValues[1]) {
      setPriceValues([newValue, priceValues[1]]);
    }
  };

  // Handle max price input change
  const handleMaxPriceChange = (value: string) => {
    const newValue = Number(value);
    if (newValue >= priceValues[0] && newValue <= maxPrice) {
      setPriceValues([priceValues[0], newValue]);
    }
  };

  // Apply price range when slider stops
  const handlePriceChangeApply = () => {
    setPriceRange(priceValues[0], priceValues[1]);
  };

  // Handle category checkbox change
  const handleCategoryChange = (categoryName: string) => {
    const formattedCategory: string = capitalizeFirstLetter(categoryName);

    if (selectedCategories.includes(formattedCategory)) {
      // If this is the only selected category, set to null
      if (selectedCategories.length === 1) {
        setSelectedCategories([]);
        setCategory(null);
      } else {
        const newCategories = selectedCategories.filter((cat) => cat !== formattedCategory);
        setSelectedCategories(newCategories);
        setCategory(newCategories[0] || null);
      }
    } else {
      // For now we're handling just one category at a time
      setSelectedCategories([formattedCategory]);
      setCategory(formattedCategory);
    }
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md sticky top-4">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      {/* Price Range with Daisy UI Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>

        {/* Min-Max price inputs */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-1/2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-opacity-70">$</span>
            <input
              type="number"
              value={priceValues[0]}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              onBlur={() => handlePriceChangeApply()}
              className="input input-bordered w-full pl-7 input-sm"
              placeholder="Min"
              min="0"
              max={priceValues[1]}
            />
          </div>
          <div className="relative w-1/2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-opacity-70">$</span>
            <input
              type="number"
              value={priceValues[1]}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              onBlur={() => handlePriceChangeApply()}
              className="input input-bordered w-full pl-7 input-sm"
              placeholder="Max"
              min={priceValues[0]}
              max={maxPrice}
            />
          </div>
        </div>

        {/* Daisy UI Range Slider */}
        <div className="px-2 mt-2">
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceValues[0]}
            onChange={(e) => {
              const newVal = Number(e.target.value);
              if (newVal <= priceValues[1]) {
                setPriceValues([newVal, priceValues[1]]);
              }
            }}
            onMouseUp={handlePriceChangeApply}
            onTouchEnd={handlePriceChangeApply}
            className="range range-xs range-primary"
          />
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceValues[1]}
            onChange={(e) => {
              const newVal = Number(e.target.value);
              if (newVal >= priceValues[0]) {
                setPriceValues([priceValues[0], newVal]);
              }
            }}
            onMouseUp={handlePriceChangeApply}
            onTouchEnd={handlePriceChangeApply}
            className="range range-xs range-primary"
          />
          <div className="flex justify-between text-xs px-1 mt-1 text-opacity-70">
            <span>${priceValues[0]}</span>
            <span>${priceValues[1]}</span>
          </div>
        </div>
      </div>

      {/* Product Categories as Checkboxes */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Product Categories</h3>
        <div className="max-h-60 overflow-auto pr-1">
          {CATEGORIES.map((category) => (
            <div key={category.name} className="form-control w-full">
              <label className="label cursor-pointer justify-start gap-2 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={selectedCategories.includes(capitalizeFirstLetter(category.name))}
                  onChange={() => handleCategoryChange(category.name)}
                />
                <span className="label-text capitalize">{category.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="space-y-2">
        {/* Trending */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filters.trending}
              onChange={toggleTrending}
            />
            <span className="label-text">Trending</span>
          </label>
        </div>

        {/* In Stock */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filters.inStock}
              onChange={toggleInStock}
            />
            <span className="label-text">In Stock</span>
          </label>
        </div>

        {/* Rating */}
        <div className="form-control w-full mt-2">
          <label className="label">
            <span className="label-text font-semibold">Rating</span>
          </label>
          <select
            value={filters.rating || ""}
            onChange={(e) => setRating(e.target.value ? Number(e.target.value) : null)}
            className="select select-bordered select-sm w-full"
          >
            <option value="">All Ratings</option>
            <option value="5">★★★★★ (5 Stars)</option>
            <option value="4">★★★★☆ (4 Stars & Up)</option>
            <option value="3">★★★☆☆ (3 Stars & Up)</option>
            <option value="2">★★☆☆☆ (2 Stars & Up)</option>
            <option value="1">★☆☆☆☆ (1 Star & Up)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="divider"></div>
      <div className="flex flex-col gap-2">
        <button className="btn btn-primary btn-sm" onClick={() => applyFilters()}>
          Apply Filters
        </button>

        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
