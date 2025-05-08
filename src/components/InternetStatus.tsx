import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import toast from 'react-hot-toast';

const InternetStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowNotification(true);
            toast.success('Back Online!', {
                icon: '🌐',
                duration: 3000,
                style: {
                    background: '#059669',
                    color: '#ffffff',
                }
            });
            setTimeout(() => setShowNotification(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowNotification(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {(!isOnline || showNotification) && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 ${
                        isOnline ? 'bg-green-600' : 'bg-red-600'
                    } text-white shadow-lg`}
                >
                    <div className="flex items-center gap-2 text-sm md:text-base">
                        {isOnline ? (
                            <>
                                <Wifi className="animate-pulse" size={20} />
                                <span className="font-medium">Back Online!</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="animate-pulse" size={20} />
                                <span className="font-medium">No Internet Connection</span>
                                <span className="hidden md:inline"> - Check your connection</span>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InternetStatus; 