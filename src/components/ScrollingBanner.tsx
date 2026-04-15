import React from 'react';
import { ChefHat, Zap,IndianRupee, Truck, Clock, Star, UtensilsCrossed, ShieldCheck } from 'lucide-react';

const ScrollingBanner = () => {
    const bannerItems = [
        { text: "Affordable", icon: <IndianRupee size={20} strokeWidth={3} /> },
        { text: "Order Delivery in 1 Hour", icon: <Truck size={20}  strokeWidth={3}/> },
        { text: "Best Quality", icon: <Star size={20}  strokeWidth={3}/> },
        { text: "Fresh Food", icon: <UtensilsCrossed size={20}  strokeWidth={3}/> },
        { text: "Hygienic Preparation", icon: <ShieldCheck size={20}  strokeWidth={3}/> },
        { text: "Free Delivery upto 500 meters", icon: <Truck size={20}  strokeWidth={3}/> },
    ];

    // Triple the items for even more seamless scrolling
    const tripledItems = [...bannerItems, ...bannerItems, ...bannerItems];

    return (
        <div className="bg-yellow-300 text-orange-800 py- overflow-hidden whitespace-nowrap">
            <div className="animate-scroll flex py-4">
                {tripledItems.map((item, index) => (
                    <span 
                        key={index} 
                        className="inline-flex items-center gap-3 font-mouse uppercase tracking-widest font-bold text-2xl mx-6"
                    >
                        <span className="">{item.icon}</span>
                        {item.text}
                        
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ScrollingBanner; 