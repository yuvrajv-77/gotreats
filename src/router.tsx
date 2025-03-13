import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Contact from "./pages/Contact"
import Checkout from "./pages/Checkout"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./admin/AdminRoutes"
import AdminRoutes from "./admin/AdminRoutes"
import AdminLayout from "./pages/admin/AdminLayout"
import ManageProducts from "./pages/admin/ManageProducts"
import Dashboard from "./pages/admin/Dashboard"
import ProductFrom from "./pages/admin/ProductFrom"
import ManageOrders from "./pages/admin/ManageOrders"


export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/shop",
          element: <Shop />
        },
        {
          path: "/contact",
          element: <Contact />
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/checkout",
              element: <Checkout />
            },
            {
              path: "/profile",
              element: <Profile />
            },
            {
              path: "/orders",
              element: <Orders />
            }
          ]
        },
      ]
    },
    {
      path: "/admin",
      element:<AdminRoutes/>,
      children:[
        {
          
          element: <AdminLayout/>,
          children: [
            {
              index: true,
              element:<Dashboard/>
            },
            {
              path: "view-all-products",
              element:<ManageProducts/>,
            },
            {
              path: "product-form",
              element:<ProductFrom/>
            },
            {
              path: "product-form/:productId",
              element:<ProductFrom/>
            },
            {
              path: "view-all-orders",
              element:<ManageOrders/>
            }
          ]
        }
      ]
      
    }
  ])