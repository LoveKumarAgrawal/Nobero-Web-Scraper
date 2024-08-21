import React from 'react';
import Card from '../components/Card';

const categories = [
    "oversized t-shirts",
    "t-shirts",
    "co-ords",
    "joggers",
    "shorts",
    "plus size t-shirts"
];

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-8">Nobero</h1>
      <div className="grid grid-cols-3 gap-8">
        {categories.map((category) => (
          <Card key={category} category={category} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
