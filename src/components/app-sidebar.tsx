import { Box, Calendar, Home, Inbox, MessageCircleMore, Salad, Search, Settings, TicketPercent } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import Button from "./Button"
import { handleLogout } from "@/services/authService"

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

]
const AppSidebar = () => {

    const { userDetails } = useAuthStore()

    return (
        <Sidebar collapsible="icon" className="">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="my-10">
                        <p className='comfortaa font-bold tracking-tighter text-2xl lg:text-3xl text-orange-600'>
                            <span className='text-green-500'>go</span>treats
                        </p>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} >
                                    <SidebarMenuButton size="lg" className="">
                                        <Link to={item.url} className="flex items-center hover:text-orange-300 gap-2 " >
                                            <item.icon size={25} strokeWidth={1.5} />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroupLabel className="my-10">
                    <div className="p-2">
                        <h2 className="font-bold text-xl">{userDetails.displayName}</h2>
                        <p className="text-sm text-gray-500">{userDetails.email}</p>
                        <p className="text-sm text-gray-500">{userDetails.phoneNumber}</p>
                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    </div>
                    
                </SidebarGroupLabel>

            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar