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
        element: <ProtectedRoute><Checkout/></ProtectedRoute>
      },
      {
        path:"/profile",
        element: <ProtectedRoute><Profile/></ProtectedRoute>
      },
      {
        path:"/orders",
        element: <ProtectedRoute><Orders/></ProtectedRoute>
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