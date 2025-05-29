import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, RadioGroup, Radio, Chip, DateRangePicker, Input, NumberInput, Select, SelectItem, Switch 
} from "@heroui/react";
import Button from '@/components/Button'
import { Voucher, VoucherScope, VoucherDiscountType } from '@/types/voucherTypes'
import { Earth, IndianRupee, Percent, TicketPercent, UserRound, UserRoundPlus, UsersRound } from 'lucide-react'
import React from 'react'
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";
import { parseDate, getLocalTimeZone } from "@internationalized/date";

const defaultForm = {
    name: '',
    code: '',
    discountType: 'percentage' as VoucherDiscountType,
    discountValue: 0,
    minOrderValue: 100,
    maxUses: 1,
    scope: 'all' as VoucherScope,
    allowedUsers: [] as string[],
    singleUsePerCustomer: true,
};

const VoucherForm = ({ isOpen, onOpenChange, onOpen }: { isOpen: boolean, onOpenChange: () => void, onOpen: () => void }) => {
    const [form, setForm] = React.useState({ ...defaultForm });
    const [allowedUserInput, setAllowedUserInput] = React.useState('');
    const [dateRange, setDateRange] = React.useState<RangeValue<DateValue> | null>(null);

    React.useEffect(() => {
        if (!isOpen) {
            setForm({ ...defaultForm });
            setDateRange(null);
        }
    }, [isOpen]);

    // Handle scope change
    const handleScopeChange = (scope: VoucherScope) => {
        setForm(f => ({
            ...f,
            scope,
            allowedUsers: scope === 'all' ? [] : scope === 'single' && f.allowedUsers.length > 0 ? [f.allowedUsers[0]] : [],
        }));
    };

    // Handle allowed user add
    const handleAddAllowedUser = () => {
        if (!allowedUserInput.trim()) return;
        if (form.scope === 'single') {
            setForm(f => ({ ...f, allowedUsers: [allowedUserInput.trim()] }));
        } else if (form.scope === 'multiple') {
            setForm(f => ({ ...f, allowedUsers: Array.from(new Set([...f.allowedUsers, allowedUserInput.trim()])) }));
        }
        setAllowedUserInput('');
    };

    // Handle allowed user remove
    const handleRemoveAllowedUser = (user: string) => {
        setForm(f => ({ ...f, allowedUsers: f.allowedUsers.filter(u => u !== user) }));
    };

    // Handle discount type change
    const handleDiscountTypeChange = (val: string) => {
        setForm(f => ({ ...f, discountType: val as VoucherDiscountType }));
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Manual validation
    if (
        !form.name.trim() ||
        !form.code.trim() ||
        !form.discountValue ||
        !form.minOrderValue ||
        !form.maxUses ||
        !dateRange?.start ||
        !dateRange?.end ||
        ((form.scope === 'single' || form.scope === 'multiple') && form.allowedUsers.length === 0)
    ) {
        alert("Please fill all Voucher fields.");
        return;
    }

        // Convert DateValue to JS Date
        let startDate: Date | undefined = undefined;
        let expiryDate: Date | undefined = undefined;
        if (dateRange?.start && dateRange?.end) {
            startDate = dateRange.start.toDate(getLocalTimeZone());
            expiryDate = dateRange.end.toDate(getLocalTimeZone());
        }

        // Prepare voucher object
        const voucher: Partial<Voucher> = {
            ...form,
            allowedUsers: form.scope === 'all' ? undefined : form.allowedUsers,
            startDate,
            expiryDate,
            createdAt: new Date(),
            status: 'active'
        };
        console.log("Voucher Form Data:", voucher);
        onOpenChange();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg' scrollBehavior='inside' backdrop='blur'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex items-center lancelot text-2xl gap-3"> <TicketPercent size={25} strokeWidth={1.6} />Create Voucher</ModalHeader>
                        <ModalBody>
                            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                                <Input
                                    variant='faded'
                                    label="Voucher Name"
                                    placeholder="What's this Voucher For?"
                                    labelPlacement='outside'
                                    autoFocus
                                    isRequired
                                    isClearable
                                    value={form.name}
                                    onValueChange={val => setForm(f => ({ ...f, name: val }))}
                                />
                                <Input
                                    variant='faded'
                                    label="Voucher Code"
                                    placeholder="TASTY30"
                                    labelPlacement='outside'
                                    startContent={<TicketPercent size={20} color='gray' strokeWidth={1.6} />}
                                    isRequired
                                    isClearable
                                    value={form.code}
                                    onValueChange={val => setForm(f => ({ ...f, code: val.toUpperCase() }))}
                                />
                                <p className='text-sm'>Discount Type</p>
                                <div className='flex gap-4 justify-between'>
                                    <RadioGroup
                                        color='primary'
                                        isRequired
                                        value={form.discountType}
                                        onValueChange={handleDiscountTypeChange}
                                    >
                                        <Radio value="percentage">Percentage</Radio>
                                        <Radio value="fixed">Fixed</Radio>
                                    </RadioGroup>
                                    <NumberInput
                                        className='w-1/2'
                                        variant='faded'
                                        label="Discount Value"
                                        placeholder="Discount Value"
                                        labelPlacement='outside'
                                        startContent={ form.discountType === 'percentage' ? <Percent size={20} color='gray' strokeWidth={1.6} /> : <IndianRupee size={20} color='gray' strokeWidth={1.6} />}
                                        isRequired
                                        value={form.discountValue}
                                        onValueChange={val => setForm(f => ({ ...f, discountValue: Number(val) }))}
                                    />
                                </div>
                                <div className='flex gap-4'>
                                    <NumberInput
                                        variant='faded'
                                        label="Minimum Order Value"
                                        placeholder="Minimum Order Value"
                                        labelPlacement='outside'
                                        startContent={<IndianRupee size={20} color='gray' strokeWidth={1.6} />}
                                        isRequired
                                        value={form.minOrderValue}
                                        onValueChange={val => setForm(f => ({ ...f, minOrderValue: Number(val) }))}
                                    />
                                    <NumberInput
                                        variant='faded'
                                        label="Maximum Uses"
                                        placeholder="Limits the number of times voucher can be used"
                                        labelPlacement='outside'
                                        isRequired
                                        value={form.maxUses}
                                        onValueChange={val => setForm(f => ({ ...f, maxUses: Number(val) }))}
                                    />
                                </div>
                                <div className='flex gap-4'>
                                    <DateRangePicker
                                        className=""
                                        label="Start and Expiry Date"
                                        variant='faded'
                                        labelPlacement='outside'
                                        isRequired
                                        value={dateRange}
                                        onChange={setDateRange}
                                    />
                                </div>
                                <div className='flex gap-4'>
                                    <Select
                                        className="max-w-1/2"
                                        variant='faded'
                                        placeholder='Select Scope of Voucher'
                                        radius='lg' 
                                        labelPlacement='outside'
                                        label="Select Scope"
                                        selectedKeys={[form.scope]}
                                        onSelectionChange={keys => handleScopeChange(Array.from(keys)[0] as VoucherScope)}
                                    >
                                        <SelectItem key="all" startContent={<Earth size={20} strokeWidth={1.6} />}>Everyone</SelectItem>
                                        <SelectItem key="multiple" startContent={<UsersRound size={20} strokeWidth={1.6} />}>Multiple</SelectItem>
                                        <SelectItem key="single" startContent={<UserRound size={20} strokeWidth={1.6} />}>Single</SelectItem>
                                    </Select>
                                    <Switch
                                        size='sm'
                                        isSelected={form.singleUsePerCustomer}
                                        onValueChange={val => setForm(f => ({ ...f, singleUsePerCustomer: val }))}
                                    >
                                        Single Use Per Customer
                                    </Switch>
                                </div>
                                {/* Allowed Users: only for single/multiple */}
                                {(form.scope === 'single' || form.scope === 'multiple') && (
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-end gap-4'>
                                            <Input
                                                variant='faded'
                                                label={form.scope === 'single' ? "Allowed User" : "Allowed Users"}
                                                placeholder="Enter Registered Phone Number"
                                                labelPlacement='outside'
                                                isRequired
                                                isClearable
                                                value={allowedUserInput}
                                                onValueChange={setAllowedUserInput}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddAllowedUser();
                                                    }
                                                }}
                                                isDisabled={form.scope === 'single' && form.allowedUsers.length >= 1}
                                            />
                                            <button
                                                type="button"
                                                className='px-4 py-2 rounded-xl border-2 hover:border-orange-400 bg-primary text-white'
                                                onClick={handleAddAllowedUser}
                                                disabled={form.scope === 'single' && form.allowedUsers.length >= 1}
                                            >
                                                <UserRoundPlus size={20} strokeWidth={1.6} />
                                            </button>
                                        </div>
                                        <div className='flex justify-center gap-x-2 gap-y-2 flex-wrap'>
                                            {form.allowedUsers.map(user => (
                                                <Chip
                                                    key={user}
                                                    variant='faded'
                                                    color='success'
                                                    size='md'
                                                    onClose={() => handleRemoveAllowedUser(user)}
                                                >
                                                    {user}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="secondary" onClick={onClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" onClick={handleSubmit}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default VoucherForm