import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Product } from './SubCategory';

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const toggleDescription = () => setIsDescriptionOpen(!isDescriptionOpen);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/product/id/?id=${id}`)
            .then((response) => {
                setProduct(response.data);
                // Set default selected color and sizes
                if (response.data.available_skus.length > 0) {
                    setSelectedColor(response.data.available_skus[0].color);
                }
            })
            .catch((error) => console.error('Error fetching product:', error));
    }, [id]);

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    const renderDescription = (desc: string | null) => {
        if (!desc) return null;
        return desc.split('\n').map((line, index) => (
            <p key={index} className="text-gray-700">{line}</p>
        ));
    };

    // Extract unique sizes based on selected color
    const sizes =
        product.available_skus.find((sku) => sku.color === selectedColor)
            ?.size || [];

    // Extract unique colors
    const colors = product.available_skus.map((sku) => sku.color);

    return (
        <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {product.title}
                </h1>
                <p className="text-4xl font-semibold text-black mb-2">
                    ₹{product.price}
                </p>
                {product.MRP && (
                    <p className="text-base text-gray-400 line-through mb-4">
                        MRP: ₹{product.MRP}
                    </p>
                )}
                {product.last_7_day_sale && (
                    <div className="flex items-center text-sm text-red-500 mb-6">
                        <FaShoppingCart className="mr-2" />
                        {product.last_7_day_sale} people bought this in the last
                        7 days
                    </div>
                )}
                {/* Select Color */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mr-4">
                        Select Color:
                    </h2>
                    <div className="flex space-x-3">
                        {colors.map((color) => (
                            <div
                                key={color}
                                className="text-gray-800 cursor-pointer"
                                onClick={() => setSelectedColor(color)}
                            >
                                {color}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Select Size */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                        Select Size:
                    </h2>
                    <div className="flex space-x-3">
                        {sizes.length > 0 ? (
                            sizes.map((size) => (
                                <div
                                    key={size}
                                    className={`px-4 py-2 border rounded-full cursor-pointer ${selectedSize === size
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-red-500">
                                This color is out of stock.
                            </p>
                        )}
                    </div>
                </div>
                <div className='border flex items-center justify-center rounded-full bg-indigo-900 text-white py-4 text-xl font-semibold'>
                    <button>Add to Cart</button>
                </div>
                {
                    product.fit && <div className="mt-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Key Highlights:</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {product.fit && (
                            <div className="flex flex-col border-b-2 pb-2">
                                <span className="font-semibold text-gray-600">Fit</span>
                                <span className="text-gray-800">{product.fit}</span>
                            </div>
                        )}
                        {product.fabric && (
                            <div className="flex flex-col border-b-2 pb-2">
                                <span className="font-semibold text-gray-600">Fabric</span>
                                <span className="text-gray-800">{product.fabric}</span>
                            </div>
                        )}
                        {product.neck && (
                            <div className="flex flex-col border-b-2 pb-2">
                                <span className="font-semibold text-gray-600">Neck</span>
                                <span className="text-gray-800">{product.neck}</span>
                            </div>
                        )}
                        {product.sleeve && (
                            <div className="flex flex-col border-b-2 pb-2">
                                <span className="font-semibold text-gray-600">Sleeve</span>
                                <span className="text-gray-800">{product.sleeve}</span>
                            </div>
                        )}
                        {product.pattern && (
                            <div className="flex flex-col border-b-2 pb-2">
                                <span className="font-semibold text-gray-600">Pattern</span>
                                <span className="text-gray-800">{product.pattern}</span>
                            </div>
                        )}
                        {product.length && (
                            <div className="flex flex-col border-b-2 pb-2">
                                <span className="font-semibold text-gray-600">Length</span>
                                <span className="text-gray-800">{product.length}</span>
                            </div>
                        )}
                    </div>
                </div>
                }
                

                {/* Description */}
                <div className="mt-8">
                    <div
                        className="flex items-center justify-between cursor-pointer mb-2"
                        onClick={toggleDescription}
                    >
                        <h2 className="text-lg font-bold text-gray-800">
                            Product Description
                        </h2>
                        {isDescriptionOpen ? (
                            <IoIosArrowUp className="text-gray-600" />
                        ) : (
                            <IoIosArrowDown className="text-gray-600" />
                        )}
                    </div>
                    {isDescriptionOpen && renderDescription(product.description)}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;

