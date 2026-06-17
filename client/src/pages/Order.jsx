import NavbarEmpty from "@/components/NavBars/NavBarEmpty";
import { useNavigate, useParams } from "react-router-dom";
import Error from "./Error";
import { useEffect, useState } from "react";
import { usePageLoader } from "@/hooks/useLoader";
import { getAdress, getOrder, saveOrder, updateAdress } from "@/services/orderService";
import ButtonBlank from "@/components/Buttons/ButtonBlank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faHouse, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "@/utils/formatCurrency";
import ModalImage from "@/components/Modals/ModalImage";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import InputField from "@/components/Inputs/Input";
import { useForm } from "react-hook-form";
import { SwalAlert, Toast } from "@/hooks/useToastAlert";

export default function Order() {
    const { step } = useParams();

    const steps = ["confirmAdress", "confirmOrder"];
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [disabled, setDisabled] = useState(false);
    const [cartStorage] = useState(() => {
        return JSON.parse(localStorage.getItem("cart") || "[]");
    });

    const { loading, startLoading, stopLoading } = usePageLoader();
    const [adress, setAdress] = useState(null);
    const [totalProducts, setTotalProducts] = useState(null);
    const [total, setTotal] = useState(null);
    const [order, setOrder] = useState([]);
    const [_isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);
    const [_info, setInfo] = useState(false);
    const navigate = useNavigate();
    const [isOpenModalImage, setIsOpenModalImage] = useState(false);
    const [image, setImage] = useState("");


    const fetchAdress = async () => {
        startLoading();
        document.title = "Cargando..."
        try {
            const res = await getAdress(cartStorage);
            if (res.status === 200) {
                setAdress(res.data.adress);
                setTotalProducts(res.data.total);
                setTotal(res.data.totalAmount);
                setIsLogin(res.data.user);
            }
        } catch (error) {
            if (error.status === 400) {
                if (typeof error.response.data.redirect === "undefined" || error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");
                return setInfo(true);
            }
            setError({ status: error?.status || 500, message: error.response?.data?.message || "Error inesperado" })
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }

    useEffect(() => {
        if (step === "confirmAdress") {
            fetchAdress();
            document.title = "Dirección de envío"
        } else {
            fetchOrder();
            document.title = 'Confirmar Compra'
        }

    }, [step])

    const fetchOrder = async () => {
        startLoading();
        document.title = "Cargando...";
        try {
            const res = await getOrder(cartStorage);
            if (res.status === 200) {
                setAdress(res.data.adress);
                setOrder(res.data.cart);
                setTotal(res.data.amount);
                setTotalProducts(res.data.products);
                setIsLogin(res.data.user);
            }
        } catch (error) {
            if (error.status === 400) {
                if (typeof error.response.data.redirect === "undefined" || error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");

                return setInfo(true);
            }
            setError({ status: error?.status || 500, message: error.response?.data?.message || "Error inesperado" })
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }


    useEffect(() => {
        if (step === "confirmAdress") {
            fetchAdress();
            document.title = "Dirección de envío"
        } else {
            fetchOrder();
            document.title = 'Confirmar Compra'
        }
    }, []);

    // useEffect(() => {
    //     if (step === "confirmAdress") {
    //         if (totalProducts !== null) {
    //             if (totalProducts < 1) {
    //                 navigate("/");
    //             }
    //         }
    //     } else if (step === "confirmOrder") {
    //         if (totalProducts !== null || order !== null) {
    //             if (totalProducts < 1 || order.length < 1) {
    //                 navigate("/");
    //             }
    //         }
    //     }
    // }, [totalProducts, order])

    const handleModalImage = (img) => {
        setIsOpenModalImage(!isOpenModalImage);
        setImage(img);
    }

    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            const res = await updateAdress(data);
            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    text: res.data.message,
                    timer: 3000,
                })
                setIsOpen(false);
                fetchAdress();
            } else {
                Toast.fire({
                    icon: "error",
                    text: res.data.message,
                    timer: 3000,
                })
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                text: error.response?.data?.message || "Error inesperado",
                timer: 3000
            })
        } finally {
            setTimeout(() => setDisabled(false), 3000);
        }
    }

    const handleConfirmOrder = () => {
        SwalAlert.fire({
            title: 'Confirmar Pedido',
            text: "¿Estás seguro de confirmar tu pedido?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await saveOrder(cartStorage);
                if (res.status === 200) {
                    SwalAlert.fire({
                        icon: "success",
                        title: "Pedido guardado correctamente",
                        text: res.data.message,
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                    }).then(() => {
                        localStorage.removeItem("cart");
                        navigate("/clients/profile");
                    })
                } else {
                    SwalAlert.fire({
                        icon: "error",
                        title: "Error al guardar el pedido",
                        text: res.data.message,
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                }
            }
        })
    }

    if (error) return <Error status={error.status} error={error.message} />
    if (!steps.includes(step)) return <Error status={404} error={"Página no encontrada."} />

    if (step === "confirmAdress") {

        return (
            <>
                <div className="min-h-screen flex flex-col">
                    <Loader isVisible={loading} />
                    <NavbarEmpty />
                    <div className="container mx-auto px-10 pt-30 flex-grow">
                        <h2 className="text-5xl font-semibold mb-4">Entrega</h2>
                        <div className="grid grid-cols-12 gap-5">
                            <div className="border col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-8 xl:col-span-9 2xl:col-span-9 bg-white px-4 py-20 rounded-md shadow-md hover:shadow-xl transition-all duration-300 ">
                                <p onClick={() => navigate(-1)} className="text-gray-600 mb-5 hover:text-black cursor-pointer transition-all duration-300"><FontAwesomeIcon icon={faChevronLeft} size="lg" /> Volver</p>
                                <h3 className="text-4xl font-medium mb-4">Dirección de envío:</h3>
                                <p className="font-bold mb-4"><FontAwesomeIcon icon={faLocationDot} /> {adress}</p>
                                <ButtonBlank onClick={() => setIsOpen(true)} color={`#007bff`}>Cambiar dirección</ButtonBlank>
                            </div>
                            <div className="border col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-3 bg-white px-4 py-10 rounded-md shadow-md hover:shadow-xl transition-all duration-300 ">
                                <h3 className="text-md  font-bold mb-10">Resumen de la compra:</h3>
                                {
                                    totalProducts == 1 ?
                                        <p className="font-bold">Pagas <span className="text-gray-600">{formatCurrency(total)}</span></p>
                                        :
                                        <>
                                            <p className="font-bold mb-5">{`Productos (${totalProducts})`}</p>
                                            <div className="flex justify-between">
                                                <p className="font-bold">Pagas</p>
                                                <p className="text-gray-600 font-bold">{formatCurrency(total)}</p>
                                            </div>
                                        </>
                                }
                                <hr className="text-gray-700 my-7" />
                                <ButtonBlank onClick={() => navigate("/clients/order/confirmOrder")} color={`#28a745`}>Continuar con la compra</ButtonBlank>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Cambiar dirección de envío</DialogTitle>
                                <DialogDescription>
                                    Se actualizará de tu perfil la nueva dirección
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-6">
                                <InputField icon={faHouse} label={"Dirección"} type={"text"} isError={errors.direccion ? true : false} {...register("direccion", {
                                    required: true,
                                    maxLength: 100,
                                    minLength: 5
                                })} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <ButtonBlank className={`rounded-md`} color={`#006af9`}>Cerrar</ButtonBlank>
                                </DialogClose>
                                <ButtonBlank className={`rounded-md`}
                                    color={`#28a745`}
                                    type={"submit"}
                                    disabled={disabled || Object.keys(errors).length > 0}>Actualizar</ButtonBlank>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        )
    } else if (step === "confirmOrder") {
        return (
            <>
                <div className="min-h-screen flex flex-col">
                    <Loader isVisible={loading} />
                    <NavbarEmpty />
                    <div className="container mx-auto px-10 pt-30 flex-grow">
                        <h2 className="text-4xl font-semibold mb-5">Confirmar compra</h2>
                        <p className="font-semibold mb-4"><FontAwesomeIcon icon={faLocationDot} /> {adress}</p>
                        <div className="grid grid-cols-12 gap-5">
                            <div className="px-4 py-5 border col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-8 xl:col-span-9 2xl:col-span-9 h-135 bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300 ">
                                <p onClick={() => navigate(-1)} className="text-gray-600 mb-5 hover:text-black cursor-pointer transition-all duration-300"><FontAwesomeIcon icon={faChevronLeft} size="lg" /> Volver</p>
                                <h5 className="text-3xl font-semibold mb-10">Productos</h5>
                                {
                                    <ul role="list" className="-my-6 divide-y divide-gray-700  h-100 overflow-y-auto">
                                        {
                                            order.map((item, idx) => (
                                                <li className="flex py-6" key={idx}>
                                                    <div onClick={() => handleModalImage(item.Imagen)} className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200 cursor-pointer">
                                                        <img src={item.Imagen} alt={item.Nombre} className="size-full object-cover" />
                                                    </div>
                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <p className={`font-bold text-2xl`}>{item.Nombre}</p>
                                                                </h3>
                                                                <p className="ml-4">{formatCurrency(item.Total)}</p>
                                                            </div>
                                                            {item.Color ? <p className="mt-1 text-sm text-gray-500">{item.Color}</p> : <></>}
                                                            {item.Talla ? <p className="mt-1 text-sm text-gray-500">{item.Talla}</p> : <></>}
                                                            {item.Tipo ? <p className="mt-1 text-sm text-gray-500">{item.Tipo}</p> : <></>}
                                                            <p className="mt-1 text-sm text-gray-500">Cantidad: {item.Cantidad}</p>
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                }
                            </div>
                            <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-3 h-80 bg-white rounded-md border shadow-md hover:shadow-xl transition-all duration-300 px-4 py-10">
                                <h3 className="text-md  font-bold mb-10">Resumen de la compra:</h3>
                                {
                                    totalProducts == 1 ?
                                        <p className="font-bold">Pagas <span className="text-gray-600">{formatCurrency(total)}</span></p>
                                        :
                                        <>
                                            <p className="font-bold mb-5">{`Productos (${totalProducts})`}</p>
                                            <div className="flex justify-between">
                                                <p className="font-bold">Pagas</p>
                                                <p className="text-gray-600 font-bold">{formatCurrency(total)}</p>
                                            </div>
                                        </>
                                }
                                <hr className="text-gray-700 my-7" />
                                <ButtonBlank onClick={handleConfirmOrder} className={`w-full`} color={`#007bff`}>Confirmar Compra</ButtonBlank>
                            </div>
                        </div>
                    </div>
                    <ModalImage image={image} isOpen={isOpenModalImage} updateVal={setIsOpenModalImage} />
                    <Footer />
                </div>
            </>
        )
    }


}