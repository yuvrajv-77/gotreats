import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, useSidebar } from '../../components/ui/sidebar'; // Adjust the import path if necessary
import { Toaster } from 'react-hot-toast';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from '@/components/app-sidebar';
import { Menu } from 'lucide-react';
import { HeroUIProvider } from '@heroui/system';

const CustomTrigger = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <button
            className='p-2 rounded-md text-white hover:bg-orange-500'
            onClick={(event) => {
                event.stopPropagation()
                toggleSidebar()
            }}>
            <Menu />
        </button>
    )
}
const AdminLayout = () => {

    return (
        <div className='' >

            <SidebarProvider >
                <AppSidebar />
                <main className="flex-1 mx-auto p-5 min-h-screen bg-zinc-800  md:flex items-start overflow-x-hidden">
                    <CustomTrigger />
                    
                        <Outlet />
                    
                    <Toaster />
                </main>
            </SidebarProvider>


        </div>
    );
};

export default AdminLayout;