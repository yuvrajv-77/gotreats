import Button, { IconButton } from '@/components/Button'
import { Voucher } from '@/types/voucherTypes'
import { Switch, useDisclosure, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { BadgeIndianRupee, BadgePercent, Copy, Earth, Plus, UserRound, UsersRound } from 'lucide-react'
import React from 'react'
import VoucherForm from './VoucherForm'


const ManageVouchers = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const vouchers: Voucher[] = [
        {
            id: '124',
            code: 'SUMMER2023',
            discountType: 'percentage',
            discountValue: 20,
            minOrderValue: 500,
            maxUses: 100,
            currentUses: 62,
            scope: 'all',
            allowedUsers: [],
            startDate: new Date('2023-06-01'),
            expiryDate: new Date('2023-08-31'),
            createdAt: new Date('2023-06-01'),
            status: 'active'
        },
        {
            id: '854',
            code: 'HAPPYNEWYEAR',
            discountType: 'fixed',
            discountValue: 200,
            minOrderValue: 1500,
            maxUses: 20,
            currentUses: 16,
            scope: 'multiple',
            allowedUsers: ['7905146108', '7905146109'],
            startDate: new Date('2023-12-31'),
            expiryDate: new Date('2024-01-02'),
            createdAt: new Date('2023-06-01'),
            status: 'active'
        },
        {
            id: '854',
            code: 'HAPPYNEWYEAR',
            discountType: 'fixed',
            discountValue: 200,
            minOrderValue: 1500,
            maxUses: 20,
            currentUses: 16,
            scope: 'single',
            allowedUsers: ['7905146108'],
            startDate: new Date('2023-12-31'),
            expiryDate: new Date('2024-01-02'),
            createdAt: new Date('2023-06-01'),
            status: 'active'
        },


    ]
    return (
        <main className='mx-4 w-full'>
            <div className='flex justify-between items-center'>
                <h1 className="md:text-4xl text-3xl font-bold text-center md:text-start lancelot mb-4 md:mb-6 text-white">Manage Vouchers</h1>
                <Button variant='primary' onClick={onOpen}>
                    <Plus /> Add Voucher
                </Button>
            </div>

            <div className="overflow-x-auto my-10">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-green-500 text-white">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3 ">Code</th>
                            <th className="px-6 py-3">Value</th>
                            <th className="px-6 py-3">Min Order</th>
                            {/* <th className="px-6 py-3">Max Uses</th> */}
                            <th className="px-6 py-3">Current Uses</th>
                            <th className="px-6 py-3">Scope</th>
                            <th className="px-6 py-3">Creation Date</th>
                            <th className="px-6 py-3">Start Date</th>
                            <th className="px-6 py-3">Expiry Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((voucher) => (
                            <tr key={voucher.id} className={`border-b text-sm  ${voucher.status === 'active' ? 'bg-green-50' : voucher.status === 'inactive' ? 'bg-gray-50' : 'bg-pink-50 text-red-900/50'} `}>
                                <td className="px-6 py-3 text-center">{voucher.id}</td>

                                {/* Voucher Code  */}
                                <td className="px-6 py-3 text-center " onClick={() => navigator.clipboard.writeText(voucher.code)}>
                                    <span
                                        className={`px-3 py-1 rounded-lg border flex items-center justify-between gap-2  font-semibold ${voucher.status === 'active'
                                            ? 'bg-green-100 text-green-800 border-green-400'
                                            : voucher.status === 'inactive'
                                                ? 'bg-gray-100 text-gray-800 border-gray-400'
                                                : 'bg-red-100 text-red-900/50 border-red-300'
                                            }`}
                                    >
                                        {voucher.discountType === 'percentage' ? <BadgePercent size={22} strokeWidth={1.8} /> : <BadgeIndianRupee size={22} strokeWidth={1.8} />}
                                        {voucher.code}
                                        <Copy size={21} strokeWidth={1.8} className='cursor-pointer hover:scale-105 transition-all duration-100' />
                                    </span>
                                </td>

                                {/* Voucher Value */}
                                <td className="px-6 py-3 text-center">
                                    {voucher.discountType === 'percentage'
                                        ? `${voucher.discountValue}%`
                                        : `₹${voucher.discountValue}`}
                                </td>

                                {/* Min Order Value */}
                                <td className="px-6 py-3 text-center">₹{voucher.minOrderValue}</td>

                                {/* Max Uses */}
                                <td className="px-6 py-3 text-center">{voucher.currentUses}/{voucher.maxUses}</td>

                                {/* Scope */}
                                <td className="px-6 py-3 flex items-center justify-center">
                                    <Popover placement='bottom'>
                                        <PopoverTrigger className="cursor-pointer">
                                        {
                                            voucher.scope === 'all' ? <Earth className='w-5 h-5' /> :
                                                voucher.scope === 'single' ? <UserRound className='w-5 h-5' /> : <UsersRound className='w-5 h-5' />
                                        }
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            {
                                                voucher.scope !== 'all' ? <span className='flex flex-col gap-2 p-2'>
                                                    Applicable To :{
                                                    voucher.allowedUsers?.map((user, index) => (
                                                        <p key={index} className="  text-sm  flex items-center gap-2">
                                                           <UserRound size={15}/> {user}
                                                        </p>
                                                    ))
                                                    }</span> :"Applicable to all customers"
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </td>
                                <td className="px-6 py-3 text-center">{voucher.createdAt.toLocaleDateString()}</td>
                                <td className="px-6 py-3 text-center">{voucher.startDate.toLocaleDateString()}</td>
                                <td className="px-6 py-3 text-center">{voucher.expiryDate.toLocaleDateString()}</td>

                                <td className="px-6 py-3 text-center">
                                    <Switch
                                        color="success"
                                        size="sm"
                                        isSelected={voucher.status === 'active'}
                                        isDisabled={voucher.status === 'expired'}
                                        onValueChange={() => {/* handle status change here */ }}
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    vouchers.length === 0 &&
                    <p className='comfortaa text-2xl text-gray-600 animate-bounce font-bold my-20 text-center'>No vouchers found</p>
                }
            </div>

            <VoucherForm isOpen={isOpen} onOpenChange={onOpenChange} onOpen={onOpen} />

        </main>
    )
}

export default ManageVouchers