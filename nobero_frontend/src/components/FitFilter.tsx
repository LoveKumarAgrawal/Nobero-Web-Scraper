import React, { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface FitFilterProps {
  onFilterChange: (fits: string[]) => void;
  reset: boolean;
}

const FitFilter: React.FC<FitFilterProps> = ({ onFilterChange, reset }) => {
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(true); // State to handle toggle

  const handleFitChange = (fit: string) => {
    let newSelectedFits = [...selectedFits];
    if (newSelectedFits.includes(fit)) {
      newSelectedFits = newSelectedFits.filter(f => f !== fit);
    } else {
      newSelectedFits.push(fit);
    }
    setSelectedFits(newSelectedFits);
    onFilterChange(newSelectedFits);
  };

  useEffect(() => {
    if (reset) {
      setSelectedFits([]);
      onFilterChange([]);
    }
  }, [reset, onFilterChange]);

  const toggleFilter = () => setIsOpen(!isOpen); // Toggle function

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={toggleFilter}
      >
        <h3 className="text-lg font-semibold">Fit</h3>
        {isOpen ? (
          <IoIosArrowUp className="text-gray-600" />
        ) : (
          <IoIosArrowDown className="text-gray-600" />
        )}
      </div>
      {isOpen && (
        <div>
          {['Regular Fit', 'Relaxed Fit', 'Oversized Fit'].map(fit => (
            <div key={fit} className="mb-2">
              <input
                type="checkbox"
                id={`fit-${fit}`}
                checked={selectedFits.includes(fit)}
                onChange={() => handleFitChange(fit)}
              />
              <label htmlFor={`fit-${fit}`} className="ml-2">
                {fit}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FitFilter;
