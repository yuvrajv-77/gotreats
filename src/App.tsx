import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Contact from "./pages/Contact"
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query"

function App() {
 
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/shop",
        element:<Shop/>
      },
      {
        path:"/contact",
        element:<Contact/>
      }
    ]
  }
])

const queryClient = new QueryClient()
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
    </>
  )
}

export default App
