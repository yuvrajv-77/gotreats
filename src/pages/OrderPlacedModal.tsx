import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import { motion } from 'framer-motion'
import { CircleCheck, Clock } from 'lucide-react';
import { useOrderPlacedModalStore } from '@/store/orderPlacedModalStore';

const OrderPlacedModal = () => {

    const { isOpen, close } = useOrderPlacedModalStore();
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        if (isOpen) {
            setTimer(5);
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            const timeout = setTimeout(() => close(), 4000);
            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [isOpen, close]);

    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={close} size='lg' hideCloseButton shadow='none' className='relative' scrollBehavior='inside' backdrop='blur'>
            <ModalContent className='bg-[var(--brand-dark)] border border-[var(--brand-border)]'>
                {(onClose) => (
                    <>
                        <ModalBody className='my-16 flex flex-col items-center gap-8 px-8'>
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }}
                                className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                            >
                                <CircleCheck size={50} strokeWidth={1.5} className='text-emerald-400' />
                            </motion.div>
                            
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeInOut", delay: 0.2 } }}
                                className="text-center space-y-3"
                            >
                                <p className='font-heading text-3xl text-[var(--brand-cream)]'>Order Placed</p>
                                <p className='font-body text-[var(--brand-cream)]/60 text-sm leading-relaxed max-w-sm'>
                                    Thank you for your order! We’re preparing your delicious meal.
                                </p>
                            </motion.div>
                        </ModalBody>
                        <ModalFooter className='border-t border-[var(--brand-border)] p-0'>
                            <button 
                                className='w-full py-4 bg-[var(--brand-charcoal)] hover:bg-white/5 transition-colors flex items-center justify-center gap-2'
                                onClick={onClose}
                            >
                                <span className='text-[var(--brand-cream)]/50 font-mono text-xs uppercase tracking-widest'>Relax</span>
                                <span className='w-5 h-5 rounded-full bg-[var(--brand-flame)]/20 text-[var(--brand-flame)] font-mono text-[10px] flex items-center justify-center'>{timer}</span>
                            </button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default OrderPlacedModal