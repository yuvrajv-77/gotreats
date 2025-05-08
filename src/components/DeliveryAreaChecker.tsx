import { useState } from 'react';
import { MapPin, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DELIVERY_AREAS = [
    'borivali west',
    'kandivali west',
    'saibaba nagar',
    'mulji nagar',
    'satya nagar',
    'chikuwadi',
    'shimpoli',
    'mahavir nagar',
    'ram nagar',
    'haridas nagar'
];

interface DeliveryAreaCheckerProps {
    isOpen: boolean;
    onClose: () => void;
    setMobileMenuOpen?: (open: boolean) => void;
}

const DeliveryAreaChecker = ({ isOpen, onClose, setMobileMenuOpen }: DeliveryAreaCheckerProps) => {
    const [address, setAddress] = useState('');
    const [checkResult, setCheckResult] = useState<{
        available: boolean;
        message: string;
    } | null>(null);
    const navigate = useNavigate();

    const handleShopRedirect = () => {
        onClose();
        if (setMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
        navigate('/shop');
    };

    const checkDeliveryAvailability = () => {
        const normalizedAddress = address.toLowerCase().trim();
        
        // Check if any of the delivery areas are mentioned in the address
        const isAvailable = DELIVERY_AREAS.some(area => 
            normalizedAddress.includes(area)
        );

        setCheckResult({
            available: isAvailable,
            message: isAvailable 
                ? "Great news! We deliver to your area. You can order food/tiffin now! 🎉" 
                : "Sorry, we currently don't deliver to your area. Please check back later as we're expanding! 😊"
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <motion.h3 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-xl font-semibold flex items-center gap-2"
                        >
                            <MapPin className="text-green-500" />
                            Check Delivery Availability
                        </motion.h3>
                        <motion.button
                            whileHover={{ rotate: 90 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </motion.button>
                    </div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter your complete address
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                                placeholder="Ex: Flat 123, Building Name, Street, Area..."
                                rows={3}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={checkDeliveryAvailability}
                            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!address.trim()}
                        >
                            <MapPin size={18} />
                            Check Availability
                        </motion.button>

                        <AnimatePresence mode="wait">
                            {checkResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`p-4 rounded-lg ${
                                        checkResult.available ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                                    }`}
                                >
                                    <p>{checkResult.message}</p>
                                    {checkResult.available && (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            onClick={handleShopRedirect}
                                            className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full justify-center"
                                        >
                                            <ShoppingBag size={18} />
                                            Check Food/Tiffin Options
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6"
                        >
                            <p className="text-sm text-gray-600 mb-2">We currently deliver in:</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {DELIVERY_AREAS.map((area, index) => (
                                    <motion.div 
                                        key={area}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                        className="flex items-center gap-1 text-gray-700 capitalize hover:text-green-600 transition-colors cursor-default"
                                    >
                                        <MapPin size={14} className="text-orange-500" />
                                        {area}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DeliveryAreaChecker; 