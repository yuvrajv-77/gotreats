import React, { useEffect, useState } from 'react';

const Loader = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2 seconds
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Complete loading after fade out animation (0.5s)
            setTimeout(onLoadingComplete, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onLoadingComplete]);

    const foodImages = [
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400',
        'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=400',
        'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=400',
        'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=400',
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=400',
        'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=400',
        'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?q=80&w=400',
        'https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=400',
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=400',
        'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?q=80&w=400',
        'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?q=80&w=400',
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400'
    ];

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-500 overflow-hidden ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {/* Background with soothing gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9ff] via-[#e8f5e9] to-[#fff8e1] opacity-95"></div>

            {/* Background Image Grid */}
            <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-3 p-4 opacity-20">
                {foodImages.map((img, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg shadow-sm">
                        <img 
                            src={img} 
                            alt="Delicious Food"
                            loading="eager"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <div className="text-center backdrop-blur-[1px] p-8 rounded-2xl">
                    <div className="loader-text">
                        <p className="comfortaa font-bold tracking-tighter text-5xl mb-4">
                            <span className="text-green-500">go</span>
                            <span className="text-orange-600">treats</span>
                        </p>
                    </div>
                    <div className="loader-text loader-text-delay-1">
                        <p className="text-xl text-gray-600 mt-6">Welcome to</p>
                    </div>
                    <div className="loader-text loader-text-delay-2">
                        <p className="text-2xl font-semibold text-gray-700 mt-2">
                            GoTreats Tiffin & Food Service
                        </p>
                    </div>
                    <div className="mt-12 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-600"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader; 