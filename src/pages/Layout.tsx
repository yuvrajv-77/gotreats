import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { useProductStore } from '../store/productStore'

import { useQuery } from '@tanstack/react-query'
import { getItemsFromFirestore } from '../services/productService'
import {Toaster} from 'react-hot-toast'
import Footer from './Footer'

function Layout() {

  const {data} = useQuery({
    queryKey: ['items'],
    queryFn: getItemsFromFirestore
})

useEffect(() => {
    if (data) {
        const filteredItems = data.filter((item) => item.isAvailable);
        useProductStore.getState().setProducts(filteredItems)
    }
}, [data])
  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Toaster/>
        <Footer/>
    </div>
  )
}

export default Layout