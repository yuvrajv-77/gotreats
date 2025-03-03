import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Contact from "./pages/Contact"
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Checkout from "./pages/Checkout"
import Register from "./pages/Register"
import Login from "./pages/Login"

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
        path:"/login",
        element:<Login/>
      },
      {
        path:"/register",
        element:<Register/>
      },
      {
        path:"/shop",
        element:<Shop/>
      },
      {
        path:"/contact",
        element:<Contact/>
      },
      {
        path:"/checkout",
        element:<Checkout/>
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
