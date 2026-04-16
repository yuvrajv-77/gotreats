import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useQuery } from '@tanstack/react-query'
import { getItemsFromFirestore } from '../services/productService'
import toast, { Toaster } from 'react-hot-toast'
import Footer from './Footer'
import ScrollToTop from '../components/ScrollToTop'
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
        <div className="min-h-screen bg-[var(--brand-dark)] text-[var(--brand-cream)] flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <ScrollToTop />
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1C1917',
                        color: '#FDF6ED',
                        border: '1px solid #2C2825',
                        borderRadius: '12px',
                        fontFamily: '"Space Mono", monospace',
                        fontSize: '13px',
                    },
                    success: {
                        iconTheme: { primary: '#E8580A', secondary: '#FDF6ED' },
                    },
                }}
            />
            <OrderPlacedModal />
        </div>
    )
}

export default Layout