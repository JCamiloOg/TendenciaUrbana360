import { usePageLoader } from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Error from "../Error";
import { changeStatus, getDetailOrder, getOrders } from "@/services/admin/orders";
import Loader from "@/components/Loader";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Admin/SideBar/AppSideBar";
import { Separator } from "@/components/ui/separator";
import Badge from "@/components/ui/badge";
import formatCurrency from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import DataTable from "react-data-table-component";
import { customStyles, traslate } from "@/utils/tableAdmin";
import CopyButton from "@/components/Buttons/CopyButton";
import { faCheck, faEllipsisVertical, faEye, faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toast } from "@/hooks/useToastAlert";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DatePicker from "@/components/Inputs/DatePicker";
import ModalImage from "@/components/Modals/ModalImage";
import { formatDate } from "@/utils/formatDate";

export default function Orders() {
    const [isLogin, setIsLogin] = useState(false);
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [detailOrder, setDetailOrder] = useState([]);
    const [IDSelected, setIDSelected] = useState("");
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [image, setImage] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const fetchOrders = async () => {
        document.title = "Cargando..."
        startLoading();
        try {
            const res = await getOrders();
            setOrders(res.data.orders);
            setIsLogin(res.data.user);
            setFilteredData(res.data.orders);
            document.title = "Pedidos"
        } catch (error) {
            if (error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }

    const fetchDetailOrder = async (id) => {
        try {
            const res = await getDetailOrder(id);
            setDetailOrder(res.data);
            setIsOpen(true);
            setIDSelected(id);
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al obtener la información.",
                color: "white",
                background: "#353535"
            })
        }
    }

    const handleStatus = async (id, status) => {
        try {
            const formData = new URLSearchParams({ status: status })
            const res = await changeStatus(id, formData);
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 2000,
                    color: "white",
                    background: "#353535"
                })
                fetchOrders();
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al cambiar el estado del pedido.",
                color: "white",
                background: "#353535"
            })
        }
    }

    const handleImage = (img) => {
        setImage(img);
        setIsOpenImage(true);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const onSearchOrder = (date) => {
        if (!date) return setFilteredData(orders);

        const newDate = formatDate(date);
        const dataFiltered = orders.filter((item) => item.Fecha.includes(newDate));
        setFilteredData(dataFiltered);
        if (dataFiltered.length === 0) {
            Toast.fire({
                title: "No se encontrado pedidos del día " + newDate,
                icon: "info",
                timer: 3000
            })
        }
    }


    const columns = [
        {
            name: "#",
            selector: (row) => row.ID,
            cell: (row) => (
                <div className="flex gap-2">
                    <CopyButton textCopy={row.PedidoID} />
                    <p className="truncate w-20 2xl:w-50 xl:w-40 lg:w-30 md:w-20 sm:w-20">{row.PedidoID}</p>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Cliente",
            selector: (row) => row.Nombre + " " + row.Apellido,
            cell: (row) => (
                <Link
                    to={{ pathname: "/admin/clients", search: `id=${row.ClienteID}` }}
                    className="cursor-pointer underline text-blue-500 hover:text-blue-600">
                    {`${row.Nombre} ${row.Apellido}`}
                </Link>
            ),
            sortable: true,
        },
        {
            name: "Fecha",
            selector: (row) => row.Fecha,
            sortable: true,
        },
        {
            name: "Estado",
            selector: (row) => row.Estado,
            cell: (row) => {
                let type;
                switch (row.Estado.toLowerCase()) {
                    case "pendiente":
                        type = "warning"
                        break;
                    case "en proceso":
                        type = "info"
                        break;
                    case "cancelado":
                        type = "danger"
                        break;
                    case "completado":
                        type = "success"
                        break;
                }
                return <Badge type={type} >{row.Estado}</Badge>
            },
            sortable: true,
        },
        {
            name: "Total",
            selector: (row) => row.Total,
            cell: (row) => {
                return formatCurrency(row.Total)
            },
            sortable: true,
        },
        {
            name: "Acciones",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button className={"bg-transparent hover:bg-[#4a4a4a] cursor-pointer text-2xl"}><FontAwesomeIcon icon={faEllipsisVertical} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-4 z-10 rounded-2xl bg-[#353535] text-white border-none" align="start">
                        <DropdownMenuLabel className="font-semibold">Opciones</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => fetchDetailOrder(row.PedidoID)} className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex">
                                Ver más
                                <DropdownMenuShortcut><FontAwesomeIcon icon={faEye} /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        {
                            row.Estado !== "Completado" ?
                                <>
                                    <DropdownMenuLabel className="font-semibold">Acciones</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        {
                                            row.Estado === "Pendiente" ?
                                                <>
                                                    <DropdownMenuItem onClick={() => handleStatus(row.PedidoID, "En Proceso")} className={`hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex`}>
                                                        Aceptar
                                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faCheck} /></DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatus(row.PedidoID, "Cancelado")} className={`hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex`}>
                                                        Cancelar
                                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faXmark} /></DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                </>
                                                :
                                                <></>
                                        }
                                        {
                                            row.Estado === "En Proceso" ?
                                                <>
                                                    <DropdownMenuItem onClick={() => handleStatus(row.PedidoID, "Completado")} className={`hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex`}>
                                                        Finalizar
                                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faCheck} /></DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatus(row.PedidoID, "Cancelado")} className={`hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex`}>
                                                        Cancelar
                                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faXmark} /></DropdownMenuShortcut>
                                                    </DropdownMenuItem>

                                                </>
                                                :
                                                <></>
                                        }
                                        {
                                            row.Estado === "Cancelado" ?
                                                <>
                                                    <DropdownMenuItem onClick={() => handleStatus(row.PedidoID, "Pendiente")} className={`hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex`}>
                                                        Revertir
                                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faRotateRight} /></DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                </>
                                                :
                                                <></>
                                        }
                                    </DropdownMenuGroup>
                                </>
                                :
                                <>

                                </>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            width: "90px"
        }
    ]

    if (error) return <Error status={error.status} error={error.message} />

    return (
        <>
            <Loader isVisible={loading} bg="bg-[#212121]" />
            <SidebarProvider>
                <AppSidebar active={"Orders"} user={isLogin} />
                <SidebarInset className={`bg-[#212121] text-white`}>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                        </div>
                    </header>
                    <div className="container mx-auto px-10">
                        <DataTable
                            title={<h1 className="text-4xl my-4 text-center font-bold">Pedidos</h1>}
                            columns={columns}
                            data={filteredData}
                            subHeader
                            subHeaderComponent={
                                <DatePicker label={"Seleccione una fecha del pedido"} text={"Seleccione una fecha"} onChange={onSearchOrder} dark />
                            }
                            pagination
                            responsive
                            customStyles={customStyles}
                            paginationComponentOptions={traslate}
                            noDataComponent={"No se encontraron pedidos"}
                        />
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200 max-w-5/6 sm:max-w-[530px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1150px] 2xl:max-w-[1400px]`}>
                                <DialogHeader>
                                    <DialogTitle> Pedido # {IDSelected}</DialogTitle>
                                </DialogHeader>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className={`text-white`}>Producto</TableHead>
                                            <TableHead className={`text-white`}>Color</TableHead>
                                            <TableHead className={`text-white`}>Talla</TableHead>
                                            <TableHead className={`text-white`}>Imagen</TableHead>
                                            <TableHead className={`text-white`}>Cantidad</TableHead>
                                            <TableHead className={`text-white`}>Precio</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            detailOrder.map((row, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{row.Nombre}</TableCell>
                                                    <TableCell>{row.Color}</TableCell>
                                                    <TableCell>{row.Talla}</TableCell>
                                                    <TableCell><img onClick={() => handleImage(row.Imagen)} className="cursor-pointer" src={row.Imagen} width={100} alt={row.Nombre} /></TableCell>
                                                    <TableCell>{row.Cantidad}</TableCell>
                                                    <TableCell>{formatCurrency(row.Total)}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </DialogContent>
                        </Dialog>
                        <ModalImage image={image} isOpen={isOpenImage} updateVal={setIsOpenImage} />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>

    )
}