import React, { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface PriceFilterProps {
  onFilterChange: (minPrice: number, maxPrice: number) => void;
  reset: boolean;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ onFilterChange, reset }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedPriceRange(value);

    const [minPrice, maxPrice] = value.split('-').map(Number);
    onFilterChange(minPrice, maxPrice || 10000); // Assuming 10000 as max price
  };

  useEffect(() => {
    if (reset) {
      setSelectedPriceRange(null);
      onFilterChange(0, 10000); // Reset to default price range
    }
  }, [reset, onFilterChange]);

  return (
    <div className="filter-group">
      <summary
        className="flex justify-between items-center p-4 lg:p-0 lg:pt-[1.25rem] lg:pb-[0.375rem] cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex flex-col">
          <span className="text-lg font-semibold">Price</span>
        </div>
        <span className={`arrow ${isOpen ? 'down' : 'up'}`}>
        {isOpen ? (
            <IoIosArrowUp className="text-gray-600" />
          ) : (
            <IoIosArrowDown className="text-gray-600" />
          )}
        </span>
      </summary>

      {isOpen && (
        <ul className="px-4 lg:px-0filter-label-display">
          <li className="filter-price-container py-[0.875rem] lg:py-[0.625rem] relative">
            <div className="grid-filter price items-center">
              <label className="cursor-pointer filter-area-text lg:ml-[1.25rem]">
                <input
                  type="radio"
                  name="Price"
                  value="0-500"
                  className="mr-2"
                  checked={selectedPriceRange === '0-500'}
                  onChange={handlePriceChange}
                />
                <span className="text-[#484B5A] text-[0.875rem] lg:text-[1rem]">Less than ₹500</span>
              </label>
            </div>
          </li>
          <li className="filter-price-container py-[0.875rem] lg:py-[0.625rem] relative">
            <div className="grid-filter price items-center">
              <label className="cursor-pointer filter-area-text lg:ml-[1.25rem]">
                <input
                  type="radio"
                  name="Price"
                  value="500-1000"
                  className="mr-2"
                  checked={selectedPriceRange === '500-1000'}
                  onChange={handlePriceChange}
                />
                <span className="text-[#484B5A] text-[0.875rem] lg:text-[1rem]">₹500 - ₹1000</span>
              </label>
            </div>
          </li>
          <li className="filter-price-container py-[0.875rem] lg:py-[0.625rem] relative">
            <div className="grid-filter price items-center">
              <label className="cursor-pointer filter-area-text lg:ml-[1.25rem]">
                <input
                  type="radio"
                  name="Price"
                  value="1000-1500"
                  className="mr-2"
                  checked={selectedPriceRange === '1000-1500'}
                  onChange={handlePriceChange}
                />
                <span className="text-[#484B5A] text-[0.875rem] lg:text-[1rem]">₹1000 - ₹1500</span>
              </label>
            </div>
          </li>
          <li className="filter-price-container py-[0.875rem] lg:py-[0.625rem] relative">
            <div className="grid-filter price items-center">
              <label className="cursor-pointer filter-area-text lg:ml-[1.25rem]">
                <input
                  type="radio"
                  name="Price"
                  value="1500-2000"
                  className="mr-2"
                  checked={selectedPriceRange === '1500-2000'}
                  onChange={handlePriceChange}
                />
                <span className="text-[#484B5A] text-[0.875rem] lg:text-[1rem]">₹1500 - ₹2000</span>
              </label>
            </div>
          </li>
          <li className="filter-price-container py-[0.875rem] lg:py-[0.625rem] relative">
            <div className="grid-filter price items-center">
              <label className="cursor-pointer filter-area-text lg:ml-[1.25rem]">
                <input
                  type="radio"
                  name="Price"
                  value="2000-10000"
                  className="mr-2"
                  checked={selectedPriceRange === '2000-10000'}
                  onChange={handlePriceChange}
                />
                <span className="text-[#484B5A] text-[0.875rem] lg:text-[1rem]">More than ₹2000</span>
              </label>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

export default PriceFilter;
