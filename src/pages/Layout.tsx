import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import ProductList from '../content/Product_List'
import { useQuery } from '@tanstack/react-query'
import { getItemsFromFirestore } from '../services/productService'
import {Toaster} from 'react-hot-toast'

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
    </div>
  )
}

export default Layout