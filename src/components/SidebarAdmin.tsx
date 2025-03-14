
import { Link } from 'react-router-dom';

const SidebarAdmin = () => {



   



    return (
        <aside className="fixed top-0 left-0 h-screen w-48 bg-white shadow-lg">
            <div className="p-6">
                <Link to={'/'}><p className='comfortaa font-bold tracking-tighter text-2xl mt-3 text-center lg:text-3xl text-orange-600'><span className='text-green-500'>go</span>treats</p></Link>

                <nav className=' mt-20'>
                    <ul className="space-y-10 ">
                        <li className="hover:text-green-600 p-3 rounded ">
                            <Link to="/admin" className="flex items-center">
                                Dashboard
                            </Link>
                        </li>
                        <li className="hover:text-green-600 p-3 rounded ">
                            <Link to="/admin/view-all-products" className="flex items-center">
                                Products
                            </Link>
                        </li>
                        <li className="hover:text-green-600 p-3 rounded ">
                            <Link to="/admin/view-all-orders" className="flex items-center">
                                Orders
                            </Link>
                        </li>
                        <li className="hover:text-green-600 p-3 rounded ">
                            <Link to="/admin" className="flex items-center">
                                Users
                            </Link>
                        </li>
                      

                    </ul>
                </nav>
            </div>
        </aside>
    )
}

export default SidebarAdmin