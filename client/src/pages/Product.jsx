// Modules
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";

// components
import Error from "./Error";
import Loader from "@/components/Loader";
import NavBar from "@/components/NavBars/Navbar";
import NoInfoComplete from "./NoInfoComplete";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

// Hooks
import { useModalLogin, useModalRegister } from "@/hooks/useModal";
import { usePageLoader } from "@/hooks/useLoader";
import { getProductByID } from "@/services/productsService";
import { IMG_URL } from "@/config";
import getExtension from "@/utils/getExtension";

export default function Product() {
    const { type, id } = useParams();
    const validCategories = [
        'calzado', 'camisas', 'pantalones', 'gafas', 'gorras', 'relojes', 'perfumes', 'vapeadores'
    ];
    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();

    const [product, setProduct] = useState([]);
    const [description, setDescription] = useState(false);
    const [extra, setExtra] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(false);

    const getProduct = async (type, id) => {
        startLoading();
        try {
            const res = await getProductByID(type, id);
            if (res.status === 200) {
                console.log(res);
                setSizes(res.data.tallas);
                setExtra(res.data.extra);
                setDescription(res.data.descripcion);
                setProduct(res.data.data);
                setIsLogin(res.data.user);
            }
        } catch (e) {
            console.error(e);
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        getProduct(type, id);
    }, [])

    useEffect(() => {
        if (product?.Nombre) document.title = product.Nombre
        else document.title = "Cargando..."

    }, [product])



    if (!validCategories.includes(type)) return <Error status={404} error={"Página no encontrada"} />
    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />
    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} active={"Home"} />
            <div className="container mx-auto px-10">
                <h1 className="text-2xl text-center pt-28">Producto</h1>

                <Carousel>
                    <CarouselContent>
                        {
                            extra.map((item, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">                                                {
                                        getExtension(item.Imagen) === 'webp' ?
                                            <img width={300} height={300} src={`${IMG_URL}${item.Imagen}`} alt={product.Nombre} />
                                            :
                                            <video width={300} height={300} src={`${IMG_URL}${item.Imagen}`} muted controls={false} autoPlay loop></video>
                                    }
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div >
        </>
    )
}