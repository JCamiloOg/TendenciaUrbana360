import AppSidebar from "@/components/Admin/SideBar/AppSideBar";
import Loader from "@/components/Loader";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePageLoader } from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Error from "../Error";
import { getClients, updateRole, updateStatus } from "@/services/admin/clients";
import { Separator } from "@/components/ui/separator";
import Badge from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEllipsisVertical, faPenToSquare, faRotateRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { customStyles, traslate } from "@/utils/tableAdmin";
import { Toast } from "@/hooks/useToastAlert";

export default function Clients() {
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState(searchParams.get("id") || "");
    const [filteredClients, setFilteredClients] = useState([]);
    const navigate = useNavigate();
    const [info, setInfo] = useState(false);

    const columns = [
        {
            name: "Nombre",
            selector: (row) => row.Nombre,
            sortable: true,
            wrap: true
        },
        {
            name: "Apellido",
            selector: (row) => row.Apellido,
            sortable: true,
            wrap: true
        },
        {
            name: "Dirección",
            selector: (row) => row.Direccion,
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: "Telefono",
            selector: (row) => row.Telefono,
            sortable: true,
        },
        {
            name: "Correo",
            selector: (row) => row.Correo,
            sortable: true,
            wrap: true,
            width: "250px"
        },
        {
            name: "Estado",
            cell: (row) => {
                let type;
                switch (row.Estado.toLowerCase()) {
                    case "pendiente":
                        type = "warning"
                        break;
                    case "rechazado":
                        type = "danger"
                        break;
                    case "aceptado":
                        type = "success"
                        break;
                    default:
                        type = "";
                        break;
                }

                return <Badge type={type} >{row.Estado}</Badge>
            },
            width: "200px"
        },
        {
            name: "Rol",
            cell: (row) => (
                <Badge type={row.Rol === "Usuario" ? "success" : "info"}>{row.Rol}</Badge>
            ),
            width: "200px"
        },
        {
            name: "Acciones",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button className={"bg-transparent hover:bg-[#4a4a4a] cursor-pointer text-2xl"}><FontAwesomeIcon icon={faEllipsisVertical} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-4 z-10 rounded-2xl bg-[#353535] text-white border-none">
                        <DropdownMenuLabel className="font-semibold">Acciones</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex">
                                Editar
                                <DropdownMenuShortcut><FontAwesomeIcon icon={faPenToSquare} /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                            {
                                row.Rol === "Usuario" ?
                                    <DropdownMenuItem className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex" onClick={() => handleRole(row.ID, "Administrador")}>
                                        Cambiar a Admin
                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faRotateRight} /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    :
                                    <DropdownMenuItem className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex" onClick={() => handleRole(row.ID, "Usuario")}>
                                        Cambiar a Usuario
                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faRotateRight} /></DropdownMenuShortcut>
                                    </DropdownMenuItem>

                            }
                            {
                                row.Estado === "Pendiente" && (
                                    <>
                                        <DropdownMenuItem className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex" onClick={() => handleStatus(row.ID, "Aceptado")}>
                                            Aceptar
                                            <DropdownMenuShortcut><FontAwesomeIcon icon={faCheck} /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex" onClick={() => handleStatus(row.ID, "Rechazado")}>
                                            Rechazar
                                            <DropdownMenuShortcut><FontAwesomeIcon icon={faXmark} /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </>
                                )
                            }
                            {
                                (row.Estado === "Rechazado" || row.Estado === "Desactivado") && (
                                    <DropdownMenuItem className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex" onClick={() => handleStatus(row.ID, "Aceptado")}>
                                        Activar
                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faCheck} /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )
                            }
                            {
                                row.Estado === "Aceptado" && (
                                    <DropdownMenuItem className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex" onClick={() => handleStatus(row.ID, "Desactivado")}>
                                        Desactivar
                                        <DropdownMenuShortcut><FontAwesomeIcon icon={faXmark} /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            width: "90px"
        }
    ]

    const fetchClients = async () => {
        document.title = "Cargando..."
        startLoading();
        try {
            const res = await getClients();
            console.log(res);
            setClients(res.data.clients);
            setInfo(res.data.user);
            setFilteredClients(res.data.clients.filter((item) => item.ID.toLowerCase().includes(search.toLowerCase())));
            document.title = "Clientes"
        } catch (error) {
            if (error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }

    const handleRole = async (id, role) => {
        try {
            const formData = new URLSearchParams({ rol: role })
            const res = await updateRole(id, formData);
            Toast.fire({
                icon: 'success',
                title: res.data.message,
                timer: 2000,
                color: "white",
                background: "#353535"
            })
            fetchClients();
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al cambiar el rol.",
                color: "white",
                background: "#353535"
            })
        }
    }

    const handleStatus = async (id, status) => {
        try {
            const formData = new URLSearchParams({ status: status })
            const res = await updateStatus(id, formData);
            Toast.fire({
                icon: 'success',
                title: res.data.message,
                timer: 2000,
                color: "white",
                background: "#353535"
            })
            fetchClients();
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al cambiar el rol.",
                color: "white",
                background: "#353535"
            })
        }
    }

    useEffect(() => {
        fetchClients();
    }, [])

    useEffect(() => {
        const searchData = clients.filter((item) =>
            item.Nombre.toLowerCase().includes(search.toLowerCase()) ||
            item.Apellido.toLowerCase().toLowerCase().includes(search.toLowerCase()) ||
            item.ID.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredClients(searchData);
    }, [search])

    if (error) return <Error status={error.status} error={error.message} />

    return (
        <>
            <Loader isVisible={loading} bg="bg-[#212121]" />
            <SidebarProvider>
                <AppSidebar active={"Clients"} user={info} />
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
                            title={<h1 className="text-4xl my-4 text-center font-bold">Clientes</h1>}
                            columns={columns}
                            data={filteredClients}
                            pagination
                            responsive
                            customStyles={customStyles}
                            subHeader
                            subHeaderComponent={
                                <div className="relative">
                                    <input
                                        placeholder="Buscar Cliente..."
                                        className="input shadow-lg border-2 border-transparent focus:border-2 focus:border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
                                        value={search}
                                        name="search"
                                        type="text"
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <svg
                                        className="size-6 absolute top-3 right-3 text-gray-500"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                        ></path>
                                    </svg>
                                </div>
                            }
                            paginationComponentOptions={traslate}
                            noDataComponent={search.length > 0 ? "No se encontraron clientes con tu busqueda" : "No hay clientes para mostrar"}
                        />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}