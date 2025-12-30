import NavBar from './NavBar';
import Footer from './Footer';
import ClientNavBar from './ClientNavBar';
import { useCart } from '../Hooks/useCart';
import { useEffect } from 'react';

function isAuthenticated() {
    return localStorage.getItem('token') && localStorage.getItem('user');
}

export default function Layout({ children }) {
    const authenticated = isAuthenticated();
    
    // Charger le panier pour les utilisateurs connectés
    const user = authenticated ? JSON.parse(localStorage.getItem('user')) : null;
    const userId = user?.id || user?._id;
    
    // Appeler useCart pour charger le panier
    useCart(userId);

    return (
        <div className="min-h-screen flex flex-col">
            {authenticated ? <ClientNavBar /> : <NavBar />}
            <main className="flex-1 mt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
}