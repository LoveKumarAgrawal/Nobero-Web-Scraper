import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  category: string;
}

const Card: React.FC<CardProps> = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/subcategory/${category}`);
  };

  return (
    <div
      className="flex justify-center items-center h-48 w-48 bg-gray-200 hover:bg-gray-300 cursor-pointer"
      onClick={handleClick}
    >
      <span className="text-xl font-semibold">{category}</span>
    </div>
  );
};

export default Card;
