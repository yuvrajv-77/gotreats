import { BadgePercent, Beer, Candy, Cookie, Dessert, Drumstick, Salad, Search, Soup, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import ItemCards from '../components/ItemCards';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useProductStore } from '../store/productStore';
import Button from '../components/Button';
import { useCartStore } from '../store/cartStore';

import { motion, AnimatePresence, Variants } from "framer-motion";

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tag = searchParams.get('tag');
    const [foodType, setFoodType] = useState('all'); // 'all', 'veg', 'non-veg'
    const [searchQuery, setSearchQuery] = useState('');

    const products = useProductStore((state) => state.products);
    const items = useCartStore((state) => state.items);
    const itemQuantity = useCartStore((state) => state.itemCount);


    useEffect(() => {
        if (!tag) {
            navigate('/shop/?tag=top-picks');
        }
        window.scrollTo(0, 0);
    }, []);

    const toggleFoodType = (type) => {
        if (foodType === type) {
            setFoodType('all'); // Toggle off if already selected
        } else {
            setFoodType(type); // Set to the selected type
        }
    };

    // Updated getFilteredProducts to include search functionality
    const getFilteredProducts = () => {
        let filteredProducts = products;

        // First filter by food type
        if (foodType === 'veg') {
            filteredProducts = products?.filter(item => !item.isNonVeg);
        } else if (foodType === 'non-veg') {
            filteredProducts = products?.filter(item => item.isNonVeg);
        }

        // Then filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filteredProducts = filteredProducts?.filter(item => 
                item.productName.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.productDescription.toLowerCase().includes(query)
            );
        }

        // Then filter by tag if no search query
        else if (tag === 'top-picks') {
            return filteredProducts;
        } else if (tag === 'meals') {
            return filteredProducts?.filter(item => item.category === 'Meals');
        } else if (tag === 'pasta') {
            return filteredProducts?.filter(item => item.category === 'Pasta');
        } else if (tag === 'maggi') {
            return filteredProducts?.filter(item => item.category === 'Maggi');
        } else if (tag === 'paav-bhaaji') {
            return filteredProducts?.filter(item => item.category === 'Paav Bhaaji');
        } else if (tag === 'desserts') {
            return filteredProducts?.filter(item => item.category === 'Desserts');
        } else if (tag === 'snacks') {
            return filteredProducts?.filter(item => item.category === 'Snacks');
        } else if (tag === 'drinks') {
            return filteredProducts?.filter(item => item.category === 'Drinks');
        }else if (tag === 'pickles') {
            return filteredProducts?.filter(item => item.category === 'Pickles');
        }
        return filteredProducts;
    };

    // Heading text animation variants
    const headingVariants: Variants = {
        initial: { 
            opacity: 0,
            y: 30
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    // Word animation variants for "Homemade"
    const wordVariants: Variants = {
        initial: { 
            backgroundPosition: "0% 50%"
        },
        animate: {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <div className='bg-[#fff9f2] flex'>
            <div className='container mx-auto'>
                <div className='py-10'>
                    <motion.div
                        className="text-center mb-8"
                        initial="initial"
                        animate="animate"
                        variants={headingVariants}
                    >
                        <h1 className='text-4xl md:text-5xl lg:text-6xl lancelot'>
                            Shop our{" "}
                            <motion.span
                                variants={wordVariants}
                                className="inline-block bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-transparent bg-clip-text bg-[length:200%_100%]"
                            >
                                Homemade
                            </motion.span>
                            {" "}Products
                        </h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mx-auto mt-4 max-w-[200px] rounded-full"
                        />
                    </motion.div>

                    {/* Search Bar */}
                    <div className="flex justify-center mb-6 px-4">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for meals, combos, or dishes..."
                                className="w-full px-4 py-3 pl-12 pr-10 text-gray-700 bg-white border-2 border-orange-100 rounded-full focus:outline-none focus:border-orange-500 transition-colors duration-300"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-medium"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    <div className='text justify-center flex items-center flex-wrap gap-2 lg:gap-10 mt-5 select-none'>
                        <div className='flex gap-2'>
                            <span
                                className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-full ${foodType === 'veg' ? 'bg-green-600 text-white hover:text-white' : 'bg-white'}  hover:text-green-600 text-green-700 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                onClick={() => toggleFoodType('veg')}>
                                <Salad strokeWidth={1.5} />Veg
                            </span>
                            <span
                                className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-full ${foodType === 'non-veg' ? 'bg-orange-800 text-white hover:text-white' : 'bg-white'}  hover:text-orange-700 text-orange-900 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                onClick={() => toggleFoodType('non-veg')}>
                                <Drumstick strokeWidth={1.5} />Non-Veg
                            </span>
                        </div>
                    </div>
                    <div className={`relativ flex justify-center mx-4 mt-5 ${searchQuery ? 'opacity-50 pointer-events-none' : ''}`}>


                        <div className=' flex items-center overflow-x-auto scrollbar-hide py-2  mx-auto  gap-2 lg:gap-5 select-none'>
                            {/* -------Categories------- */}
                            <span
                                className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg ${tag == 'top-picks' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs transition-colors duration-100 ease-in gap-2`}
                                onClick={() => navigate('/shop/?tag=top-picks')}>
                                <BadgePercent strokeWidth={1.5} />Top Picks
                            </span>

                            {/* Only show relevant categories based on food type */}
                            {(foodType === 'all' || foodType === 'veg') && (
                                <>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'meals' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=meals')}>
                                        <Utensils strokeWidth={1.5} /> Meals
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'paav-bhaaji' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=paav-bhaaji')}>
                                        Pav Bhaji
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'pasta' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=pasta')}>
                                        Pasta
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'maggi' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=maggi')}>
                                        <Soup strokeWidth={1.5} />
                                        Maggi
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'desserts' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=desserts')}>
                                        <Dessert strokeWidth={1.5} /> 
                                        Desserts
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'snacks' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=snacks')}>
                                            <Cookie strokeWidth={1.5} />
                                        Snacks
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'drinks' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=drinks')}>
                                        <Beer strokeWidth={1.5} />
                                        Drinks & Juices
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'pickles' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=pickles')}>
                                        
                                        Pickles
                                    </span>
                                </>
                            )}

                            {(foodType === 'non-veg') && (
                                <>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-lg ${tag == 'meals' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=meals')}>
                                        <Utensils strokeWidth={1.5} /> Meals
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* No Results Message */}
                    {getFilteredProducts()?.length === 0 && (
                        <div className="text-center mt-10">
                            <p className="text-gray-600 text-lg">No items found matching "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 text-orange-500 hover:text-orange-600 underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}

                    {/* Items Container */}
                    <div className='flex flex-wrap lg:gap-10 gap-4 mt-10 justify-center'>
                        {getFilteredProducts()?.map((item, index) => (
                            <ItemCards key={item.id} item={item} />
                        ))}
                    </div>

                </div>
            </div>
            {itemQuantity > 0 &&
                <AnimatePresence>
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        className='fixed bottom-4 left-0 right-0 flex justify-center w-full z-50'
                    >
                        <span
                            onClick={() => {
                                window.scrollTo(0, 0);
                                navigate('/checkout');
                            }}
                            className="relative bg-black  text-white px-6 py-4 rounded-full min-w- shadow-lg hover:bg-gray-900 transition-all duration-300"
                        >
                            <span className="flex items-center">
                                <p className="font-medium">{itemQuantity} Items Added</p>
                                <span className="text-orange-400 ml-3">View Cart →</span>
                            </span>
                        </span>
                    </motion.div>
                </AnimatePresence>
            }
        </div>
    );
};

export default Shop;