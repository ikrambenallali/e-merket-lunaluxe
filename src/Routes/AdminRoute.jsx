import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
    
    const user = useSelector((state) => state.auth.user);
    if (!user || user.role !== "admin") return <Navigate to="/" />;
    return children;
}