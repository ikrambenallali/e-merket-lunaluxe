import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Home/Header';
import HomeProducts from '../../components/Home/HomeProducts';
import Discover from '../../components/Home/Discover';
import History from '../../components/Home/History';
import Routine from '../../components/Home/Routine';

export default function IndexPage()
{
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                
                // Redirect based on user role
                if (user?.role === "admin") {
                    navigate('/admin', { replace: true });
                } else if (user?.role === "seller") {
                    navigate('/seller', { replace: true });
                } else if (user?.role === "user") {
                    navigate('/client', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } catch (error) {
                navigate('/', { replace: true });
            }
        }
    }, [navigate]);

    return (
        <>
   
            <Header />
            <HomeProducts />
            <Discover />
            <History />
            <Routine />

        </>
    )
}