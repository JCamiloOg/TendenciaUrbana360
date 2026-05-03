// Modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalRegister from "../components/Modals/ModalRegister";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { faUser, faLocationDot, faLock, faBoxesPacking, faChevronDown, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import NavBar from "../components/NavBars/Navbar";
import Error from "../pages/Error";
import NoInfoComplete from "./NoInfoComplete";
import TableDynamic from "@/components/ui/tableComponent";

// Hooks
import { usePageLoader } from "../hooks/useLoader";
import { profileInfo } from "../services/users/usersServices";
import useDynamicColumns from "@/hooks/useDynamicColumns";
import { Toast } from "@/hooks/useToastAlert";
import { getOrderByID } from "@/services/users/ordersServices";
import formatCurrency from "@/utils/formatCurrency";
import useIsMobile from "@/hooks/useIsMobile";
import { checkAuth } from "@/services/users/updateInfoServices";
import ButtonBlank from "@/components/Buttons/ButtonBlank";
import ModalImage from "@/components/Modals/ModalImage";
import InputField from "@/components/Inputs/Input";
import CopyButton from "@/components/Buttons/CopyButton";
import DatePicker from "@/components/Inputs/DatePicker";
import { formatDate } from "@/utils/formatDate";

export default function Profile() {
    const [isOpen, setIsOpen] = useState(false);
    const [letters, setLetters] = useState(null);
    const [info, setInfo] = useState(null);
    const [infoUser, setInfoUser] = useState("");
    const [orders, setOrders] = useState([]);
    const [detailOrders, setDetailOrders] = useState([]);
    const [idOrder, setIdOrder] = useState(null);
    const [isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [searchOrder, setSearchOrder] = useState([])

    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const columns = useDynamicColumns(orders);
    const [image, setImage] = useState("");
    const [isOpenModalImage, setIsOpenModalImage] = useState(false);

    const { loading, startLoading, stopLoading } = usePageLoader();

    const getInfo = async () => {
        startLoading();
        try {
            const res = await profileInfo();
            if (res.status === 200) {
                setInfoUser(res.data.info);
                setOrders(res.data.orders);
                setLetters(res.data.initialLetters);
                setIsLogin(res.data.user);
                setSearchOrder(res.data.orders);
            }
        } catch (error) {
            if (error.status === 400) {
                if (typeof error.response.data.redirect === "undefined" || error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");

                setInfo(true);
                return;
            }
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }

    const viewMore = async (id) => {
        try {
            const res = await getOrderByID(id);

            if (res.status === 200) {
                setIsOpen(true);
                setDetailOrders(res.data);
                setIdOrder(id);
            }

        } catch (e) {
            console.error(e);
            Toast.fire({
                icon: "error",
                title: e.response?.data?.message || "Error al obtener la información",
                timer: 3000
            })
        }
    }

    useEffect(() => {
        document.title = "Perfil"

        getInfo();
    }, []);

    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(() => {
                setDetailOrders([]);
                setIdOrder(null);
            }, 1000);

            return () => clearTimeout(timeout)
        }
    }, [isOpen]);

    const handleModify = async (redirect) => {
        setDisabled(true);
        try {
            const res = await checkAuth(redirect);
            if (res.status === 200) {
                navigate(res.data.redirect);
            }
        } catch (e) {
            console.log(e);
            Toast.fire({
                icon: "error",
                title: "Error inesperado",
                timer: 3000
            })
        } finally {
            setTimeout(() => setDisabled(false), 500);
        }
    }

    const handleModalImage = (img) => {
        setIsOpenModalImage(!isOpenModalImage);
        setImage(img);
    }

    const onSearchOrder = (value) => {
        if (!value) return setSearchOrder(orders);
        const date = formatDate(value);


        const filter = orders.filter((order) => order.Fecha.includes(date));
        if (filter.length == 0) {
            return Toast.fire({
                title: `No se han encontrado pedidos con la fecha ${date}`,
                icon: "error",
                timer: 3000
            })
        }
        setSearchOrder(filter);
    }

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />


    return (
        <>
            <Loader isVisible={loading} />
            <NavBar isLogin={isLogin} active={"Profile"} />

            <div className={`container mx-auto ${!isMobile ? "px-10" : "px-1"} pt-28`}>
                <div className="p-3 border border-gray-300 rounded-sm bg-white  shadow-2xs mb-12">
                    {

                    }
                    <div className="flex flex-wrap gap-4" >
                        <div className="ml-2.5 2xl:flex xl:flex lg:flex md:flex sm:flex hidden text-[28px] border-1 border-solid rounded-full  items-center justify-center max-h-[80px] max-w-[80px] min-h-[80px] min-w-[80px]">{letters}</div>
                        <div className="flex flex-col">
                            <h2 className="mt-2 text-2xl font-semibold 2xl:text-3xl xl:text-3xl lg:text-3xl md:text-3xl sm:text-3xl break-words whitespace-normal">
                                {`${infoUser.Nombre} ${infoUser.Apellido}`}
                            </h2>
                            <p className="break-words whitespace-normal">{infoUser.Correo}</p>
                        </div>
                    </div>
                </div>

                {/* Accordion */}
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="contactInfo" className={`mb-12`}>
                        <AccordionTrigger className={`hover:no-underline p-7 [&>svg]:hidden bg-white border border-gray-300 cursor-pointer `}>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} size="lg" />
                                <span className="text-left font-semibold">Datos de contacto</span>
                            </div>
                            <FontAwesomeIcon icon={faChevronDown} size="lg" className="transition-all duration-300" />
                        </AccordionTrigger>
                        <AccordionContent className={`bg-transparent p-7`}>
                            {
                                infoUser.Password !== null ?
                                    <div className="w-full p-7 bg-white rounded-sm border border-gray-300 mb-12">
                                        <h2 className="text-lg font-bold mb-2">Correo Electrónico</h2>
                                        <p className="text-gray-400 text-lg mb-5 break-words ">{infoUser.Correo}</p>
                                        <ButtonBlank className="rounded-md 2xl:w-sm xl:w-sm lg:w-sm md:w-xs sm:w-xs w-full" onClick={() => handleModify("email")} color={"#007bff"} disabled={disabled}>Modificar</ButtonBlank>
                                    </div>
                                    :
                                    <></>
                            }
                            <div className="w-full p-7 bg-white rounded-sm border border-gray-300">
                                <h2 className="text-lg font-bold mb-2">Teléfono</h2>
                                <p className="text-gray-400 text-lg mb-5">{infoUser.Telefono}</p>
                                <ButtonBlank className="rounded-md 2xl:w-sm xl:w-sm lg:w-sm md:w-xs sm:w-xs w-full" onClick={() => handleModify("phone")} color={"#007bff"} disabled={disabled}>Modificar</ButtonBlank>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="adressInfo" className={`mb-12`}>
                        <AccordionTrigger className={`hover:no-underline p-7 [&>svg]:hidden bg-white border border-gray-300 cursor-pointer `}>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faLocationDot} size="lg" />
                                <span className="text-left font-semibold">Dirección</span>
                            </div>
                            <FontAwesomeIcon icon={faChevronDown} size="lg" className="transition-all duration-300" />
                        </AccordionTrigger>
                        <AccordionContent className={`bg-transparent p-7`}>
                            <div className="w-full p-7 bg-white rounded-sm border border-gray-300">
                                <h2 className="text-lg font-bold mb-2">Dirección</h2>
                                <p className="text-gray-400 text-lg mb-5">{infoUser.Direccion}</p>
                                <ButtonBlank className="rounded-md 2xl:w-sm xl:w-sm lg:w-sm md:w-xs sm:w-xs w-full" onClick={() => handleModify("address")} color={"#007bff"} disabled={disabled}>Modificar</ButtonBlank>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    {
                        infoUser.Password !== null ?
                            <AccordionItem value="passwordInfo" className={`mb-12`}>
                                <AccordionTrigger className={`hover:no-underline p-7 [&>svg]:hidden bg-white border border-gray-300  cursor-pointer`}>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faLock} size="lg" />
                                        <span className="text-left font-semibold">Contraseña</span>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronDown} size="lg" className="transition-all duration-300" />
                                </AccordionTrigger>
                                <AccordionContent className={`bg-transparent p-7`}>
                                    <div className="w-full p-7 bg-white rounded-sm border border-gray-300">
                                        <h2 className="text-lg font-bold mb-2">Contraseña</h2>
                                        <p className="text-gray-400 text-lg mb-5">{"*".repeat(Math.floor(Math.random() * 20) + 8)}</p>
                                        <ButtonBlank className="rounded-md 2xl:w-sm xl:w-sm lg:w-sm md:w-xs sm:w-xs w-full" onClick={() => handleModify("password")} color={"#007bff"} disabled={disabled}>Modificar</ButtonBlank>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            :
                            <></>
                    }
                    <AccordionItem value="ordersInfo" className={`mb-12`}>
                        <AccordionTrigger className={`hover:no-underline p-7 [&>svg]:hidden bg-white border border-gray-300 cursor-pointer `}>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faBoxesPacking} size="lg" />
                                <span className="text-left font-semibold">Pedidos</span>
                            </div>
                            <FontAwesomeIcon icon={faChevronDown} size="lg" className="transition-all duration-300" />
                        </AccordionTrigger>
                        <AccordionContent className={`bg-transparent p-7`}>
                            <div className="w-full p-7 bg-white rounded-sm border border-gray-300">
                                {
                                    searchOrder.length > 0 ?
                                        !isMobile ?
                                            <>
                                                <DatePicker label={"Buscar pedido por fecha"} onChange={onSearchOrder} text={"Seleccione una fecha"} />
                                                <TableDynamic columns={columns} title={`Listado de pedidos`} data={searchOrder} viewMore={viewMore} />
                                            </>
                                            :
                                            <>
                                                <DatePicker label={"Buscar pedido por fecha"} onChange={onSearchOrder} text={"Seleccione una fecha"} />
                                                <p className="text-gray-500">Dale click a cualquier pedido para ver más información.</p>
                                                <table class="w-full ">
                                                    <tbody class="w-40 ">
                                                        {
                                                            searchOrder.map((order, index) => (
                                                                <tr class={`transform scale-100 text-xs py-1 border-b-2 border-black ${order.Estado == "Completado" ? "bg-green-500/30" : ""} ${order.Estado == "Pendiente" ? "bg-yellow-500/30" : ""} ${order.Estado == "Cancelado" ? "bg-red-500/30" : ""} ${order.Estado == "En Proceso" ? "bg-blue-500/30" : ""} cursor-pointer`} onClick={() => viewMore(order.PedidoID)} key={index}>
                                                                    <td class="pl-5 pr-3 whitespace-no-wrap">
                                                                        <div class="text-black text-xl">Fecha</div>
                                                                        <div className="text-lg">{order.Fecha}</div>
                                                                    </td>

                                                                    <td class="px-2 py-2 whitespace-no-wrap">
                                                                        <div class="leading-5 text-black mb-4 font-medium text-xl">Información</div>
                                                                        <div class="leading-5 w-40 text-gray-900 text-lg"> # Pedido: <span className="text-sm truncate overflow-hidden whitespace-nowrap block">{order.PedidoID}</span>
                                                                        </div>
                                                                        <div class="leading-5 text-gray-800 text-lg mb-2">Estado: {order.Estado}</div>
                                                                        <div class="leading-5 text-gray-800 text-lg">Total: {formatCurrency(order.Total)}</div>
                                                                    </td>

                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </>
                                        :
                                        <h1 className="text-3xl font-bold text-center">No hay pedidos para mostrar.</h1>
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <Footer />
            <ModalImage image={image} isOpen={isOpenModalImage} updateVal={setIsOpenModalImage} />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className={`max-w-5/6 sm:max-w-[530px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1150px] 2xl:max-w-[1400px]`}>
                    <DialogHeader>
                        <DialogTitle className={`text-left`}>Detalles del pedido</DialogTitle>
                        <DialogDescription className={`text-left ${isMobile ? "break-words whitespace-normal w-70" : ""}`}>{idOrder}</DialogDescription>
                        <div className="">
                            {
                                !isMobile ?
                                    <Table className={`min-w-[600px]`}>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Prodcuto</TableHead>
                                                <TableHead>Color</TableHead>
                                                <TableHead>Talla</TableHead>
                                                <TableHead>Imagen</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {detailOrders.map((pro, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{pro.Nombre}</TableCell>
                                                    <TableCell>{pro.Color ? pro.Color : "No aplica"}</TableCell>
                                                    <TableCell>{pro.Talla ? pro.Talla : "No aplica"}</TableCell>
                                                    <TableCell><img width={150} src={`${pro.Imagen}`} alt={pro.Nombre} /></TableCell>
                                                    <TableCell>{formatCurrency(pro.Total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    :
                                    <ul className="flex flex-col w-full">
                                        {
                                            detailOrders.map((pro, index) => (
                                                <li className="border-gray-400 flex flex-row mb-2 text-left" onClick={() => handleModalImage(pro.Imagen)} key={index}>
                                                    <div className="select-none cursor-pointer bg-gray-200 rounded-md flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                                                        {/* <div className="flex flex-col rounded-md w-10 h-10 bg-gray-300 justify-center items-center mr-4"><img src={`${pro.Imagen}`} alt={pro.Nombre} /></div> */}
                                                        <div className="flex-1 pl-1 mr-16">
                                                            <div className="font-medium decoration-0 underline" >{pro.Nombre}</div>
                                                            <div className="text-gray-600 text-sm">Talla: {`${pro.Talla ? pro.Talla : "No aplica"}`}</div>
                                                            <div className="text-gray-600 text-sm">Color: {`${pro.Color ? pro.Color : "No aplica"}`}</div>
                                                            <div className="text-gray-600 text-sm">Cantidad: {pro.Cantidad}</div>
                                                        </div>
                                                        <div className="text-gray-600 text-xs">Total: {formatCurrency(pro.Total)}</div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                            }
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}