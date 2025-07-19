// Modules
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBoxesStacked, faCartShopping, faClock, faClockRotateLeft, faGlasses, faHatCowboy, faJoint, faShoePrints, faSprayCanSparkles, faTShirt, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"

// components 
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"

// hookjs
import { useMobileMenu, useUserMenu } from "../../hooks/useMobileMenu";
import { useClickOutSide } from "../../hooks/useClickOutSide";
import { Toast } from "../../hooks/useToastAlert"
// services
import { logOut } from "../../services/users/usersServices";
// imgs
import navbarImg from "../../assets/TR3Logo340px.svg";
import Cart from "../Cart/Cart";
import { useForm } from "react-hook-form";

export default function NavBar({ isLogin, openLogin, openRegister, active, productsLenght }) {
    const [home, setHome] = useState(false);
    const [products, setProducts] = useState(false);
    const [profile, setProfile] = useState(false);
    const [search, setSearch] = useState(false);

    const navigate = useNavigate();
    const { handleSubmit, register, setValue, watch } = useForm();
    const { isOpen, toggle, close } = useMobileMenu();
    const { isOpenUser, toggleUser, closeUser } = useUserMenu();
    const [isOpenCart, setIsOpenCart] = useState(false);
    const [searchHistory, setSearchHistory] = useState(localStorage.getItem("lastSearches") ? JSON.parse(localStorage.getItem("lastSearches")) : []);
    const [isOpenHistory, setIsOpenHistory] = useState(false);

    const menuRefNav = useRef(null);
    const buttonRefNav = useRef(null);
    const menuRefUser = useRef(null);
    const buttonRefUser = useRef(null);
    const inputSearchRef = useRef(null);
    const searchHistoryRef = useRef(null);
    const searchHistoryRefMobile = useRef(null);
    const inputSearchRefMobile = useRef(null);


    const openHistory = () => {
        setIsOpenHistory(true);
    }
    const closeHistory = () => {
        setIsOpenHistory(false);
    }

    const handleXmark = (idx) => {
        const newHistory = [...searchHistory]
        newHistory.splice(idx, 1);
        localStorage.setItem("lastSearches", JSON.stringify(newHistory));
        setSearchHistory(newHistory);
    }

    const onSearch = (query) => {
        const history = searchHistory
        if (!history.includes(query) && query.length > 3) {
            const newHistory = [query, ...history];
            localStorage.setItem("lastSearches", JSON.stringify(newHistory));
            setSearchHistory(newHistory);
        }
        navigate({ pathname: "/products/search", search: `?query=${query}` });
    }



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
                break;
            case "Search":
                setSearch(true);
                break;
            default:
                setHome(false);
                setProducts(false);
                break;
        }
    }, [])

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

    const handleCart = () => {
        setIsOpenCart(!isOpenCart);
    }
    useClickOutSide([inputSearchRef, searchHistoryRef], closeHistory)
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
                                {
                                    home || products ?
                                        <NavigationMenu>
                                            <NavigationMenuList >
                                                <NavigationMenuItem >
                                                    <NavigationMenuTrigger className={`!bg-transparent  data-[state=open]:!text-white  rounded-none hover:!bg-transparent hover:!text-white border-b-2 ${products ? "border-yellow-500 text-white" : "text-gray-300 hover:border-yellow-500 hover:text-white border-transparent"} px-1 pt-1 inline-flex items-center text-sm font-bold transition-all duration-300`}>Productos</NavigationMenuTrigger>
                                                    <NavigationMenuContent className={`bg-[#004aad] !border-none`}>
                                                        <ul className="grid w-[200px] gap-4">
                                                            <li>
                                                                <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                    <Link to="/products" className="flex-row items-center gap-2">
                                                                        <FontAwesomeIcon className="text-white" icon={faBoxesStacked} />
                                                                        Todos los productos
                                                                    </Link>
                                                                </NavigationMenuLink>

                                                                {
                                                                    productsLenght.calzado != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/calzado" className="flex-row items-center gap-2">
                                                                                <FontAwesomeIcon className="text-white" icon={faShoePrints} />
                                                                                Calzado
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    productsLenght.camisas != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/camisas" className="flex-row items-center gap-2">
                                                                                <FontAwesomeIcon className="text-white" icon={faTShirt} />
                                                                                Camisas
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    productsLenght.pantalones != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/pantalones" className="flex-row items-center gap-2">
                                                                                Pantalones
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    productsLenght.gorras != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/gorras" className="flex-row items-center gap-2">
                                                                                <FontAwesomeIcon className="text-white" icon={faHatCowboy} />
                                                                                Gorras
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    productsLenght.relojes != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/relojes" className="flex-row items-center gap-2">
                                                                                <FontAwesomeIcon className="text-white" icon={faClock} />
                                                                                Relojes
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    productsLenght.gafas != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/gafas" className="flex-row items-center gap-2">
                                                                                <FontAwesomeIcon className="text-white" icon={faGlasses} />
                                                                                Gafas
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    productsLenght.perfumes != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/perfumes" className="flex-row items-center gap-2">
                                                                                <FontAwesomeIcon className="text-white" icon={faSprayCanSparkles} />
                                                                                Perfumes
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    productsLenght.vapers != 0 ?
                                                                        <NavigationMenuLink className={`hover:bg-[#002960] hover:text-white text-white font-bold`} asChild>
                                                                            <Link to="/products/vapeadores" className="flex-row items-center gap-2">
                                                                                <FontAwesomeIcon className="text-white" icon={faJoint} />
                                                                                Vapers
                                                                            </Link>
                                                                        </NavigationMenuLink>
                                                                        :
                                                                        <></>
                                                                }
                                                            </li>
                                                        </ul>
                                                    </NavigationMenuContent>
                                                </NavigationMenuItem>
                                            </NavigationMenuList>
                                        </NavigationMenu>
                                        :
                                        <Link to="/products" className={`border-b-2 ${products ? "border-yellow-500 text-white" : "text-gray-300 hover:border-yellow-500 hover:text-white border-transparent"} px-1 pt-1 inline-flex items-center text-sm font-bold transition-all duration-300`}>
                                            Productos
                                        </Link>

                                }
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="hidden md:flex  md:ml-4">
                                {
                                    !search ?
                                        <form onSubmit={handleSubmit(() => {
                                            onSearch(watch("query"))
                                            setValue("query", "")
                                        })} className="relative">
                                            <input ref={inputSearchRef}
                                                type="search"
                                                className="bg-white text-black rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-64 transition-all duration-200"
                                                placeholder="Buscar Producto..."
                                                onClick={openHistory}
                                                {...register("query", {
                                                    required: true
                                                })}
                                                autoComplete="off"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex flex-wrap gap-3 items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            {
                                                searchHistory.length > 0 ?
                                                    <div className={`absolute ${isOpenHistory ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}  mt-1 bg-white border shadow-lg rounded-md w-64 z-30}`} ref={searchHistoryRef}>
                                                        <ul className="p-2 text-sm">
                                                            {
                                                                searchHistory.slice(0, 5).map((search, idx) => (
                                                                    <li className="cursor-pointer flex justify-between text-black hover:hover:bg-[#004aad]/50 px-2 py-1 rounded transition-all duration-300" key={idx}>
                                                                        <div className="w-full" onClick={() => navigate({ pathname: "/products/search", search: `?query=${search}` })}>
                                                                            <FontAwesomeIcon icon={faClockRotateLeft} />  &nbsp; {search}
                                                                        </div>
                                                                        <FontAwesomeIcon onClick={() => handleXmark(idx)} icon={faXmark} />
                                                                    </li>

                                                                ))
                                                            }
                                                        </ul>
                                                    </div>

                                                    :
                                                    <></>
                                            }

                                        </form>
                                        :
                                        <></>
                                }
                            </div>
                            {
                                isLogin ?
                                    <div className="ml-3 relative hidden md:block">
                                        <div className="flex gap-3">
                                            <button ref={buttonRefUser} type="button" className="bg-gray-800 p-3 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500" id="user-menu-button" onClick={toggleUser} aria-expanded={isOpenUser ? "true" : "false"} aria-haspopup="true">
                                                <span className="sr-only">Open user menu</span>
                                                <FontAwesomeIcon icon={faUser} size="xl" />
                                            </button>
                                            <button className="cursor-pointer text-gray-300 hover:border-yellow-500 hover:text-white border-transparent transition-all duration-300 border-b-2" onClick={handleCart}><FontAwesomeIcon icon={faCartShopping} /></button>
                                        </div>

                                        <div ref={menuRefUser} className={`origin-top-right absolute  right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-blue-900 ring-1 ring-yellow-500 ring-opacity-5 focus:outline-none ${isOpenUser ? "max-h-[500px] opacity-100 " : "max-h-0 opacity-0 pointer-events-none"} transition-all duration-500 ease-in-out`} id="user-menu" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                            <Link to="/clients/profile" className="block px-4 py-2 text-sm text-white hover:bg-yellow-500 hover:text-black transition-all duration-300" role="menuitem" tabIndex="-1">Tu perfil</Link>
                                            <a onClick={exit} className="block px-4 cursor-pointer py-2 text-sm text-white hover:bg-yellow-500 hover:text-black transition-all duration-300" role="menuitem" tabIndex="-1">Cerrar sesión</a>
                                        </div>
                                    </div>
                                    :
                                    <div className="ml-3 relative  hidden md:block ">
                                        <button onClick={openLogin} className="text-gray-300 cursor-pointer mr-5 hover:text-white border-b-2 border-transparent hover:border-yellow-500 px-1 pt-1 inline-flex items-center text-sm font-bold transition-all duration-300m">
                                            Ingresar
                                        </button>
                                        <button onClick={openRegister} className="text-gray-300 cursor-pointer hover:text-white border-b-2 border-transparent hover:border-yellow-500 px-1 pt-1 inline-flex items-center text-sm font-bold transition-all duration-300m">
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
                    {
                        !search ?
                            <>
                                <div className="px-2 pt-2 pb-3">
                                    <form onSubmit={handleSubmit(() => {
                                        onSearch(watch("query"))
                                        setValue("query", "")
                                    })} className="relative">
                                        <input ref={inputSearchRefMobile}
                                            type="search"
                                            className="bg-white text-black rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full transition-all duration-200"
                                            placeholder="Buscar Producto..."
                                            onClick={openHistory}
                                            {...register("query", {
                                                required: true
                                            })}
                                            autoComplete="off"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex flex-wrap gap-3 items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {
                                            searchHistory.length > 0 ?
                                                <div className={`absolute ${isOpenHistory ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}  mt-1 bg-white border shadow-lg rounded-md w-full z-30}`} ref={searchHistoryRefMobile}>
                                                    <ul className="p-2 text-sm">
                                                        {
                                                            searchHistory.slice(0, 5).map((search, idx) => (
                                                                <li className="cursor-pointer flex justify-between text-black hover:hover:bg-[#004aad]/50 px-2 py-1 rounded transition-all duration-300" key={idx}>
                                                                    <div className="w-full" onClick={() => navigate({ pathname: "/products/search", search: `?query=${search}` })}>
                                                                        <FontAwesomeIcon icon={faClockRotateLeft} />  &nbsp; {search}
                                                                    </div>
                                                                    <FontAwesomeIcon onClick={() => handleXmark(idx)} icon={faXmark} />
                                                                </li>

                                                            ))
                                                        }
                                                    </ul>
                                                </div>

                                                :
                                                <></>
                                        }
                                    </form>
                                </div>
                            </>
                            :
                            <></>
                    }
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
                                    <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700" onClick={handleCart}>Carrito</button>
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
            <Cart isOpen={isOpenCart} updateVal={setIsOpenCart} />
        </>
    )
}

