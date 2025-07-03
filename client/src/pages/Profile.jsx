// Modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalRegister from "../components/Modals/ModalRegister";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { faUser, faLocationDot, faLock, faBoxesPacking, faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
import { IMG_URL } from "@/config";
import formatCurrency from "@/utils/formatCurrency";
import useIsMobile from "@/hooks/useIsMobile";

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

    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const columns = useDynamicColumns(orders);

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
            }
        } catch (error) {
            if (error.status === 400) {
                if (typeof error.response.data.redirect === "undefined" || error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");

                setInfo(true);
                return;
            }
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            stopLoading();
        }
    }

    const viewMore = async (id) => {
        try {
            const res = await getOrderByID(id);

            if (res.status === 200) {
                console.log(res);
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
            setTimeout(() => {
                setDetailOrders([]);
                setIdOrder(null);
            }, 1000);
        }
    }, [isOpen]);

    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />


    return (
        <>
            <Loader isVisible={loading} />
            <NavBar isLogin={isLogin} active={"Profile"} />

            <div className={`container mx-auto px-10 pt-28`}>
                <div className="p-3 border border-gray-300 rounded-sm bg-white  shadow-2xs mb-12">
                    <div className="flex flex-wrap gap-4" >
                        <div className=" ml-2.5 text-[28px] border-1 border-solid rounded-full flex items-center justify-center max-h-[80px] max-w-[80px] min-h-[80px] min-w-[80px]">{letters}</div>
                        <div className="flex flex-col">
                            <h2 className="mt-2 text-3xl font-semibold">{`${infoUser.Nombre} ${infoUser.Apellido}`}</h2>
                            <p>{infoUser.Correo}</p>
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
                            <div className="w-full p-7 bg-white rounded-sm border border-gray-300 mb-12">
                                <h2 className="text-lg font-bold mb-2">Correo Electrónico</h2>
                                <p className="text-gray-400 text-lg mb-5">{infoUser.Correo}</p>
                                <button className="btn-blank" style={{ "--color": "#007bff", "--letterColor": "black" }}>Modificar</button>
                            </div>
                            <div className="w-full p-7 bg-white rounded-sm border border-gray-300">
                                <h2 className="text-lg font-bold mb-2">Teléfono</h2>
                                <p className="text-gray-400 text-lg mb-5">{infoUser.Telefono}</p>
                                <button className="btn-blank" style={{ "--color": "#007bff", "--letterColor": "black" }}>Modificar</button>
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
                                <button className="btn-blank" style={{ "--color": "#007bff", "--letterColor": "black" }}>Modificar</button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
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
                                <button className="btn-blank" style={{ "--color": "#007bff", "--letterColor": "black" }}>Modificar</button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
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
                                    orders.length > 0 ?
                                        <TableDynamic columns={columns} title={`Listado de pedidos`} data={orders} viewMore={viewMore} />
                                        :
                                        <h1 className="text-3xl font-bold text-center">No hay pedidos para mostrar</h1>
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <Footer />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className={`max-w-5/6 sm:max-w-[530px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1150px] 2xl:max-w-[1400px]`}>
                    <DialogHeader>
                        <DialogTitle className={`text-left`}>Detalles del pedido</DialogTitle>
                        <DialogDescription className={`text-left ${isMobile ? "break-words whitespace-normal w-100" : ""}`}>{idOrder}</DialogDescription>
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
                                                    <TableCell><img width={150} src={`${IMG_URL}${pro.Imagen}`} alt={pro.Nombre} /></TableCell>
                                                    <TableCell>{formatCurrency(pro.Total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    :
                                    <ul class="flex flex-col p-4">
                                        {
                                            detailOrders.map((pro, index) => (
                                                <li class="border-gray-400 flex flex-row mb-2 text-left" key={index}>
                                                    <div class="select-none cursor-pointer bg-gray-200 rounded-md flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                                                        <div class="flex flex-col rounded-md w-10 h-10 bg-gray-300 justify-center items-center mr-4"><img src={`${IMG_URL}${pro.Imagen}`} alt={pro.Nombre} /></div>
                                                        <div class="flex-1 pl-1 mr-16">
                                                            <div class="font-medium">{pro.Nombre}</div>
                                                            <div class="text-gray-600 text-sm">Talla: {`${pro.Talla ? pro.Talla : "No aplica"}`}</div>
                                                            <div class="text-gray-600 text-sm">Color: {`${pro.Color ? pro.Color : "No aplica"}`}</div>
                                                            <div class="text-gray-600 text-sm">Cantidad: {pro.Cantidad}</div>
                                                        </div>
                                                        <div class="text-gray-600 text-xs">Total: {formatCurrency(pro.Total)}</div>
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