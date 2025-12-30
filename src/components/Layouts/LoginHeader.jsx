import { Link } from "react-router-dom";

export default function LoginHeader() {
    return (
        <header className="w-full pl-10 py-2 z-20 shrink-0">
            <Link to={'/'}>
                <h3 className="font-bold text-2xl tracking-widest uppercase font-playfair text-brandRed py-4">LunaLuxe</h3>
            </Link>
        </header>
    );
}