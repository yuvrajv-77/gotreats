import React from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
} from "@heroui/react";
import Button from '@/components/Button'

import { BadgePercent } from 'lucide-react';
import { Voucher } from '@/types/voucherTypes';
const VoucherAppliedModal = (
    {
        isOpen,
        onOpenChange,
        // onOpen,
        voucherCode,
        discount,

    }: {
        isOpen: boolean,
        onOpenChange: () => void,
        // onOpen: () => void,
        voucherCode: string,
        discount: number

    }
) => {


    return (
        <Modal isOpen={isOpen} placement="center"  onOpenChange={onOpenChange} size='sm' className='relative' scrollBehavior='inside' backdrop='blur'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex  items-center lancelot text-2xl gap-3">
                            <div className='absolute -top-11 left-1/2 -translate-x-1/2 '>
                                <BadgePercent size={90} strokeWidth={1.5} className='fill-green-700 stroke-white' />
                            </div>
                             </ModalHeader>
                        <ModalBody>
                            <div className='flex flex-col items-center gap-5 mt-5'>
                                <p className=' text-lg font-black tracking-tighter  text-zinc-700'>'{voucherCode}' APPLIED</p>
                                <div className='text-center '>
                                    <h1 className='text-4xl text-black font-bold mt-3'>₹{discount}</h1>
                                    <p className='font-bold text-lg tracking-tighter'>savings with this voucher</p>
                                </div>
                                <hr className='w-5 border-1 border-black' />
                                <p className=' px-5 text-center text- font-black tracking-tighter mb-4 text-zinc-700'>Use Vouchers and save every time you order</p>
                            </div>
                        </ModalBody>
                        <ModalFooter className='overflow-hidden group border-t cursor-pointer transition-all duration-100 ease-in-out hover:bg-green-500' onClick={onClose}>
                            <p className='text-orange-500 text-lg text-center group-hover:text-white group-hover:scale-110  w-full font-black '> YAY!</p>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default VoucherAppliedModal