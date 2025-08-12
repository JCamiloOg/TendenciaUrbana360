import Loader from "@/components/Loader";
import ModalLogin from "@/components/Modals/ModalLogin";
import ModalRegister from "@/components/Modals/ModalRegister";
import NavBar from "@/components/NavBars/Navbar";
import { usePageLoader } from "@/hooks/useLoader";
import { useModalLogin, useModalRegister } from "@/hooks/useModal";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Error from "./Error";
import NoInfoComplete from "./NoInfoComplete";
import { searchProducts } from "@/services/productsService";
import { SvgSearchNotFound } from "@/components/Svg/Svg";
import ProductCard from "@/components/ProductCard";
import InputSearch from "@/components/Inputs/InputSearch";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import Footer from "@/components/Footer";

export default function SearchProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { category } = useParams();
    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const navigate = useNavigate();
    const [isLogin, setIslogin] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(false);
    const [products, setProducts] = useState([]);
    const [skeleton, setSkeleton] = useState(true);
    const [lastSearches, setLastSearches] = useState(localStorage.getItem("lastSearches") ? JSON.parse(localStorage.getItem("lastSearches")) : [])

    const fetchProducts = async (query, category) => {
        setSkeleton(true);
        document.title = "Buscando..."
        try {
            const res = await searchProducts(query, category);
            if (res.status === 200) {
                if (res.data.products.length !== 0) setProducts(res.data.products);
                else setProducts([]);
                setIslogin(res.data.user);
            }
        } catch (error) {
            if (error.status === 400) {
                if (typeof error.response.data.redirect === "undefined" || error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");

                return setInfo(true);
            }
            setError({ status: error?.status || 500, message: error.response?.data?.message || "Error inesperado" })
        } finally {
            setTimeout(() => setSkeleton(false), 500)
            document.title = "Búsqueda - Tendencia Urbana 360"
        }
    }

    useEffect(() => {
        startLoading();
        const query = searchParams.get("query") || '';
        if (query && query.length > 3) {
            fetchProducts(query, category);
        }
        setTimeout(() => stopLoading(), 500)
    }, []);

    const handleSearch = (query) => {
        const history = lastSearches
        if (!history.includes(query) && query.length > 3) {
            const newHistory = [query, ...history]
            localStorage.setItem("lastSearches", JSON.stringify(newHistory));
            setLastSearches(newHistory);
        }
        setSearchParams({ query });
        fetchProducts(query, category);
    }

    useEffect(() => {
        const query = searchParams.get("query") || '';
        if (query || query.length > 3) fetchProducts(query, category);
        else setSkeleton(false);
    }, [searchParams, category])

    if (info) return <NoInfoComplete />
    if (error) return <Error status={error.status} error={error.message} />

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Loader isVisible={loading} />
                <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} active={"Search"} />
                <div className="container mx-auto px-10 pt-30 flex-grow">
                    <div className="flex  justify-center items-center">
                        <InputSearch handleSearch={handleSearch} searches={lastSearches} setSearches={setLastSearches} />
                    </div>
                    <h1 className="text-2xl font-bold mb-5">Resultados de búsqueda para "{searchParams.get("query")}"</h1>
                    <div className="flex gap-4 text-xl overflow-x-auto mb-10">
                        <Link to={{ pathname: "/products/search", search: `?query=${searchParams.get("query") || ''}` }} className={` ${typeof category === "undefined" ? "border-b-2 border-[#ffd200] text-[#004aad]" : "text-[#002960] hover:text-[#004aad] hover:border-b-2 hover:border-[#ffd200]"} transition-colors duration-300 font-semibold`}>Todo</Link>
                        <Link to={{ pathname: "/products/search/calzado", search: `?query=${searchParams.get("query") || ''}` }} className={`${category === "calzado" ? "border-b-2 border-[#ffd200] text-[#004aad]" : "text-[#002960] hover:text-[#004aad] hover:border-b-2 hover:border-[#ffd200]"} font-semibold transition-colors duration-300`}>Calzado</Link>
                        <Link to={{ pathname: "/products/search/gorras", search: `?query=${searchParams.get("query") || ''}` }} className={`${category === "gorras" ? "border-b-2 border-[#ffd200] text-[#004aad]" : "text-[#002960] hover:text-[#004aad] hover:border-b-2 hover:border-[#ffd200]"} font-semibold transition-colors duration-300`}>Gorras</Link>
                        <Link to={{ pathname: "/products/search/relojes", search: `?query=${searchParams.get("query") || ''}` }} className={`${category === "relojes" ? "border-b-2 border-[#ffd200] text-[#004aad]" : "text-[#002960] hover:text-[#004aad] hover:border-b-2 hover:border-[#ffd200]"} font-semibold transition-colors duration-300`}>Relojes</Link>
                        <Link to={{ pathname: "/products/search/gafas", search: `?query=${searchParams.get("query") || ''}` }} className={`${category === "gafas" ? "border-b-2 border-[#ffd200] text-[#004aad]" : "text-[#002960] hover:text-[#004aad] hover:border-b-2 hover:border-[#ffd200]"} font-semibold transition-colors duration-300`}>Gafas</Link>
                        <Link to={{ pathname: "/products/search/perfumes", search: `?query=${searchParams.get("query") || ''}` }} className={`${category === "perfumes" ? "border-b-2 border-[#ffd200] text-[#004aad]" : "text-[#002960] hover:text-[#004aad] hover:border-b-2 hover:border-[#ffd200]"} font-semibold transition-colors duration-300`}>Perfumes</Link>
                        <Link to={{ pathname: "/products/search/vapeadores", search: `?query=${searchParams.get("query") || ''}` }} className={`${category === "vapeadores" ? "border-b-2 border-[#ffd200] text-[#004aad]" : "text-[#002960] hover:text-[#004aad] hover:border-b-2 hover:border-[#ffd200]"} font-semibold transition-colors duration-300`}>Vapers</Link>
                    </div>
                    {
                        skeleton ?
                            <>
                                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center mt-10">
                                    {
                                        Array.from({ length: 8 }).map((_, index) => (
                                            <SkeletonCard key={index} />
                                        ))
                                    }
                                </div>
                            </>
                            :
                            !searchParams.get("query") || searchParams.get("query").length < 3 ?
                                <>
                                    <div className="flex justify-center items-center flex-col">
                                        <SvgSearchNotFound width={200} height={200} />
                                        <h4 className="text-2xl font-semibold text-center">Los parámetros de búsqueda son muy cortos</h4>
                                        <h6 className="text-xl font-medium text-gray-700 text-center">Escribe al menos 3 caracteres para iniciar una búsqueda.</h6>
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        products.length > 0 ?
                                            <>
                                                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center mt-10">
                                                    {
                                                        products.map(({ Id_producto, Nombre, Precio, Imagen, Tipo_Producto }) => (
                                                            <ProductCard ID={Id_producto} key={Id_producto} img={Imagen} name={Nombre} price={Precio} typeProduct={Tipo_Producto} />
                                                        ))
                                                    }
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="flex justify-center items-center flex-col">
                                                    <SvgSearchNotFound width={200} height={200} />
                                                    <h4 className="text-2xl font-semibold  text-center">No hay resultados de búsqueda para "{searchParams.get("query")}"</h4>
                                                    <h6 className="text-xl font-medium text-gray-700 text-center">Asegúrate de que todas las palabras estén escritas correctamente o intenta diferentes palabras claves.</h6>
                                                </div>
                                            </>
                                    }
                                </>
                    }
                </div>
                {
                    (searchParams.get("query") && searchParams.get("query").length > 3 && products.length != 0) && (
                        <Footer />
                    )
                }
                <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />
                <ModalLogin isOpenModal={isOpenModal} openRegister={openRegister} close={close} isVisible={isVisible} />
            </div>
        </>
    )
}