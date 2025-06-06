import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { router } from "./router"
import { Toaster } from 'react-hot-toast'
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

  return (
    <>
      <QueryClientProvider client={queryClient}>
      

          {/* <InternetStatus /> */}
          {/* {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />} */}
          <RouterProvider router={router} />

        
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