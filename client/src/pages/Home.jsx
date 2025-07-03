// Modules
import { useEffect, useState } from "react";

// Components
import NavBar from "../components/NavBars/Navbar.jsx";
import ModalLogin from "../components/Modals/ModalLogin.jsx";
import ModalRegister from "../components/Modals/ModalRegister.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import HomeSection from "../components/HomeSection.jsx";
import Title from "../components/Tittle.jsx";
import Divider from "../components/Divider.jsx";
import Footer from "../components/Footer.jsx";
import NoInfoComplete from "./NoInfoComplete.jsx";
import ButtonViewMore from "../components/Buttons/ButtonViewMore.jsx";

// services
import { getProducts } from "../services/productsService.js";

//Hooks
import { useModalLogin, useModalRegister } from "../hooks/useModal.js";
import { usePageLoader } from "../hooks/useLoader.js";

export default function Home() {
    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [info, setInfo] = useState(false);
    const [products, setProducts] = useState([]);
    const [isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);

    const getProductsData = async () => {
        startLoading();
        try {
            const response = await getProducts();
            setProducts(response.data.products);
            setIsLogin(response.data.user);
        } catch (e) {
            if (e.status === 400) {
                setInfo(true);
                return;
            }
            setError({ status: error.status, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            stopLoading();
        }
    };


    useEffect(() => {
        document.title = "Tendencia Urbana 360";
        getProductsData();
    }, []);

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />

    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} active={"Home"} />
            <HomeSection openLogin={open} isLogin={isLogin} />
            <Title text={"Lo último en la tendencia urbana"} />
            <Divider />
            <div id="portafolio" className="container mx-auto px-10">
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center">
                    {
                        products.length > 0 ?
                            products.map(({ Id_producto, Nombre, Precio, Imagen, Tipo_Producto }) => {
                                return (
                                    <ProductCard ID={Id_producto} key={Id_producto} img={Imagen} name={Nombre} price={Precio} typeProduct={Tipo_Producto} />
                                )
                            })
                            :
                            <>
                                <h1 className="text-4xl col-span-full text-center">Ups! Error al cargar los productos</h1>
                            </>
                    }
                </div>
                {
                    products.length > 0 ?
                        <div className="mt-10 mb-10 text-center">
                            <ButtonViewMore />
                        </div>
                        :
                        <></>

                }
            </div>
            <Footer />
            {
                isLogin ?
                    <></>
                    :
                    <>
                        <ModalLogin isOpenModal={isOpenModal} openRegister={openRegister} close={close} isVisible={isVisible} />
                        <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />
                    </>
            }
        </>
    )
}