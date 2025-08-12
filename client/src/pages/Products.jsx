// Modules
import { useEffect, useRef, useState } from "react";

// Components
import NavBar from "../components/NavBars/Navbar";
import ModalLogin from "../components/Modals/ModalLogin";
import ModalRegister from "../components/Modals/ModalRegister";
import Loader from "../components/Loader";
import Error from "../pages/Error";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import NoInfoComplete from "./NoInfoComplete";

// hooks
import { useModalLogin, useModalRegister } from "../hooks/useModal";
import { usePageLoader } from "../hooks/useLoader";

//service
import { getAllProducts } from "../services/productsService";

export default function Products() {
    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();

    const [products, setProducts] = useState([]);
    const [info, setInfo] = useState(false);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const loaderRef = useRef();

    const getAllProductsData = async (pageNumber) => {
        setLoadingMore(true);
        try {
            if (pageNumber === 1) startLoading();
            const response = await getAllProducts(pageNumber);

            if (response.status === 200) {
                if (pageNumber === 1) setIsLogin(response.data.user);

                if (response.data.products.length === 0) setHasMore(false)
                else setProducts((prev) => [...prev, ...response.data.products])
            }
        } catch (error) {
            if (error.status === 400) {
                setInfo(true);
            }
            setError({ status: error?.status || 500, message: error.response?.data?.message || "Error Desconocido al cargar los productos" })
        } finally {
            stopLoading()
        }
        setLoadingMore(false);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) setPage((prev) => prev + 1);
            },
            { threshold: 1 }
        )

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => observer.disconnect();

    }, [loadingMore, hasMore]);

    useEffect(() => {
        getAllProductsData(page);
    }, [page])

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />

    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} active={"Products"} />

            <div className="container pt-24 mx-auto px-10">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center ">
                    {
                        products.map(({ Id_producto, Nombre, Precio, Imagen, Tipo_Producto }) => (

                            <ProductCard ID={Id_producto} img={Imagen} name={Nombre} price={Precio} key={Id_producto} typeProduct={Tipo_Producto} />
                        ))
                    }
                    {
                        loadingMore && (
                            Array.from({ length: 8 }).map((_, idx) => (
                                <SkeletonCard key={idx} />
                            ))
                        )
                    }
                </div>
                <div ref={loaderRef} className="h-5"></div>
            </div>
            {!isLogin ?
                <>
                    <ModalLogin isOpenModal={isOpenModal} openRegister={openRegister} close={close} isVisible={isVisible} />
                    <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />

                </>
                :
                <></>
            }
            <Footer />
        </>
    )
}