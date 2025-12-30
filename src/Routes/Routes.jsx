import { Routes, Route } from "react-router-dom";
import IndexPage from "../pages/Index/IndexPage";
import ProductDetails from "../pages/Products/ProductDetails";
import NotFound from "../pages/Error/NotFound";
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ClientDashboard from "../pages/Client/ClientDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import SellerPage from "../pages/Seller/SellerPage";
import Layout from "../components/Layout";
import ProfilePage from "../pages/Client/ProfilePage";
import AdminOverview from "../pages/Admin/AdminOverview";
import AdminReports from "../pages/Admin/AdminReports";
import AdminProducts from "../pages/Admin/AdminProducts";
import AdminProductDetails from "../pages/Admin/AdminProductDetails";
import AdminCategories from "../pages/Admin/AdminCategories";
import AdminUsers from "../components/Admin/UserManagement";
import FeedbackPage from "../pages/Admin/FeedbackPage";
import AdminCoupons from "../pages/Admin/AdminCoupons";
import Order from "../components/Client/Order";
import Orders from "../components/Admin/Orders";
import OrdersPage from "../pages/Admin/OrdersPage";
import MyOrders from "../pages/Client/MyOrders";
import CreateOrder from "../components/Client/createOrder";
import DeletedOrdersPage from "../pages/Admin/DeletedOrdersPage";
import Cart from "../components/Client/Cart";
import OrderDetails from "../components/Client/OrderDetails";
import LogsPage from "../pages/LogsPage";
// import OrdersTest from "../components/Admin/OrdersTest";

export default function RoutesList() {

    return (
        <Routes>

            <Route path="/" element={<Layout><IndexPage /></Layout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />

            <Route path="/client">
                <Route index element={<ProtectedRoute requiredRole="user"><Layout><ClientDashboard /></Layout></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute requiredRole="user"><Layout><ProfilePage /></Layout></ProtectedRoute>} />
                <Route path="myOrders" element={<ProtectedRoute requiredRole="user"><Layout><MyOrders /></Layout></ProtectedRoute>}/>
                <Route path="createOrder" element={<ProtectedRoute requiredRole={"user"}><Layout><CreateOrder /></Layout></ProtectedRoute>}/>
                <Route path="orders/:id" element={<ProtectedRoute requiredRole={"user"}><Layout><OrderDetails /></Layout></ProtectedRoute>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/:id" element={<AdminProductDetails />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/deleted" element={<DeletedOrdersPage />} />
                <Route path="logs" element={<LogsPage />} />

                {/* <Route path="ordersTest" element={<OrdersTest />} /> */}
            </Route>

            {/* Seller Routes */}
            <Route path="/seller/:sellerId?" element={<ProtectedRoute requiredRole="seller"><SellerPage /></ProtectedRoute>} />
            
            {/* Error Routes */}
            <Route path={'*'} element={<NotFound />} />
        </Routes>
    )
}