import { Link, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Menu, UserRound } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { ToastProvider, useDisclosure } from "@heroui/react";
import { Box, Calendar, Home, Inbox, MessageCircleMore, Salad, Search, Settings, TicketPercent } from "lucide-react"
import { handleLogout } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';



const AdminLayout = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { userDetails } = useAuthStore()
    // Menu items.
    const items = [
        {
            title: "Orders",
            url: "/admin/view-all-orders",
            icon: Box,
        },
        {
            title: "Items",
            url: "/admin/view-all-products",
            icon: Salad,
        },
        {
            title: "Reviews",
            url: "/admin/manage-reviews",
            icon: MessageCircleMore,
        },
        {
            title: "Vouchers",
            url: "/admin/manage-vouchers",
            icon: TicketPercent,
        },
        {
            title: "Customers",
            url: "/admin/view-customers",
            icon: UserRound,
        },

    ]

    return (

        <div className='flex' >

            <div className='w-12 space-y-4 pt-5 px-1 bg-white'>
                <img src="/favicon.png" className='size-6 mx-auto mb-10 ' alt="" />
                {items.map((item) => (
                    <Link to={item.url} key={item.title} className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md" onClick={onClose}>
                        <item.icon size={25} strokeWidth={1.5} />
                    </Link>
                ))}
            </div>
            <main className="flex-1 mx-auto p-5 min-h-screen bg-black/90  md:flex items-start overflow-x-hidden ">
                <button
                    className='p-2 rounded-md text-white hover:bg-orange-500'
                    onClick={(event) => {
                        event.stopPropagation()
                        onOpen()
                    }}>
                    <Menu />
                </button>
               
                <Outlet />

                {/* <Toaster /> */}

                {/* <div className='hidden md:block'>
                    <ToastProvider
                        placement="bottom-left"
                        toastProps={{
                            variant: "flat",
                        }} />
                </div> */}
                <div className='block md:hidden'>
                    <ToastProvider
                        placement="top-right"
                        toastProps={{
                            variant: "flat",
                        }} />
                </div>
            </main>

            <Drawer isOpen={isOpen} placement='left' onOpenChange={onClose} className='max-w-[200px]'  >
                <DrawerContent>
                    <DrawerHeader>
                        <p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
                            <span className='text-green-500'>go</span>treats
                        </p>
                    </DrawerHeader>
                    <DrawerBody>
                        {items.map((item) => (
                            <Link to={item.url} key={item.title} className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md" onClick={onClose}>
                                <item.icon size={20} strokeWidth={1.5} />
                                <span className="text-lg">{item.title}</span>
                            </Link>
                        ))}
                    </DrawerBody>
                    <DrawerFooter className="flex flex-col items-start">
                        <div className="p-2">
                            <h2 className="font-bold text-xl">{userDetails.displayName}</h2>
                            <p className="text-sm text-gray-500">{userDetails.email}</p>
                            <p className="text-sm text-gray-500">{userDetails.phoneNumber}</p>
                            <Button variant="danger" onClick={handleLogout}>Logout</Button>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

        </div>
    );
};

export default AdminLayout;