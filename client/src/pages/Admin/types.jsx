import AppSidebar from "@/components/Admin/SideBar/AppSideBar";
import Loader from "@/components/Loader"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePageLoader } from "@/hooks/useLoader"
import { Toast } from "@/hooks/useToastAlert";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../Error";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DataTable from "react-data-table-component";
import { customStyles, traslate } from "@/utils/tableAdmin";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import Select from "@/components/Inputs/Select";
import InputFieldModal from "@/components/Admin/products/modals/input/inputForModals";
import { createType, getTypes } from "@/services/admin/types";

export default function Types() {
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [isLogin, setIsLogin] = useState(false);
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (search.length > 0) {
            const dataFiltered = types.filter((item) => {
                return Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase());
            })
            setFilteredTypes(dataFiltered);
        } else {
            setFilteredTypes(types);
        }
    }, [search])

    const columns = [
        {
            name: "#",
            selector: (row) => row.ID,
            sortable: true,
        },
        {
            name: "Tipo",
            selector: (row) => row.Tipo,
            sortable: true,
        },
        {
            name: "Tipo de Producto",
            selector: (row) => row.Tipo_producto,
            sortable: true,
        },
    ]

    const selectData = [
        {
            Tipo: "Calzado",
            value: "Calzado"
        },
        {
            Tipo: "Camisas",
            value: "Camisas"
        },
        {
            Tipo: "Pantalones",
            value: "Pantalones"
        },
        {
            Tipo: "Gorras",
            value: "Gorras"
        },
        {
            Tipo: "Gafas",
            value: "Gafas"
        },
        {
            Tipo: "Relojes",
            value: "Relojes"
        },
        {
            Tipo: "Perfumes",
            value: "Perfumes"
        },
        {
            Tipo: "Vapeador",
            value: "Vapeador"
        },
    ]

    const fetchTypes = async () => {
        document.title = "Cargando..."
        startLoading();
        try {
            const res = await getTypes();
            setTypes(res.data.types);
            setIsLogin(res.data.user);
            setFilteredTypes(res.data.types);
            document.title = "Tipos"
        } catch (error) {
            if (error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }

    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            const formData = new FormData();
            formData.append("tipoProducto", data.tipoProducto);
            formData.append("tipo", data.tipo);

            const res = await createType(data);
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 2000,
                    color: "white",
                    background: "#353535"
                })
                reset();
                fetchTypes();
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al agregar la talla.",
                color: "white",
                background: "#353535"
            })
        } finally {
            setTimeout(() => setDisabled(false), 500);
        }
    }

    useEffect(() => {
        fetchTypes();
    }, [])

    if (error) return <Error status={error.status} error={error.message} />

    return (
        <>
            <Loader isVisible={loading} bg="bg-[#212121]" />
            <SidebarProvider>
                <AppSidebar active={"Types"} user={isLogin} />
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
                        <Button className={"bg-blue-600 hover:bg-blue-900 cursor-pointer rounded-md p-2"} onClick={() => setIsOpen(true)} >Añadir Tipo</Button>
                        <DataTable
                            title={<h1 className="text-4xl my-4 text-center font-bold">Tipos</h1>}
                            columns={columns}
                            data={filteredTypes}
                            pagination
                            responsive
                            customStyles={customStyles}
                            subHeader
                            subHeaderComponent={
                                types.length > 0 && (
                                    <div className="relative">
                                        <input
                                            placeholder="Buscar Tipo..."
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
                                )
                            }
                            paginationComponentOptions={traslate}
                            noDataComponent={search.length > 0 ? "No hay resultados con tu búsqueda" : "No hay datos para mostrar"}
                        />
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200`}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <DialogHeader>
                                        <DialogTitle>Agregar Tipo</DialogTitle>
                                        <DialogDescription>Verifica bien el tipo.</DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-5">
                                        <Controller
                                            name="tipoProducto"
                                            control={control}
                                            rules={{ required: "Elige el tipo de producto" }}
                                            render={({ field }) => (
                                                <Select data={selectData} labelKey="Tipo" valueKey="value" error={errors.tipoProducto?.message} onChange={(value) => field.onChange(value)} />
                                            )}
                                        />
                                        <div className="mt-10">
                                            <InputFieldModal type="text" error={errors.tipo?.message} label={"Tipo"} {...register("tipo", {
                                                required: "El tipo es requerido",
                                                maxLength: {
                                                    value: 10,
                                                    message: "El tipo no puede tener más de 10 caracteres"
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: "El tipo no puede tener menos de 2 caracteres"
                                                }
                                            })} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" className="bg-gray-500 hover:bg-gray-600 cursor-pointer">Cancelar</Button>
                                        </DialogClose>
                                        <Button disabled={disabled || Object.keys(errors).length > 0} type="submit" className="bg-blue-600 hover:bg-blue-900 cursor-pointer">Guardar</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}