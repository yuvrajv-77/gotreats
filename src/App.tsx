import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Contact from "./pages/Contact"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Checkout from "./pages/Checkout"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import ProtectedRoute from "./components/ProtectedRoute"
import { router } from "./router"
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import Loader from './components/Loader'
import InternetStatus from './components/InternetStatus'
import { HeroUIProvider } from "@heroui/system"
import { ToastProvider } from "@heroui/react"
import { Analytics } from "@vercel/analytics/react"

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
      },
    },
  })
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state on page refresh
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     localStorage.setItem('shouldShowLoader', 'true');
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   const shouldShowLoader = localStorage.getItem('shouldShowLoader') === 'true';
  //   setIsLoading(shouldShowLoader);

  //   if (!shouldShowLoader) {
  //     localStorage.setItem('shouldShowLoader', 'true');
  //   }

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    localStorage.setItem('shouldShowLoader', 'false');
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>

          {/* <InternetStatus /> */}
          {/* {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />} */}
          <RouterProvider router={router} />

        </HeroUIProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
      <Analytics />
    </>
  )
}

export default App