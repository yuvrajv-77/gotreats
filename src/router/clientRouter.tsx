import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

import Layout from "../pages/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Shop = lazy(() => import("../pages/Shop"));
const Contact = lazy(() => import("../pages/Contact"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const Orders = lazy(() => import("../pages/Orders"));
const TermsConditions = lazy(() => import("../pages/TermsConditions"));
const Concept = lazy(() => import("../pages/ConceptPage"));
const About = lazy(() => import("../pages/About"));
const Customers = lazy(() => import("../pages/Customers"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("../pages/RefundPolicy"));



export const client_router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/concept",
        element: <Concept />
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
      },
      {
        path: "/refund-policy",
        element: <RefundPolicy />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/customers",
        element: <Customers />
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
        path: "/terms-and-conditions",
        element: <TermsConditions />
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
            element: <Orders />,
            children: [
              {
                path: ":orderId",
                element: <Orders />
              }
            ]
          }
        ]
      },
    ]
  }
  
  
])