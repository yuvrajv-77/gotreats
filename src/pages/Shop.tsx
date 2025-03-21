import { BadgePercent, Candy, Dessert, Drumstick, Salad, Soup, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import ItemCards from '../components/ItemCards';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useProductStore } from '../store/productStore';
import Button from '../components/Button';
import { useCartStore } from '../store/cartStore';

import { motion, AnimatePresence } from "framer-motion";

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tag = searchParams.get('tag');
    const [foodType, setFoodType] = useState('all'); // 'all', 'veg', 'non-veg'

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

    // Filter products based on food type and tag
    const getFilteredProducts = () => {
        let filteredProducts = products;

        // First filter by food type
        if (foodType === 'veg') {
            filteredProducts = products?.filter(item => !item.isNonVeg);
        } else if (foodType === 'non-veg') {
            filteredProducts = products?.filter(item => item.isNonVeg);
        }

        // Then filter by tag
        if (tag === 'top-picks') {
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
        }
        else if (tag === 'chocolate') {
            return filteredProducts?.filter(item => item.category === 'chocolate');
        }
        return filteredProducts;
    };

    return (
        <div className='bg-[#fff9f2] flex'>
            <div className='container mx-auto'>
                <div className='py-10'>
                    <h1 className='text-4xl md:text-5xl text-center lancelot text-gray-800'>Shop our Homemade Products</h1>
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
                    <div className='relativ flex justify-center mx-4 mt-5'>


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
                                        Paav Bhaaji
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'pasta' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=pasta')}>
                                        Pasta
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'maggi' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=maggi')}>
                                        <Soup strokeWidth={1.5} />Maggi
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'desserts' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=desserts')}>
                                        <Dessert strokeWidth={1.5} /> Desserts
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'snacks' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=snacks')}>
                                        Snacks
                                    </span>
                                    <span
                                        className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl ${tag == 'chocolate' ? 'bg-orange-600 text-white hover:text-white' : 'bg-white'}  hover:text-orange-600 inline-flex items-center shadow-xs gap-2 transition-colors duration-100 ease-in`}
                                        onClick={() => navigate('/shop/?tag=chocolate')}>
                                        Chocolate
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

                    {/* items container */}
                    <div className='flex flex-wrap lg:gap-10 gap-4 mt-10 justify-center'>
                        {getFilteredProducts()?.map((item, index) => (
                            <ItemCards key={index} item={item} />
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
                        className='fixed bottom-4 left-0 right-0 flex justify-center w-full'>
                        <span onClick={() => {
                            window.scrollTo(0, 0);
                            navigate('/checkout')
                        }} className='flex items-center w-76 justify-between gap-2 border-3 border-orange-400 px-4 py-3 bg-black rounded-2xl text-white hover:bg-white hover:text-black cursor-pointer'>
                            <p>{itemQuantity} Items Added</p>View Cart {'>'}
                        </span>
                    </motion.div>
                </AnimatePresence>
            }
        </div>
    );
};

export default Shop;