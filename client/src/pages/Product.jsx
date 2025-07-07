// Modules
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";

// components
import Error from "./Error";
import Loader from "@/components/Loader";
import NavBar from "@/components/NavBars/Navbar";
import NoInfoComplete from "./NoInfoComplete";
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ModalLogin from "@/components/Modals/ModalLogin";
import ModalRegister from "@/components/Modals/ModalRegister";
import formatCurrency from "@/utils/formatCurrency";
import Select from "@/components/Inputs/Select";
import ButtonBlank from "@/components/Buttons/ButtonBlank";
import Footer from "@/components/Footer";

// Hooks
import { useModalLogin, useModalRegister } from "@/hooks/useModal";
import { usePageLoader } from "@/hooks/useLoader";
import getExtension from "@/utils/getExtension";
import Autoplay from "embla-carousel-autoplay";

// Services
import { getProductByID } from "@/services/productsService";
import { IMG_URL } from "@/config";

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
    const [price, setPrice] = useState(false);
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
            if (e.status === 400) {
                setInfo(true);
                return;
            }
            setError({ status: e?.status || 500, message: e?.response?.data?.message || "Error inesperado" })
        } finally {
            stopLoading();
        }
    }


    const handleType = (val) => {
        const prices = JSON.parse(localStorage.getItem("types"));
        setPrice(prices[val] ? prices[val] : product.Precio)
    }

    useEffect(() => {
        getProduct(type, id);
    }, [])

    useEffect(() => {
        if (product?.Nombre) document.title = product.Nombre
        else document.title = "Cargando..."

        if (extra[0]?.ID) {
            const types = {}
            extra.forEach(item => types[item.ID] = item.Precio ? item.Precio : product.Precio);

            types['default'] = product.Precio
            localStorage.setItem("types", JSON.stringify(types))
        }

    }, [product, extra])

    if (!validCategories.includes(type)) return <Error status={404} error={"Página no encontrada"} />
    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />
    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} />
            <div className="container mx-auto px-10 pt-30">
                <div className="grid grid-cols-12 bg-white p-14 rounded-2xl border-gray-700">
                    <div className="col-span-8 place-items-center">
                        <h1 className="text-5xl mb-5 font-bold uppercase text-left">{product.Nombre}</h1>
                        <Carousel className={`w-2/3`} >
                            <CarouselContent>
                                {
                                    extra.map((item) => (
                                        <CarouselItem key={item.ID} className={``}>
                                            <Card className={`border-none shadow-none`}>
                                                <CardContent className={`flex items-center justify-center `}>
                                                    {
                                                        getExtension(item.Imagen) === 'webp' ?
                                                            <img width={600} src={`${IMG_URL}${item.Imagen}`} alt={product.Nombre} />
                                                            :
                                                            <video width={600} src={`${IMG_URL}${item.Imagen}`} muted controls={false} autoPlay loop></video>
                                                    }
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))
                                }
                            </CarouselContent>
                            <CarouselPrevious className={`cursor-pointer`} />
                            <CarouselNext className={`cursor-pointer`} />
                        </Carousel>
                    </div>
                    <div className="col-span-4">
                        <h1 className="text-3xl text-center font-semibold">Sobre el producto</h1>
                        <hr className="border my-10" />
                        <div className="flex justify-between mb-20 text-2xl font-semibold uppercase">
                            <h5>Precio: </h5>
                            <h5>{formatCurrency(price ? price : product.Precio)}</h5>
                        </div>
                        {
                            description && description.length > 0 ?
                                <div className="mb-20 text-2xl font-semibold uppercase">
                                    <h5 className="mb-5">Descripción: </h5>
                                    <h5 className="text-center font-medium">{description[0].Descripcion}</h5>
                                </div>
                                :
                                <></>
                        }
                        {
                            extra.length > 0 && typeof extra[0].Color != "undefined" ?
                                <div className="mb-20 text-2xl font-semibold uppercase">
                                    <h5 className="mb-5">Elegir Color: </h5>
                                    <Select data={extra} labelKey="Color" valueKey="ID" />
                                </div>
                                :
                                <></>
                        }
                        {
                            sizes.length > 0 && sizes ?
                                <div className="mb-20 text-2xl font-semibold uppercase">
                                    <h5 className="mb-5">Elegir Talla: </h5>
                                    <Select data={sizes} labelKey="Talla" valueKey="ID" />
                                </div>
                                :
                                <></>
                        }
                        {
                            type === "perfumes" ?
                                <Select data={extra} labelKey="Tipo" valueKey="ID" onChange={handleType} />
                                :
                                <></>
                        }
                        {
                            type === "calzado" ?
                                <ButtonBlank color={"#004aad"} letterColor={"black"} >Guia de tallas</ButtonBlank>
                                :
                                <></>
                        }
                        <hr className="border my-10" />
                        <ButtonBlank color={"#00af4c"} letterColor={"black"} >Comprar por Whastapp</ButtonBlank>
                        <>
                            <hr className="border my-10" />
                            <ButtonBlank onClick={() => isLogin ? "" : open()} color={"#ecc500"} letterColor={"black"} >Añadir al carrito</ButtonBlank>
                        </>
                    </div>
                </div>
            </div>
            <Footer />
            <ModalLogin close={close} isOpenModal={isOpenModal} isVisible={isVisible} openRegister={openRegister} />
            <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />
        </>
    )
}