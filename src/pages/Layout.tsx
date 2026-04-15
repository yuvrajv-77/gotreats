import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useQuery } from '@tanstack/react-query'
import { getItemsFromFirestore } from '../services/productService'
import toast, { Toaster } from 'react-hot-toast'
import Footer from './Footer'
import ScrollToTop from '../components/ScrollToTop'
import { useAuthStore } from '@/store/authStore'
import OrderPlacedModal from './OrderPlacedModal'

function Layout() {


  const { data } = useQuery({
    queryKey: ['items'],
    queryFn: getItemsFromFirestore,

  })

 
  useEffect(() => {
    if (data) {
      const filteredItems = data.filter((item) => item.isAvailable);
      useProductStore.getState().setProducts(filteredItems)
    }
  }, [data])


  return (
    <div>
      <Navbar />

      <Outlet />

      <ScrollToTop />
      <Toaster />
      <Footer />
      <OrderPlacedModal />
    </div>
  )
}

export default Layout