import { Link } from "react-router-dom";
import navbarImg from "../../assets/TR3Logo340px.svg";

export default function NavbarEmpty() {
    return (
        <nav className="bg-[#004aad] text-white shadow-lg fixed top-0 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img className="h-20 w-auto" src={navbarImg} alt="Logo" />
                            <span className="ml-2 text-xl font-bold"></span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}