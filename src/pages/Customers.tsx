import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import './Customers.css';

const Customers = () => {
    const userDetails = useAuthStore((state) => state.userDetails);
    const [startIndex, setStartIndex] = useState(0);
    const cardsToShow = 3; // Number of cards visible at once

    const customers = [
        {
            name: userDetails?.displayName || 'Customer Name',
            role: 'Verified Customer',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
            testimonial: "The quality of products and service at gotreats is exceptional. I love how they maintain consistency in their offerings."
        },
        {
            name: 'Rahul Sharma',
            role: 'Regular Customer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a401e39784e?w=150&h=150&fit=crop',
            testimonial: "The variety of products and the ease of ordering makes gotreats my go-to choice for all my needs."
        },
        {
            name: 'Priya Patel',
            role: 'Premium Customer',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
            testimonial: "The customer service is outstanding, and the products are always fresh and of high quality."
        },
        {
            name: 'Amit Kumar',
            role: 'Loyal Customer',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
            testimonial: "The loyalty program is amazing! I've earned so many rewards shopping here."
        },
        {
            name: 'Neha Gupta',
            role: 'VIP Customer',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
            testimonial: "The delivery is always on time, and the packaging is beautiful. Love shopping here!"
        },
        {
            name: 'Rajesh Verma',
            role: 'Regular Customer',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
            testimonial: "Best prices in town with amazing quality. What more could you ask for?"
        }
    ];

    const handleScroll = (direction: 'left' | 'right') => {
        const container = document.querySelector('.scroll-container');
        if (container) {
            // Temporarily pause the animation
            container.classList.remove('animate-scroll');
            
            // Update the index
            if (direction === 'right') {
                setStartIndex((prev) => (prev + 1) % customers.length);
            } else {
                setStartIndex((prev) => (prev - 1 + customers.length) % customers.length);
            }

            // Resume animation after transition
            setTimeout(() => {
                container.classList.add('animate-scroll');
            }, 500);
        }
    };

    // Get visible cards based on startIndex
    const getVisibleCards = () => {
        const cards = [];
        for (let i = 0; i < customers.length * 2; i++) {
            const index = (startIndex + i) % customers.length;
            cards.push(customers[index]);
        }
        return cards;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <h1 className="text-4xl font-bold text-center mb-12 text-orange-600">
                    Our Valued Customers
                </h1>

                {/* Customer Cards with Navigation */}
                <div className="relative max-w-[90%] mx-auto">
                    <button 
                        onClick={() => handleScroll('left')}
                        className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all border border-gray-100"
                    >
                        <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    
                    <button 
                        onClick={() => handleScroll('right')}
                        className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all border border-gray-100"
                    >
                        <ChevronRight size={24} className="text-gray-700" />
                    </button>

                    <div className="relative overflow-hidden py-8">
                        <div className="scroll-container animate-scroll flex gap-6">
                            {getVisibleCards().map((customer, index) => (
                                <motion.div
                                    key={index}
                                    className="flex-none w-[280px]"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-300 border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-200">
                                                <img
                                                    src={customer.image}
                                                    alt={customer.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-lg truncate">{customer.name}</h3>
                                                <p className="text-gray-600 text-sm">{customer.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 italic text-sm mt-4 line-clamp-3">
                                            "{customer.testimonial}"
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Customer Benefits Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center mb-8 text-green-600">
                        Why Choose gotreats?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎁</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Special Rewards</h3>
                            <p className="text-gray-600">Earn points on every purchase</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🚚</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Quick and reliable shipping</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Always here to help you</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Quality Products</h3>
                            <p className="text-gray-600">Premium selection guaranteed</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Customers; 