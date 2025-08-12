// Modules
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Components
import Loader from "@/components/Loader";
import ModalLogin from "@/components/Modals/ModalLogin";
import ModalRegister from "@/components/Modals/ModalRegister";
import NavBar from "@/components/NavBars/Navbar";
import NoInfoComplete from "./NoInfoComplete";
import Error from "./Error";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Hooks
import { usePageLoader } from "@/hooks/useLoader";
import { useModalLogin, useModalRegister } from "@/hooks/useModal";
import { getProductsByCategory } from "@/services/productsService";
import { textCapitalize } from "@/utils/formatText";
import Title from "@/components/Tittle";
import Divider from "@/components/Divider";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function ProductsByCategory() {
    const { type } = useParams();

    const [isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const loaderRef = useRef(null)

    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();


    const getProducts = async (pageNumber) => {
        setLoadingMore(true);
        try {
            if (pageNumber === 1) startLoading();
            const res = await getProductsByCategory(type, pageNumber);

            if (res.status === 200) {
                if (pageNumber === 1) {
                    setIsLogin(res.data.user);
                    setProducts(res.data.products);
                } else {
                    if (res.data.products.length === 0) setHasMore(false);
                    else setProducts((prev) => [...prev, ...res.data.products]);
                }
            }
        } catch (e) {
            if (e.status === 400) {
                setInfo(true);
                return;
            }
            if (pageNumber === 1) setError({ status: e?.status || 500, message: e?.response?.data?.message || "Error inesperado" })
        } finally {
            stopLoading();
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
    }, [loadingMore, hasMore])

    useEffect(() => {
        getProducts(page);
    }, [page])

    useEffect(() => {
        setPage(1);
        setProducts([]);
        setHasMore(true);
        setError(null);
        setInfo(false);
        getProducts(page);
    }, [type])

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />

    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} active={"Products"} productsLenght={[]} />

            <ModalLogin close={close} isOpenModal={isOpenModal} isVisible={isVisible} openRegister={openRegister} />
            <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />
            <div className="container mx-auto px-10 pt-24">
                <Title text={textCapitalize(type)} />
                <Divider />
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center ">

                    {
                        products.map(({ Id_producto, Nombre, Precio, Imagen, Tipo_Producto }, idx) => (
                            <ProductCard ID={Id_producto} img={Imagen} name={Nombre} price={Precio} key={idx} typeProduct={Tipo_Producto} />
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
            <Footer />
        </>

    )
}