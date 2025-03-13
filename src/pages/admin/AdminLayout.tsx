import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import SidebarAdmin from '../../components/SidebarAdmin'

const AdminLayout = () => {
   
    return (
        <div>
            <SidebarAdmin />
            <div className=' ml-48 mx-auto p-10'>

                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout