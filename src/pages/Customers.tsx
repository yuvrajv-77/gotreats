import { motion, Variants } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ChevronLeft, ChevronRight, UtensilsCrossed, Truck, HeadphonesIcon, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Customers.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useQuery } from '@tanstack/react-query';

interface Review {
    id: string;
    name: string;
    work: string;
    place: string;
    review: string;
    avatarUrl: string;
}

const fetchReviews = async (): Promise<Review[]> => {
    const reviewsCollection = collection(db, 'reviews');
    const reviewSnapshot = await getDocs(reviewsCollection);
    return reviewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Review[];
};

const Customers = () => {
    const userDetails = useAuthStore((state) => state.userDetails);
    const [startIndex, setStartIndex] = useState(0);
    const cardsToShow = 3; // Number of cards visible at once

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['reviews'],
        queryFn: fetchReviews,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false
    });

    // Home Made Products animation variants
    const homeMadeVariants: Variants = {
        initial: { scale: 1, rotate: 0 },
        hover: {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                repeatType: "loop" as const
            }
        }
    };

    // Delivery truck animation variants
    const truckVariants: Variants = {
        initial: { x: 0 },
        hover: {
            x: [0, 10, 0],
            transition: {
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror" as const,
                ease: "easeInOut"
            }
        }
    };

    // Support icon animation variants
    const supportVariants: Variants = {
        initial: { rotate: 0 },
        hover: {
            rotate: [0, -15, 15, -15, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "loop" as const
            }
        }
    };

    // Quality icon animation variants
    const qualityVariants: Variants = {
        initial: { scale: 1, opacity: 1 },
        hover: {
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
            filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
            transition: {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse" as const
            }
        }
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

    // Word animation variants for "Customers"
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

    const handleScroll = (direction: 'left' | 'right') => {
        const container = document.querySelector('.scroll-container');
        if (container) {
            // Temporarily pause the animation
            container.classList.remove('animate-scroll');
            
            // Update the index
            if (direction === 'right') {
                setStartIndex((prev) => (prev + 1) % reviews.length);
            } else {
                setStartIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
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
        for (let i = 0; i < reviews.length * 2; i++) {
            const index = (startIndex + i) % reviews.length;
            cards.push(reviews[index]);
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
                <motion.div
                    className="text-center mb-12"
                    initial="initial"
                    animate="animate"
                    variants={headingVariants}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                        Our Valued{" "}
                        <motion.span
                            variants={wordVariants}
                            className="inline-block bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-transparent bg-clip-text bg-[length:200%_100%]"
                        >
                            Customers
                        </motion.span>
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mx-auto mt-4 max-w-[200px] rounded-full"
                    />
                </motion.div>

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
                            {!isLoading && getVisibleCards().map((review, index) => (
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
                                                    src={review.avatarUrl}
                                                    alt={review.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-lg truncate">{review.name}</h3>
                                                <p className="text-gray-600 text-sm">{review.work}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 italic text-sm mt-4 line-clamp-3">
                                            "{review.review}"
                                        </p>
                                        <div className="mt-4 text-sm text-gray-500 flex items-center">
                                            <ChevronRight size={16} className="mr-1" />
                                            {review.place}
                                        </div>
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
                        {/* Home Made Products */}
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <motion.div
                                variants={homeMadeVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="hover"
                                className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer"
                            >
                                <UtensilsCrossed className="text-orange-500" size={28} />
                            </motion.div>
                            <h3 className="font-semibold text-lg mb-2">Home Made Products</h3>
                            <p className="text-gray-600">Fresh and authentic taste</p>
                        </div>

                        {/* Fast Delivery */}
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <motion.div
                                variants={truckVariants}
                                initial="initial"
                                whileHover="hover"
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <Truck className="text-green-500" size={28} />
                            </motion.div>
                            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Quick and reliable shipping</p>
                        </div>

                        {/* 24/7 Support */}
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <motion.div
                                variants={supportVariants}
                                initial="initial"
                                whileHover="hover"
                                className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <HeadphonesIcon className="text-orange-500" size={28} />
                            </motion.div>
                            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Always here to help you</p>
                        </div>

                        {/* Quality Products */}
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <motion.div
                                variants={qualityVariants}
                                initial="initial"
                                whileHover="hover"
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <Award className="text-green-500" size={28} />
                            </motion.div>
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