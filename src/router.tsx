import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

// Static imports for layout and protected route
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoutes from "./admin/AdminRoutes";
// import Home from "./pages/Home";

// Dynamic imports for pages
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Contact = lazy(() => import("./pages/Contact"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const ManageProducts = lazy(() => import("./pages/admin/ManageProducts"));
const ManageOrders = lazy(() => import("./pages/admin/ManageOrders"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const Concept = lazy(() => import("./pages/ConceptPage"));
const About = lazy(() => import("./pages/About"));
const ManageReview = lazy(() => import("./pages/admin/ManageReview"));
const Customers = lazy(() => import("./pages/Customers"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ManageVouchers = lazy(() => import("./pages/admin/ManageVouchers"));
const ViewCustomers = lazy(() => import("./pages/admin/ViewCustomers"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const Collections = lazy(() => import("./pages/admin/Collections"));


export const router = createBrowserRouter([
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
  },
  
  {
    path: "/admin",
    element: <AdminRoutes />,
    children: [
      {

        element: <AdminLayout />,
        children: [

          {
            path: "view-all-products",
            element: <ManageProducts />,
          },
          // {
          //   path: "product-form",
          //   element: <ProductFrom />
          // },
          // {
          //   path: "product-form/:productId",
          //   element: <ProductFrom />
          // },
          {
            path: "view-all-orders",
            element: <ManageOrders />
          },
          {
            path: "manage-reviews",
            element: <ManageReview />
          },
          {
            path: "manage-vouchers",
            element: <ManageVouchers />
          },
          {
            path: "customers",
            element: <ViewCustomers />
          },
          {
            path: "payments",
            element: <Payments />
          },
          {
            path: "collections",
            element: <Collections />
          },
        ]
      }
    ]

  }
])