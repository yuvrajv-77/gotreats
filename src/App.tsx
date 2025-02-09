import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Contact from "./pages/Contact"

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
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
