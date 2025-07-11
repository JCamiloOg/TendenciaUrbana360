// Modules
import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react'

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
import sizesGuide from "../assets/guiasTallas.jpg"

// Hooks
import { useModalLogin, useModalRegister } from "@/hooks/useModal";
import { usePageLoader } from "@/hooks/useLoader";
import getExtension from "@/utils/getExtension";

// Services
import { getProductByID } from "@/services/productsService";
import { IMG_URL } from "@/config";
import ModalImage from "@/components/Modals/ModalImage";
import SelectWithImages from "@/components/Inputs/SelectWithImage";
import SelectRounded from "@/components/Inputs/SelectRounded";

export default function Product() {
    const { type, id } = useParams();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [product, setProduct] = useState([]);
    const [description, setDescription] = useState(false);
    const [extra, setExtra] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [price, setPrice] = useState(false);
    const [isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(false);
    const [isOpenModalImage, setIsOpenModalImage] = useState(false);
    const [imageModal, setImageModal] = useState("");

    const [productSelected, setProductSelected] = useState(false);
    const [sizesSelected, setSizesSelected] = useState(false);
    const [typeSelected, setTypeSelected] = useState(false);


    const getProduct = async (type, id) => {
        startLoading();
        try {
            const res = await getProductByID(type, id);
            if (res.status === 200) {
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
        setPrice(prices[val] ? prices[val] : product.Precio);
        if (val === typeSelected) setTypeSelected(false);
        else setTypeSelected(val);
    }

    const handleSizes = (val) => {
        if (val === sizesSelected) setSizesSelected(false);
        else setSizesSelected(val);
    }

    const handleModalImg = (img) => {
        setIsOpenModalImage(!isOpenModalImage);
        setImageModal(img);
    }

    const scrollTo = useCallback((index, id) => {
        if (emblaApi) emblaApi.scrollTo(index)
        setSelectedIndex(index)
        setProductSelected(id)
    }, [emblaApi])

    useEffect(() => {
        if (emblaApi) {
            emblaApi.on('select', () => {
                setSelectedIndex(emblaApi.selectedScrollSnap())
            })
        }
    }, [emblaApi])

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

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />
    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} />
            <div className="container mx-auto px-10 pt-30">
                <div className="grid grid-cols-12 bg-white p-14 rounded-2xl border-gray-700">
                    <div className="2xl:col-span-8 xl:col-span-8 lg:col-span-8 md:col-span-8 sm:col-span-12 col-span-12 mb-10  place-items-center">
                        <h1 className="text-5xl mb-5 font-bold uppercase text-left">{product.Nombre}</h1>
                        <div ref={emblaRef} className={`2xl:w-[75%] xl:w-[75%] lg:w-[75%] md:w-[70%] sm:w-[90%] w-[100%] overflow-hidden`}
                        >
                            <div className="flex">
                                {
                                    extra.map((item, idx) => (
                                        <div className="flex-[0_0_100%] px-2 cursor-pointer" onClick={() => handleModalImg(`${IMG_URL}${item.Imagen}`)} key={idx}>
                                            {
                                                getExtension(item.Imagen) === 'webp' ?
                                                    <img src={`${IMG_URL}${item.Imagen}`} alt={product.Nombre} />
                                                    :
                                                    <video src={`${IMG_URL}${item.Imagen}`} className="h-200" muted controls={false} autoPlay loop></video>
                                            }
                                        </div>
                                    ))
                                }
                                {/* <CarouselPrevious className={`cursor-pointer`} />
                            <CarouselNext className={`cursor-pointer`} /> */}
                            </div>
                        </div>
                    </div>
                    <div className="2xl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-12 col-span-12" >
                        <h1 className="text-3xl text-center font-semibold">Sobre el producto</h1>
                        <hr className="border my-10" />
                        <div className="flex justify-between mb-10 text-2xl font-semibold uppercase">
                            <h5>Precio: </h5>
                            <h5>{formatCurrency(price ? price : product.Precio)}</h5>
                        </div>
                        {
                            description && description.length > 0 ?
                                <div className="mb-10 text-2xl font-semibold uppercase">
                                    <h5 className="mb-5">Descripción: </h5>
                                    <h5 className="text-center font-medium">{description[0].Descripcion}</h5>
                                </div>
                                :
                                <></>
                        }
                        {
                            extra.length > 0 && typeof extra[0].Color != "undefined" ?
                                <div className="mb-10 text-2xl font-semibold uppercase">
                                    <h5 className="mb-5">Elegir Color: </h5>
                                    {/* <Select data={extra} labelKey="Color" valueKey="ID" /> */}
                                    <SelectWithImages options={extra} onSelect={scrollTo} selectedId={selectedIndex} />

                                </div>
                                :
                                <></>
                        }
                        {
                            sizes.length > 0 && sizes ?
                                <div className="mb-10 text-2xl font-semibold uppercase">
                                    <h5 className="mb-5">Elegir Talla: </h5>
                                    <SelectRounded options={sizes} labelKey="Talla" valueKey="ID" selected={sizesSelected} onSelect={handleSizes} />
                                </div>
                                :
                                <></>
                        }
                        {
                            type === "perfumes" ?
                                <SelectRounded options={extra} labelKey="Tipo" valueKey="ID" onSelect={handleType} selected={typeSelected} />
                                :
                                <></>
                        }
                        {
                            type === "calzado" ?
                                <ButtonBlank color={"#004aad"} letterColor={"black"} onClick={() => handleModalImg(sizesGuide)} >Guía de tallas</ButtonBlank>
                                :
                                <></>
                        }
                        <hr className="border my-7" />
                        <ButtonBlank color={"#00af4c"} letterColor={"black"} >Comprar por Whastapp</ButtonBlank>

                        <hr className="border my-7" />
                        <ButtonBlank onClick={() => isLogin ? "" : open()} color={"#ecc500"} letterColor={"black"} >Añadir al carrito</ButtonBlank>
                    </div>
                </div>
            </div>
            <Footer />
            <ModalLogin close={close} isOpenModal={isOpenModal} isVisible={isVisible} openRegister={openRegister} />
            <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />
            <ModalImage image={imageModal} isOpen={isOpenModalImage} updateVal={setIsOpenModalImage} />
        </>
    )
}