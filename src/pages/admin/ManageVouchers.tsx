import { lazy, Suspense } from 'react';
import Button, { IconButton } from '@/components/Button'
import { Switch, useDisclosure, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { BadgeIndianRupee, BadgePercent, ChevronDown, Copy, Earth, Plus, RefreshCcw, Trash, UserRound, UsersRound } from 'lucide-react'
// import VoucherForm from './VoucherForm'
const VoucherForm = lazy(() => import('./VoucherForm'));
import { deleteVoucher, getVouchers, updateVoucherStatus } from '@/services/voucherService'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'


const ManageVouchers = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Fetch vouchers using React Query
    const { data: vouchers = [], isLoading, refetch } = useQuery({
        queryKey: ['vouchers'],
        queryFn: getVouchers,
    });

    console.log("vouchers", vouchers);

    const handleDeleteVoucher = async (id: string) => {
        // window.alert("Are you sure you want to delete this voucher?");
        if (!window.confirm("Are you sure you want to delete this voucher?")) {
            return;
        }
        await deleteVoucher(id);
        refetch();
        toast.success("Voucher deleted successfully");
    }


    return (
        <main className='mx-4 w-full'>
            <h1 className="md:text-4xl text-3xl font-bold text-center md:text-start lancelot  text-white">Manage Vouchers</h1>
            <div className='flex justify-end gap-5 items-center'>
                <button type='button' className='p-2 cursor-pointer bg-green-100   rounded-full transition-colors'
                    onClick={() => { refetch(); toast.success("Vouchers Refetched") }}>
                    <RefreshCcw />
                </button>
                <Button variant='primary' onClick={onOpen}>
                    <Plus /> Add Voucher
                </Button>
            </div>

            <div className="overflow-x-auto my-5">
                {isLoading ? (
                    <p className='text-center my-10'>Loading vouchers...</p>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-green-500 text-white">
                            <tr>
                                {/* <th className="px-6 py-3">ID</th> */}
                                <th className="px-6 py-3 ">Code</th>
                                <th className="px-6 py-3">Value</th>
                                <th className="px-6 py-3">Min Order</th>
                                {/* <th className="px-6 py-3">Max Uses</th> */}
                                <th className="px-6 py-3">Scope</th>
                                <th className="px-6 py-3">Current Uses</th>
                                <th className="px-6 py-3">Creation Date</th>
                                <th className="px-6 py-3">Start Date</th>
                                <th className="px-6 py-3">Expiry Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {vouchers
                                .slice() // create a shallow copy to avoid mutating original
                                .sort((a, b) => {
                                    // Only move expired to bottom, keep active/inactive together
                                    if (a.status === 'expired' && b.status !== 'expired') return 1;
                                    if (a.status !== 'expired' && b.status === 'expired') return -1;
                                    return 0; // keep original order for active/inactive
                                })
                                .map((voucher) => {
                                    // Helper to handle Firestore Timestamp or string/Date
                                    const parseDate = (d: any) =>
                                        d
                                            ? typeof d.toDate === 'function'
                                                ? d.toDate()
                                                : new Date(d)
                                            : null;

                                    const createdAt = parseDate(voucher.createdAt);
                                    const startDate = parseDate(voucher.startDate);
                                    const expiryDate = parseDate(voucher.expiryDate);

                                    return (
                                        <tr key={voucher.id} className={` border-b text-sm  ${voucher.status === 'active' ? 'bg-green-50' : voucher.status === 'inactive' ? 'bg-gray-50' : 'bg-pink-50 text-red-900/50'} `}>
                                            {/* <td className="px-6 py-3 text-center">{voucher.id}</td> */}

                                            {/* Voucher Code  */}
                                            <td className="px-6 py-2 text-center border-b border-r" onClick={() => { navigator.clipboard.writeText(voucher.code); toast.success(`${voucher.code} copied to clipboard!`); }}>
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
                                            <td className="px-6 py-2 text-center font-bold border-b border-r">
                                                {voucher.discountType === 'percentage'
                                                    ? `${voucher.discountValue}%`
                                                    : `₹${voucher.discountValue}`}
                                            </td>

                                            {/* Min Order Value */}
                                            <td className="px-6 py-2 text-center border-b border-r">₹{voucher.minOrderValue}</td>



                                            {/* Scope */}
                                            <td className="px-6 py-2 flex items-center justify-center">
                                                <Popover placement='bottom'>
                                                    <PopoverTrigger className="cursor-pointer">
                                                        {
                                                            voucher.scope === 'all' ? <Earth className='w-5 h-5' /> : <p className='flex items-center gap-1'>
                                                                <UsersRound className='w-5 h-5' /> <ChevronDown size={15} /></p>
                                                        }
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        {
                                                            voucher.scope !== 'all' ? <span className='flex flex-col gap-2 p-2'>
                                                                Applicable To :{
                                                                    voucher.allowedUsers?.map((user, index) => (
                                                                        <p key={index} className="text-sm flex items-center gap-2">
                                                                            <UserRound size={15} /> {user}
                                                                        </p>
                                                                    ))
                                                                }</span> : "Applicable to all customers"
                                                        }
                                                    </PopoverContent>
                                                </Popover>
                                            </td>

                                            {/* Max Uses */}
                                            <td className="px-6 py-2 text-center border-b border-x border-r">
                                                <Popover placement='bottom' showArrow >
                                                    <PopoverTrigger className="cursor-pointer flex justify-center">
                                                        <p className='flex items-center gap-1'> {voucher.currentUses}/{voucher.maxUses} <ChevronDown size={15} /></p>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        {
                                                            <span className='flex flex-col gap-2 p-2'>
                                                                Used By:{
                                                                    voucher.userUsage &&
                                                                    Object.entries(voucher.userUsage).map(([user, count], index) => (
                                                                        <p key={index} className="text-sm flex items-center gap-2">
                                                                            <UserRound size={15} /> {user} : <span className="ml-1 ">{count} Time{count > 1 ? 's' : ''}</span>
                                                                        </p>
                                                                    ))
                                                                }</span>
                                                        }
                                                    </PopoverContent>
                                                </Popover>
                                            </td>

                                            <td className="px-6 py-2 text-center  border-r">{createdAt ? createdAt.toLocaleDateString('en-GB') : '-'}</td>
                                            <td className="px-6 py-2 text-center  border-r">{startDate ? startDate.toLocaleDateString('en-GB') : '-'}</td>
                                            <td className="px-6 py-2 text-center border-r">{expiryDate ? expiryDate.toLocaleDateString('en-GB') : '-'}</td>

                                            <td className="px-6 py-2 text-center border-r">
                                                <Switch
                                                    color="success"
                                                    size="sm"
                                                    isSelected={voucher.status === 'active'}
                                                    isDisabled={voucher.status === 'expired'}
                                                    onValueChange={async (selected) => {
                                                        try {
                                                            await updateVoucherStatus(voucher.id, selected ? 'active' : 'inactive');
                                                            toast.success(`Voucher status updated to ${selected ? 'active' : 'inactive'}`);
                                                            refetch();
                                                        } catch (err) {
                                                            toast.error('Failed to update voucher status');
                                                        }
                                                    }}
                                                />

                                            </td>
                                            <td className="px-6 py-2 flex justify-center">
                                                <IconButton className='bg-red-400 hover:bg-white hover:border border-red-400 border ' onClick={() => handleDeleteVoucher(voucher.id)} >
                                                    <Trash size={20} className='' />
                                                </IconButton>
                                            </td>

                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                )}
                {
                    !isLoading && vouchers.length === 0 &&
                    <p className='comfortaa text-2xl text-gray-600 animate-bounce font-bold my-20 text-center'>No vouchers found</p>
                }
            </div>
            <Suspense fallback={null}>
                <VoucherForm isOpen={isOpen} onOpenChange={onOpenChange} onOpen={onOpen} refetchVouchers={refetch} />
            </Suspense>
        </main >
    )
}

export default ManageVouchers