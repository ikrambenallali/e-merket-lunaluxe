import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Products from "../../components/Client/Products";
import MyOrders from "../../pages/Client/MyOrders";
import { useCart } from "../../Hooks/useCart";

export default function ClientDashboard() {
    // Charger le panier au montage du composant
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?._id;
    useCart(userId);

    return (
        <div>
            <Products />
            <Outlet />
        </div>
    );
}