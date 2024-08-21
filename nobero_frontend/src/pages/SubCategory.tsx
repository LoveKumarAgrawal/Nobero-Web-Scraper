import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PriceFilter from '../components/PriceFilter';
import SizeFilter from '../components/SizeFilter';
import FitFilter from '../components/FitFilter';

export interface AvailableSKU {
    color: string;
    size: string[];
}

export interface Product {
    _id: string;
    title: string;
    price: string;
    MRP: string | null;
    last_7_day_sale: string | null;
    url: string;
    category: string;
    available_skus: AvailableSKU[];
    fit: string | null;
    fabric: string | null;
    neck: string | null;
    sleeve: string | null;
    pattern: string | null;
    length: string | null;
    description: string | null;
}

const SubCategory = () => {
    const { category } = useParams<{ category: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedFit, setSelectedFit] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
    const [resetFilters, setResetFilters] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/products/category/?category=${category}`)
            .then(response => {
                setProducts(response.data);
                setFilteredProducts(response.data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [category]);

    const handlePriceFilterChange = (minPrice: number, maxPrice: number) => {
        setPriceRange({ min: minPrice, max: maxPrice });
    };

    const handleSizeFilterChange = (sizes: string[]) => {
        setSelectedSizes(sizes);
    };

    const handleFitFilterChange = (fits: string[]) => {
        setSelectedFit(fits);
    };

    const handleClearAll = () => {
        setSelectedSizes([]);
        setSelectedFit([]);
        setPriceRange({ min: 0, max: 10000 });
        setFilteredProducts(products);
        setResetFilters(prev => !prev); // Toggle the reset state to trigger reset in child components
    };

    useEffect(() => {
        let filtered = products.filter(product => 
            Number(product.price) >= priceRange.min && Number(product.price) <= priceRange.max
        );

        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product =>
                product.available_skus.some(sku =>
                    selectedSizes.some(size => sku.size.includes(size))
                )
            );
        }

        if (selectedFit.length > 0) {
            filtered = filtered.filter(product =>
                selectedFit.includes(product.fit || "")
            );
        }

        setFilteredProducts(filtered);
    }, [priceRange, selectedSizes, selectedFit, products]);

    return (
        <main className="collection-container flex pt-4 lg:mx-[150px] lg:pt-8 min-h-[50vh] mb-14 rpti-error gap-4">
            {/* Filter Section */}
            <section className="filter-section hidden lg:block w-[30%] lg:overflow-y-auto lg:overflow-x-hidden lg:h-screen sticky top-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button 
                        onClick={handleClearAll} 
                        className="text-sm text-orange-500 hover:underline"
                    >
                        Clear All
                    </button>
                </div>
                <PriceFilter onFilterChange={handlePriceFilterChange} reset={resetFilters} />
                <SizeFilter onFilterChange={handleSizeFilterChange} reset={resetFilters} />
                <FitFilter onFilterChange={handleFitFilterChange} reset={resetFilters} />
            </section>

            {/* Product Grid */}
            <article className="product-on-page grid grid-cols-2 gap-x-0.5 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-8">
                {filteredProducts.map(product => (
                    <Link to={`/product/id/${product._id}`}>
                    <div key={product._id} className="product-card flex flex-col justify-between p-4 bg-white shadow rounded-lg min-h-[200px]">
                        <div>
                            <h2 className="text-lg font-bold">{product.title}</h2>
                        </div>
                        <div className="mt-auto">
                            <p className="text-sm">
                                ₹{product.price}
                                <span className="line-through text-gray-500 ml-2">₹{product.MRP}</span>
                            </p>
                        </div>
                    </div>
                    </Link>
                ))}
            </article>
        </main>
    );
};

export default SubCategory;
