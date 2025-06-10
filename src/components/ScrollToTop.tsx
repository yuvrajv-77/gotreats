import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import './ScrollToTop.css';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const location = useLocation();

    // Calculate scroll progress
    const calculateScrollProgress = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        setScrollProgress(Math.min(scrollPercent, 100));
        setIsVisible(scrollTop > 300);
    };

    useEffect(() => {
        window.addEventListener('scroll', calculateScrollProgress);
        return () => window.removeEventListener('scroll', calculateScrollProgress);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Don't render on contact page
    if (location.pathname === '/contact') {
        return null;
    }

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed hidden bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-110 group"
                    style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}
                >
                    {/* Liquid fill effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div 
                            className="absolute bottom-0 left-0 w-full bg-orange-600 scroll-progress-fill"
                            style={{ 
                                height: `${scrollProgress}%`,
                                opacity: 0.35,
                                transform: 'translateY(100%) translateY(-' + scrollProgress + '%)',
                                borderTopLeftRadius: scrollProgress < 100 ? '50%' : '0',
                                borderTopRightRadius: scrollProgress < 100 ? '50%' : '0'
                            }}
                        >
                            {/* Liquid wave effect */}
                            <div 
                                className="absolute top-0 left-0 w-full h-2 transform -translate-y-1/2 wave-animation"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                                }}
                            />
                        </div>
                    </div>
                    
                    {/* Arrow icon */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <ChevronUp 
                            size={24} 
                            className={`transition-all duration-300 group-hover:-translate-y-1
                                ${scrollProgress === 100 ? 'text-white' : 'text-orange-500'}`}
                        />
                    </div>
                </button>
            )}
        </>
    );
};

export default ScrollToTop; 