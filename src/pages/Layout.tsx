import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import ProductList from '../content/Product_List'

function Layout() {

  useEffect(() => {
     
    useProductStore.getState().setProducts(ProductList)

}, [])
  return (
    <div>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default Layout