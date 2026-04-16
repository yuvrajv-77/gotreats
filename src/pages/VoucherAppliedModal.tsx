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
            <ModalContent className="bg-[var(--brand-charcoal)] border border-[var(--brand-border)]">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex  items-center lancelot text-2xl gap-3">
                            <div className='absolute -top-11 left-1/2 -translate-x-1/2 '>
                                <BadgePercent size={90} strokeWidth={1.5} className='fill-emerald-500 stroke-[var(--brand-charcoal)]' />
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className='flex flex-col items-center gap-5 mt-5'>
                                <p className='text-lg font-mono tracking-tighter text-emerald-400 font-bold'>'{voucherCode}' APPLIED</p>
                                <div className='text-center '>
                                    <h1 className='text-4xl text-[var(--brand-cream)] font-heading mt-3'>₹{discount}</h1>
                                    <p className='font-mono text-[var(--brand-cream)]/50 text-sm mt-1'>savings with this voucher</p>
                                </div>
                                <hr className='w-5 border-[var(--brand-border)]' />
                                <p className='px-5 text-center text-sm font-body tracking-tight mb-4 text-[var(--brand-cream)]/70'>Use Vouchers and save every time you order!</p>
                            </div>
                        </ModalBody>
                        <ModalFooter className='overflow-hidden group border-t border-[var(--brand-border)] cursor-pointer transition-all duration-300 ease-in-out hover:bg-emerald-500/10' onClick={onClose}>
                            <p className='text-emerald-400 text-sm tracking-widest text-center group-hover:text-emerald-300 w-full font-mono font-bold uppercase'> YAY!</p>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default VoucherAppliedModal