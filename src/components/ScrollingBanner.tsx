import React from 'react';
import { ChefHat, Zap,IndianRupee, Truck, Clock, Star, UtensilsCrossed, ShieldCheck } from 'lucide-react';

const ScrollingBanner = () => {
    const bannerItems = [
        { text: "Affordable", icon: <IndianRupee size={20} /> },
        { text: "Order Delivery in 1 Hour", icon: <Truck size={20} /> },
        { text: "Best Quality", icon: <Star size={20} /> },
        { text: "Fresh Food", icon: <UtensilsCrossed size={20} /> },
        { text: "Hygienic Preparation", icon: <ShieldCheck size={20} /> },
        { text: "Free Delivery upto 500 meters", icon: <Truck size={20} /> },
    ];

    // Triple the items for even more seamless scrolling
    const tripledItems = [...bannerItems, ...bannerItems, ...bannerItems];

    return (
        <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap">
            <div className="animate-scroll inline-block">
                {tripledItems.map((item, index) => (
                    <span 
                        key={index} 
                        className="inline-flex items-center mx-6"
                    >
                        <span className="mr-2">{item.icon}</span>
                        {item.text}
                        <span className="mx-6">•</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ScrollingBanner; 