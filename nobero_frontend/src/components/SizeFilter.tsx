import React, { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface SizeFilterProps {
    onFilterChange: (sizes: string[]) => void;
    reset: boolean;
}

const SizeFilter: React.FC<SizeFilterProps> = ({ onFilterChange, reset }) => {
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(true); // State to handle toggle

    const handleSizeChange = (size: string) => {
        const newSelectedSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size) // Remove size if already selected
            : [...selectedSizes, size]; // Add size if not selected

        setSelectedSizes(newSelectedSizes);
        onFilterChange(newSelectedSizes); // Notify parent of the change
    };

    // Reset selected sizes when reset prop changes
    useEffect(() => {
        if (reset) {
            setSelectedSizes([]); // Clear selected sizes
            onFilterChange([]); // Notify parent of the reset
        }
    }, [reset, onFilterChange]);

    const toggleFilter = () => setIsOpen(!isOpen); // Toggle function

    return (
        <div className="">
            <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={toggleFilter}
            >
                <h3 className="text-lg font-semibold">Size</h3>
                {isOpen ? (
                    <IoIosArrowUp className="text-gray-600" />
                ) : (
                    <IoIosArrowDown className="text-gray-600" />
                )}
            </div>
            {isOpen && (
                <div>
                    {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                        <div key={size} className="mb-2">
                            <input
                                type="checkbox"
                                id={`size-${size}`}
                                checked={selectedSizes.includes(size)}
                                onChange={() => handleSizeChange(size)}
                            />
                            <label htmlFor={`size-${size}`} className="ml-2">
                                {size}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SizeFilter;
