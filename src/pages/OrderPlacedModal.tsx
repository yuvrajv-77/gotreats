import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
} from "@heroui/react";
import { motion } from 'framer-motion'
import Button from '@/components/Button'

import { BadgePercent, CircleCheck, CircleCheckBig } from 'lucide-react';
import { Voucher } from '@/types/voucherTypes';
import { useOrderPlacedModalStore } from '@/store/orderPlacedModalStore';
const OrderPlacedModal = (
    
) => {

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
            <ModalContent className='bg-green-500'>
                {(onClose) => (
                    <>
                        {/* <ModalHeader className="flex  items-center lancelot text-2xl gap-3">
                            <div className=' flex items-center justify-center w-full'>
                            </div>
                             </ModalHeader> */}
                        <ModalBody className=' my-20 flex flex-col items-center gap-10'>
                            <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeInOut", } }}
                            >
                                <CircleCheck size={90} strokeWidth={1.5} className='fill-green-700 stroke-white' />
                            </motion.span>
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeInOut",delay: 0.3  } }}
                            >
                                <p className='text-2xl font-bold text-white text-center'>Order Placed Successfully</p>
                            </motion.div>
                            <motion.p 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeInOut", delay: 0.4  } }}
                            className='text-center  text-white'>Thank you for your order! We’re preparing your delicious meal.</motion.p>
                        </ModalBody>
                        <ModalFooter className='overflow-hidden border-t border- border-white cursor-pointer transition-all duration-100 ease-in-out hover:bg-green-500' onClick={onClose}>
                            <p className=' text-lg text-center text-white group-hover:scale-110  w-full font-black '> Relax ({timer})</p>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default OrderPlacedModal