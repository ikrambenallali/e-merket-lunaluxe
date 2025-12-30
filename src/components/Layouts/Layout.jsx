import NavBar from './NavBar';
import Footer from './Footer';
import ClientNavBar from './ClientNavBar';

function isAuthenticated() {
    return localStorage.getItem('token') && localStorage.getItem('user');
}

export default function Layout({ children }) {
    const authenticated = isAuthenticated();

    return (
        <div className="min-h-screen flex flex-col">
            {authenticated ? <ClientNavBar /> : <NavBar />}
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}