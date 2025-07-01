// Modules
import { useEffect, useState } from "react";

// Components
import NavBar from "../components/NavBars/Navbar";
import ModalLogin from "../components/Modals/ModalLogin";
import ModalRegister from "../components/Modals/ModalRegister";
import Loader from "../components/Loader";
import Error from "../pages/Error";

// hooks
import { useModalLogin, useModalRegister } from "../hooks/useModal";
import { usePageLoader } from "../hooks/useLoader";

//service
import { getAllProducts } from "../services/productsService";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import NoInfoComplete from "./NoInfoComplete";

export default function Products() {
    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();

    const [products, setProducts] = useState([]);
    const [info, setInfo] = useState(false);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(null);

    const getAllProductsData = async () => {
        try {
            startLoading();
            const response = await getAllProducts();

            if (response.status === 200) {
                setProducts(response.data.products)
                setIsLogin(response.data.user);
            }
        } catch (error) {
            if (error.status === 400) {
                setInfo(true);
            }
            setError({ status: error?.status || 500, message: error.response?.data?.message || "Error Desconocido al cargar los productos" })
        } finally {
            stopLoading();
        }
    }
    useEffect(() => {
        document.title = "Productos";
        getAllProductsData();
    }, [])

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />

    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} active={"Products"} />

            <div className="container pt-24 mx-auto px-10">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center ">
                    {
                        products.map(({ Id_Product, Nombre, Precio, Imagen }) => {
                            return (
                                <ProductCard ID={Id_Product} img={Imagen} name={Nombre} price={Precio} key={Id_Product} />
                            )
                        })
                    }
                </div>
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