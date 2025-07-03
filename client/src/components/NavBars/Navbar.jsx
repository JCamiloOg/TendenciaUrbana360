// Modules
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons"
// hookjs
import { useMobileMenu, useUserMenu } from "../../hooks/useMobileMenu";
import { useClickOutSide } from "../../hooks/useClickOutSide";
import { Toast } from "../../hooks/useToastAlert"
// services
import { logOut } from "../../services/users/usersServices";
// imgs
import navbarImg from "../../assets/TR3Logo340px.svg";

export default function NavBar({ isLogin, openLogin, openRegister, active }) {
    const [home, setHome] = useState(false);
    const [products, setProducts] = useState(false);
    const [profile, setProfile] = useState(false);

    const { isOpen, toggle, close } = useMobileMenu();
    const { isOpenUser, toggleUser, closeUser } = useUserMenu();

    const menuRefNav = useRef(null);
    const buttonRefNav = useRef(null);
    const menuRefUser = useRef(null);
    const buttonRefUser = useRef(null);

    useState(() => {
        switch (active) {
            case "Home":
                setHome(true);
                break;
            case "Products":
                setProducts(true);
                break;
            case "Profile":
                setProfile(true);
        }
    })

    const exit = async () => {
        try {
            const response = await logOut()
            if (response.status === 200) {
                window.location.reload()
            }

        } catch (error) {
            console.log(error);
            Toast.fire({
                icon: 'error',
                title: 'Error al cerrar sesión',
                timer: 3000
            })

        }
    }
    useClickOutSide([menuRefNav, buttonRefNav], close);
    useClickOutSide([menuRefUser, buttonRefUser], closeUser);
    return (
        <>
            <nav className="bg-[#004aad] text-white shadow-lg z-49 fixed top-0 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <img className="h-20 w-auto" src={navbarImg} alt="Logo" />
                                <span className="ml-2 text-xl font-bold"></span>
                            </Link>
                            <div className="hidden md:ml-6 md:flex md:space-x-8">
                                <Link to="/" className={`border-b-2 ${home ? "border-yellow-500 text-white" : "text-gray-300 hover:border-yellow-500 hover:text-white border-transparent"} px-1 pt-1 inline-flex items-center text-sm font-bold transition-all duration-300`}>
                                    Inicio
                                </Link>
                                <Link to="/products" className={`${products ? "border-yellow-500 text-white" : "text-gray-300 hover:border-yellow-500 hover:text-white"}  border-b-2 border-transparent  px-1 pt-1 inline-flex items-center text-sm font-bold transition-all duration-300`}>
                                    Productos
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="hidden md:flex md:ml-4">
                                <div className="relative">
                                    <input type="search" className="bg-white text-black rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-64 transition-all duration-200" placeholder="Buscar Producto..." />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex flex-wrap gap-3 items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {
                                isLogin ?
                                    <div className="ml-3 relative hidden md:block">
                                        <div>
                                            <button ref={buttonRefUser} type="button" className="bg-gray-800 p-3 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500" id="user-menu-button" onClick={toggleUser} aria-expanded={isOpenUser ? "true" : "false"} aria-haspopup="true">
                                                <span className="sr-only">Open user menu</span>
                                                <FontAwesomeIcon icon={faUser} size="xl" />
                                            </button>
                                        </div>

                                        <div ref={menuRefUser} className={`origin-top-right absolute  right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-blue-900 ring-1 ring-yellow-500 ring-opacity-5 focus:outline-none ${isOpenUser ? "max-h-[500px] opacity-100 " : "max-h-0 opacity-0 pointer-events-none"} transition-all duration-500 ease-in-out`} id="user-menu" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                            <Link to="/clients/profile" className="block px-4 py-2 text-sm text-white hover:bg-yellow-500 hover:text-black transition-all duration-300" role="menuitem" tabIndex="-1">Tu perfil</Link>
                                            <a onClick={exit} className="block px-4 cursor-pointer py-2 text-sm text-white hover:bg-yellow-500 hover:text-black transition-all duration-300" role="menuitem" tabIndex="-1">Cerrar sesión</a>
                                        </div>
                                    </div>
                                    :
                                    <div className="ml-3 relative  hidden md:block ">
                                        <button onClick={openLogin} className="text-gray-300 cursor-pointer mr-5 hover:text-white border-b-2 border-transparent hover:border-yellow-500 px-1 pt-1 inline-flex items-center text-sm font-medium transition-all duration-300m">
                                            Ingresar
                                        </button>
                                        <button onClick={openRegister} className="text-gray-300 cursor-pointer hover:text-white border-b-2 border-transparent hover:border-yellow-500 px-1 pt-1 inline-flex items-center text-sm font-medium transition-all duration-300m">
                                            Registrarse
                                        </button>
                                    </div>
                            }
                            <div className="flex items-center md:hidden ml-4">
                                <button ref={buttonRefNav} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500 ignore-click-outside" aria-expanded={isOpen ? "true" : "false"} onClick={toggle} id="mobile-menu-button">
                                    <FontAwesomeIcon icon={faBars} size="lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* mobile */}

                <div ref={menuRefNav} className={`transition-all duration-500 ease-in-out md:hidden ${isOpen ? "max-h-[500px] opacity-100 pointer-events-auto" : " max-h-0 opacity-0 pointer-events-none"}`} id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/" className={`${home ? "bg-yellow-500 text-black" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`} >Inicio</Link>
                        <Link to="/products" className={`${products ? "bg-yellow-500 text-black" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`}>Productos</Link>
                    </div>

                    <div className="px-2 pt-2 pb-3">
                        <div className="relative">
                            <input type="text" className="bg-white text-black w-full rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Buscar producto..." />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {
                        isLogin ?
                            <div className="pt-4 pb-3 border-t border-gray-700">
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <FontAwesomeIcon icon={faUser} size="xl" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-white">{isLogin.Nombre + " " + isLogin.Apellido}</div>
                                        <div className="text-sm font-medium text-gray-400">{isLogin.Correo}</div>
                                    </div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    <Link to={"/clients/profile"} className={`block px-3 py-2 rounded-md text-base font-medium ${profile ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white hover:bg-gray-700"}  `}>Tu perfil</Link>
                                    <a onClick={exit} role="button" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Cerrar sesión</a>
                                </div>
                            </div>
                            :
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <button onClick={openLogin} className="text-gray-300 w-full text-left active:bg-yellow-500 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Ingresar</button>
                                <button onClick={openRegister} className="text-gray-300 w-full text-left active:bg-yellow-500 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Registrarse</button>
                            </div>
                    }
                </div>
            </nav>
        </>
    )
}