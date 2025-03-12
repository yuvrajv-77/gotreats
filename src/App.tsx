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

function App() {

 

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