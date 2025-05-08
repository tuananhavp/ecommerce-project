import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import { capitalizeFirstLetter } from "@/helpers";
import { useProductStore } from "@/store/productStore";

import { CATEGORIES } from "../../HomePage/constants";

const FilterSidebar = () => {
  const { filters, setPriceRange, setCategory, toggleTrending, toggleInStock, setRating, clearFilters, applyFilters } =
    useProductStore();

  const [priceValues, setPriceValues] = useState([filters.priceRange.min, filters.priceRange.max]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const maxPrice = 200;

  useEffect(() => {
    if (filters.category) {
      setSelectedCategories([filters.category]);
    } else {
      setSelectedCategories([]);
    }
  }, [filters.category]);

  // Handle min price input change
  const handleMinPriceChange = (value: string) => {
    // Parse value as integer to remove leading zeros
    const parsedValue = value === "" ? 0 : parseInt(value, 10);

    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= priceValues[1]) {
      setPriceValues([parsedValue, priceValues[1]]);
    }
  };

  // Handle max price input change
  const handleMaxPriceChange = (value: string) => {
    const parsedValue = value === "" ? 0 : parseInt(value, 10);

    if (!isNaN(parsedValue) && parsedValue >= priceValues[0] && parsedValue <= maxPrice) {
      setPriceValues([priceValues[0], parsedValue]);
    }
  };

  // Apply price range when slider stops
  const handlePriceChangeApply = () => {
    setPriceRange(priceValues[0], priceValues[1]);
  };

  // Handle MUI slider change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setPriceValues(newValue as number[]);
  };

  // Format the displayed price value (removes leading zeros)
  const formatPriceDisplay = (value: number): string => {
    return value.toString();
  };

  // Handle rating change
  const handleRatingChange = (value: number | null) => {
    setRating(value);
  };

  // Render stars for rating display
  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index} className={index < count ? "text-warning" : "text-base-300"}>
          ★
        </span>
      ));
  };

  // Get rating option text based on rating value
  const getRatingOptionText = (rating: number | null): string => {
    switch (rating) {
      case 5:
        return "Only 5 Stars";
      case 4:
        return "4 Stars & Up";
      case 3:
        return "3 Stars & Up";
      case 2:
        return "2 Stars & Up";
      case 1:
        return "1 Star & Up";
      default:
        return "All Ratings";
    }
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

      {/* Price Range with MUI Range Slider */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>

        {/* Min-Max price inputs */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-1/2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-opacity-70">$</span>
            <input
              type="text"
              value={formatPriceDisplay(priceValues[0])}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              onBlur={() => handlePriceChangeApply()}
              className="input input-bordered w-full pl-7 input-sm"
              placeholder="Min"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <div className="relative w-1/2">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-opacity-70">$</span>
            <input
              type="text"
              value={formatPriceDisplay(priceValues[1])}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              onBlur={() => handlePriceChangeApply()}
              className="input input-bordered w-full pl-7 input-sm"
              placeholder="Max"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
        </div>

        {/* MUI Range Slider */}
        <Box sx={{ width: "100%", padding: "0 6px", marginTop: 2, marginBottom: 3 }}>
          <Slider
            value={priceValues}
            onChange={handleSliderChange}
            onChangeCommitted={handlePriceChangeApply}
            valueLabelDisplay="off"
            min={0}
            max={maxPrice}
            sx={{
              color: "#3b82f6",
              "& .MuiSlider-thumb": {
                height: 20,
                width: 20,
              },
              "& .MuiSlider-rail": {
                height: 4,
              },
              "& .MuiSlider-track": {
                height: 4,
              },
            }}
          />
          <div className="flex justify-between text-xs px-1 mt-1 text-opacity-70">
            <span>${formatPriceDisplay(priceValues[0])}</span>
            <span>${formatPriceDisplay(priceValues[1])}</span>
          </div>
        </Box>
      </div>

      {/* Improved Rating Filter with DaisyUI */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Customer Rating</h3>
        <div className="form-control w-full">
          <select
            value={filters.rating !== null ? filters.rating.toString() : ""}
            onChange={(e) => handleRatingChange(parseInt(e.target.value, 10) || null)}
            className="select select-bordered w-full"
          >
            <option value="">All Ratings</option>
            <option value="5">★★★★★ (Only 5 Stars)</option>
            <option value="4">★★★★☆ (4 Stars & Up)</option>
            <option value="3">★★★☆☆ (3 Stars & Up)</option>
            <option value="2">★★☆☆☆ (2 Stars & Up)</option>
            <option value="1">★☆☆☆☆ (1 Star & Up)</option>
          </select>
        </div>

        {/* Visual Star Display of Current Selection */}
        <div className="mt-3 p-3 bg-base-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-lg">{filters.rating ? renderStars(filters.rating) : renderStars(0)}</div>
          </div>
          <span className="badge badge-warning">{getRatingOptionText(filters.rating)}</span>
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
