import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useProductStore } from '../store/productStore'

import { useQuery } from '@tanstack/react-query'
import { getItemsFromFirestore } from '../services/productService'
import { Toaster } from 'react-hot-toast'
import Footer from './Footer'
import ScrollToTop from '../components/ScrollToTop'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'

function Layout() {
  const location = useLocation();

  const { userDetails } = useAuthStore();

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

  if (userDetails?.role === "admin") {
    return <Navigate to="/admin/view-all-orders" />
  }



  return (
    <div>
      <Navbar/>
      <AnimatePresence mode="wait">
        <motion.div
          // key={location.pathname}
          // initial={{ opacity: 0, y: 10 }}
          // animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: -10 }}
          // transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
          className=''
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <ScrollToTop />
      <Toaster />
      <Footer />
    </div>
  )
}

export default Layout