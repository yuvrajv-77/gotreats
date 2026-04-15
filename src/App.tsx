import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { router } from "./router"
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import { Spinner } from "@heroui/react"
import { BrandLogo } from "./components/Navbar"
import { getSubdomain } from "./utils/getSubdomain"
import { admin_router } from "./router/adminRouter"
import { client_router } from "./router/clientRouter"

/**
 * The root component of the app.
 *
 * It sets up a QueryClientProvider with a QueryClient instance
 * that has a retry policy and a stale time.
 *
 * It also renders a Suspense component that shows a loading
 * animation while the app is loading.
 *
 * It also renders a RouterProvider component that wraps the app
 * with a router.
 *
 * Finally, it renders a Toaster component that shows toasts
 * at the top of the screen.
 *
 * @returns The app component
 */
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

   const subdomain = getSubdomain();
  const isAdminDomain = subdomain === "admin";
  console.log("isAdminDomain", isAdminDomain);
  
//   The Suspense component in React is used to handle the loading state for components that are loaded asynchronously 
// (e.g., via React.lazy or data fetching libraries that support Suspense).
// In your App.tsx, Suspense wraps the RouterProvider, so if any route or component inside the router is being lazy-loaded, 
// React will show the fallback UI (the loading spinner and message) until those components are ready. 
// This improves user experience by displaying a loading indicator while waiting for code or data to load.

  return (
    <>
      <QueryClientProvider client={queryClient}>

        <Suspense fallback={
          <div className="flex flex-col gap-3 items-center justify-center h-screen">
            
            <div className="cursor-pointer">
               <p className='font-bowlby uppercase font-extrabold tracking-wider text-2xl lg:text-3xl text-orange-600'>
                Bitebox
            </p>
            </div>
            <Spinner color="danger" size="lg" />
            {/* <p className="text-green-700">Please wait while we prepare your delicious experience!</p> */}
          </div>
        }>

          <RouterProvider router={isAdminDomain ? admin_router : client_router} />

        </Suspense>


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