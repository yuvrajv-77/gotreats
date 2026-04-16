import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
} from "@heroui/react";

import Button from '@/components/Button'
import { Voucher, VoucherScope, VoucherDiscountType } from '@/types/voucherTypes'
import { BadgeIndianRupee, BadgePercent, Earth, IndianRupee, Percent, TicketPercent, UserRound, UserRoundPlus, UsersRound } from 'lucide-react'
import React, { useEffect } from 'react'
import { getVoucherByCode, validateVoucher } from "@/services/voucherService";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const VoucherModal = (
    {
        isOpen,
        onOpenChange,
        onOpen,
        onValidVoucher,
        onOpenVoucherAppliedModal
    }: {
        isOpen: boolean,
        onOpenChange: () => void,
        onOpen: () => void,
        onOpenVoucherAppliedModal: () => void,
        onValidVoucher: (voucher: Voucher) => void
    }
) => {

    const { grossTotalPrice, totalPrice, calculateGrossTotalPrice, calculateTotalPrice, } = useCartStore()

    const userDetails = useAuthStore((state) => state.userDetails)
    const [code, setCode] = React.useState('TASTY23');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [voucher, setVoucher] = React.useState<Voucher | null>(null);


    const handleCheckVoucher = async () => {
        setVoucher(null);
        setLoading(true);
        setError('');

        if (!code.trim()) {
            setError('Please enter a voucher code');
            setLoading(false);
            return;
        }

        const voucher = await getVoucherByCode(code);
        if (voucher) {

            console.log('Voucher found:', voucher);
            setLoading(false);
            // onValidVoucher(voucher); 
        }
        if (!voucher) {
            setError('Voucher not found');
            console.log('Voucher not found');
            setLoading(false);
            return;

        }

        const validationError = validateVoucher(voucher, userDetails.phoneNumber, grossTotalPrice);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        } else {
            setVoucher(voucher);
            // onValidVoucher(voucher);
            setLoading(false);
        }
    }



    useEffect(() => {
        if (!isOpen) {
            setVoucher(null);
            setCode('');
            setError('');
        }
    })


    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange} size='lg' scrollBehavior='inside' backdrop='blur'>
            <ModalContent className="bg-[var(--brand-charcoal)] border border-[var(--brand-border)]">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex items-center font-heading text-[var(--brand-cream)] text-xl gap-2 pt-6">
                            <TicketPercent size={20} className="text-[var(--brand-flame)]" /> Apply Voucher
                        </ModalHeader>
                        <ModalBody className="pb-6">
                            <p className="font-mono text-xs text-[var(--brand-cream)]/40 uppercase tracking-widest mb-1 mt-2">Enter Code</p>
                            <div className="relative flex items-center bg-[var(--brand-dark)] border border-[var(--brand-border)] rounded-xl overflow-hidden focus-within:border-[var(--brand-flame)]/50 transition-colors">
                                <div className="pl-4 text-[var(--brand-flame)]">
                                    <TicketPercent size={18} />
                                </div>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="EXAMPLEX20"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toLocaleUpperCase())}
                                    className="flex-1 bg-transparent px-3 py-3.5 text-sm text-[var(--brand-cream)] placeholder-[var(--brand-cream)]/20 focus:outline-none font-mono uppercase font-bold tracking-widest"
                                />
                                <button
                                    onClick={handleCheckVoucher}
                                    disabled={loading}
                                    className="h-full px-5 bg-[var(--brand-flame)] text-white font-mono text-xs font-bold tracking-widest hover:bg-[#C94808] transition-colors disabled:opacity-50"
                                >
                                    {loading ? '...' : 'APPLY'}
                                </button>
                            </div>

                            <div>
                                {error && <p className="text-red-400 mt-3 text-xs font-mono text-center">{error}</p>}
                                {
                                    voucher && (
                                        <>
                                            {!error && <p className="mt-3 text-center text-emerald-400 font-mono text-xs">You are eligible for this voucher</p>}

                                            <div className="border border-dashed border-[var(--brand-flame)]/30 rounded-xl p-5 mt-4 gap-y-3 flex flex-col bg-[var(--brand-flame)]/5">
                                                <div className="flex justify-center">
                                                    <span className="px-3 py-1.5 rounded-lg border items-center inline-flex gap-2 font-mono text-sm font-bold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                        {voucher.discountType === 'percentage' ? <BadgePercent size={16} /> : <BadgeIndianRupee size={16} />}
                                                        {voucher.code}
                                                    </span>
                                                </div>
                                                <p className="font-heading text-center text-[var(--brand-cream)] text-lg"> {voucher.name}</p>
                                                <p className="text-sm font-body text-[var(--brand-cream)]/60 text-center leading-relaxed">
                                                    {`Use code "${voucher.code}" & get ${voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : `₹${voucher.discountValue}`} off on orders above ₹${voucher.minOrderValue}. `}
                                                </p>
                                                
                                                <div className="mt-2 border-t border-[var(--brand-flame)]/10 pt-3">
                                                    <p className="font-mono text-[10px] text-[var(--brand-cream)]/40 uppercase tracking-widest mb-2">Terms & Conditions</p>
                                                    <ul className="list-disc list-inside text-xs font-body text-[var(--brand-cream)]/50 space-y-1">
                                                        {voucher.singleUsePerCustomer && <li>Offer is valid for one time use only.</li>}
                                                        <li>
                                                            Offer valid till {
                                                                (() => {
                                                                    let expiry = voucher.expiryDate;
                                                                    if (!expiry) return "N/A";
                                                                    if (typeof (expiry as any).toDate === "function") {
                                                                        expiry = (expiry as any).toDate();
                                                                    } else {
                                                                        expiry = new Date(expiry as any);
                                                                    }
                                                                    return expiry.toLocaleDateString('en-GB');
                                                                })()
                                                            }
                                                        </li>
                                                    </ul>
                                                </div>
                                                {
                                                    !error && (

                                                        <Button variant="success" onClick={() => {
                                                            onValidVoucher(voucher);
                                                            onClose();
                                                            onOpenVoucherAppliedModal();
                                                        }} 
                                                        className="w-full mt-2">
                                                            Select Voucher
                                                        </Button>
                                                    )
                                                }
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default VoucherModal