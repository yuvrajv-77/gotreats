
import { Outlet, useNavigate } from 'react-router-dom'
import SidebarAdmin from '../../components/SidebarAdmin'
import { Toaster } from 'react-hot-toast'

const AdminLayout = () => {
   
    return (
        <div>
            <SidebarAdmin />
            <div className=' ml-48 mx-auto p-10'>

                <Outlet />
                <Toaster/>
            </div>
        </div>
    )
}

export default AdminLayout