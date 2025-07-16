// Modules
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

export default function ProductsByCategory() {
    const { type } = useParams();

    const [isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(false);

    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();

    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        startLoading();
        try {
            const res = await getProductsByCategory(type);
            if (res.status === 200) {
                setIsLogin(res.data.user);
                setProducts(res.data.products);
            }

        } catch (e) {
            if (e.status === 400) {
                setInfo(true);
                return;
            }
            setError({ status: e?.status || 500, message: e?.response?.data?.message || "Error inesperado" })
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        getProducts();
    }, [])

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />

    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} />

            <ModalLogin close={close} isOpenModal={isOpenModal} isVisible={isVisible} openRegister={openRegister} />
            <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />
            <div className="container mx-auto px-10 pt-24">
                <Title text={textCapitalize(type)} />
                <Divider />
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 justify-center ">

                    {
                        products.map(({ Id_producto, Nombre, Precio, Imagen, Tipo_Producto }) => (
                            <ProductCard ID={Id_producto} img={Imagen} name={Nombre} price={Precio} key={Id_producto} typeProduct={Tipo_Producto} />
                        ))
                    }
                </div>
            </div>
            <Footer />
        </>

    )
}