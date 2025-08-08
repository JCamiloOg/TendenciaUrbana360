import AppSidebar from "@/components/Admin/SideBar/AppSideBar"
import Loader from "@/components/Loader";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePageLoader } from "@/hooks/useLoader";
import { changeStatusProduct, getExtraInfoForProduct, getProduct, getProducts, getSizesForProduct } from "@/services/admin/products";
import { textCapitalize } from "@/utils/formatText";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../Error";
import TableProducts from "@/components/Admin/products/tableProducts";
import { Separator } from "@/components/ui/separator";
import formatCurrency from "@/utils/formatCurrency";
import { faEllipsisVertical, faEye, faPenToSquare, faShoePrints, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownMenu, DropdownMenuShortcut, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import ModalAdd from "@/components/Admin/products/modals/modalAdd";
import ModalSizes from "@/components/Admin/products/modals/modalSizes";
import { SwalAlert, Toast } from "@/hooks/useToastAlert";
import ModalEdit from "@/components/Admin/products/modals/modalEdit";
import ModalViewMore from "@/components/Admin/products/modals/modalViewMore";
import { SelectsContext } from "@/context/selectsContext";


export default function Products() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [columns, setColumns] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [gender, setGender] = useState([]);
    const [types, setTypes] = useState([])
    const [filteredData, setFiltereData] = useState([]);
    const navigate = useNavigate();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenSizes, setIsOpenSizes] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenViewMore, setIsOpenViewMore] = useState(false);
    const [sizesForProduct, setSizesForProduct] = useState([]);
    const [product, setProduct] = useState(null);
    const [extraInfo, setExtraInfo] = useState([]);
    const [productIDSelected, setProductIDSelected] = useState(null);

    const fetchProducts = async () => {
        document.title = "Cargando..."
        startLoading();
        try {
            const res = await getProducts(category);
            setProducts(res.data.data);
            setFiltereData(res.data.data);
            setIsLogin(res.data.user);
            setSizes(res.data.sizes);
            setColors(res.data.colors);
            setGender(res.data.gender);
            setTypes(res.data.types);
        } catch (error) {
            if (error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            setTimeout(() => {
                stopLoading();
                document.title = textCapitalize(category);
            }, 500)
        }
    }

    const fetchSizes = async (id) => {
        try {
            const res = await getSizesForProduct(category, id);
            setSizesForProduct(res.data);
            setProductIDSelected(id);
            setIsOpenSizes(true);
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al obtener las tallas del producto.",
            })
        }
    }

    const fetchProduct = async (id) => {
        try {
            const res = await getProduct(id, category);
            if (res.status === 200) {
                setProduct(res.data[0]);
                setProductIDSelected(id);
                setIsOpenEdit(true);
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al obtener la información.",
                color: "white",
                background: "#353535"
            })
        }
    }

    const fetchExtraInfo = async (id) => {
        try {
            const res = await getExtraInfoForProduct(id, category);
            if (res.status === 200) {
                setExtraInfo(res.data);
                setProductIDSelected(id);
                setIsOpenViewMore(true);
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al obtener la información.",
                color: "white",
                background: "#353535"
            })

        }
    }

    const desactivateProduct = async (id, status) => {
        try {
            const formData = new URLSearchParams({ status: status });
            const res = await changeStatusProduct(id, formData, category);
            Toast.fire({
                icon: 'success',
                title: res.data.message,
                timer: 2000,
                color: "white",
                background: "#353535"
            })
            fetchProducts();
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al cambiar el estado del producto.",
                color: "white",
                background: "#353535"
            })

        }
    }



    const dynamicColumns = (data) => {
        if (!Array.isArray(data) || data.lenght === 0) return [];

        const dynamicColumns = Object.keys(data[0])
            .filter((key) => key !== "Tipo_Producto")
            .map((key) => {
                const isNumber = typeof data[0][key] === "number" && /(Precio|Total|Valor)/i.test(key);

                return {
                    name: key == "Id_producto" ? "#" : key,
                    selector: (row) => row[key],
                    cell: (row) => {
                        const value = row[key];

                        if (key === "Estado") return <Badge type={value === "Activado" ? "success" : "danger"}>{value}</Badge>

                        if (isNumber) return formatCurrency(value);
                        return value;
                    },
                    sortable: true,
                }
            })
        dynamicColumns.push({
            name: "",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button className={"bg-transparent hover:bg-[#4a4a4a] cursor-pointer text-2xl"}><FontAwesomeIcon icon={faEllipsisVertical} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-4 z-10 rounded-2xl bg-[#353535] text-white border-none" align="start">
                        <DropdownMenuLabel className="font-semibold">Opciones</DropdownMenuLabel>
                        {
                            category == "calzado" || category == "camisas" || category == "pantalones" ?
                                <>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => fetchSizes(row.Id_producto)} className={`hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex`}>
                                            Ver tallas
                                            <DropdownMenuShortcut><FontAwesomeIcon icon={faShoePrints} /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </>
                                :
                                <></>
                        }
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => fetchExtraInfo(row.Id_producto)} className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex">
                                Ver más
                                <DropdownMenuShortcut><FontAwesomeIcon icon={faEye} /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuLabel className="font-semibold">Acciones</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => fetchProduct(row.Id_producto)} className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex">
                                Editar
                                <DropdownMenuShortcut><FontAwesomeIcon icon={faPenToSquare} /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(() => confirmChangeStatus(row.Id_producto, row.Estado == "Activado" ? "Desactivado" : "Activado"))} className="hover:!bg-[#4a4a4a] !text-white p-2 rounded-md cursor-pointer transition-all duration-300 flex">
                                {row.Estado === "Activado" ? "Desactivar" : "Activar"}
                                <DropdownMenuShortcut><FontAwesomeIcon icon={row.Estado === "Activado" ? faToggleOff : faToggleOn} /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            width: "90px"
        })

        return dynamicColumns;
    }

    const confirmChangeStatus = (id, status) => {
        SwalAlert.fire({
            title: '¿Estás seguro?',
            text: "El estado del producto será cambiado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar",
            background: "#353535",
            color: "white",
        }).then((result) => {
            if (result.isConfirmed) desactivateProduct(id, status);
        })
    }

    useEffect(() => {
        if (search.length > 0) {
            const dataFiltered = products.filter((item) => {
                return Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase());
            })
            setFiltereData(dataFiltered);
        } else {
            setFiltereData(products);
        }
    }, [search])

    useEffect(() => {
        document.documentElement.style.backgrto = "bg-[#212121]"
        fetchProducts();
        setSearch("");
    }, [category])

    useEffect(() => {
        if (products.length === 0) return;
        setColumns(dynamicColumns(products))
    }, [products])


    if (error) return <Error status={error.status} error={error.message} />

    return (
        <>
            <Loader isVisible={loading} bg="bg-[#212121]" />
            <SidebarProvider >
                <AppSidebar active={"Products"} subActive={category} user={isLogin} />
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
                        <button className={`bg-blue-600 hover:bg-blue-900 cursor-pointer rounded-md p-2`} onClick={(() => setIsOpenCreate(true))}>Añadir Producto</button>
                        <TableProducts columns={columns} data={filteredData} title={textCapitalize(category)} search={search} setSearch={setSearch} length={products.length} />
                    </div>
                    <ModalAdd category={category} isOpen={isOpenCreate} setIsOpen={setIsOpenCreate} colors={colors} sizes={sizes} types={types} genres={gender} fetch={fetchProducts} />

                    <ModalSizes category={category} fetchSizes={fetchSizes} isOpen={isOpenSizes} sizesInput={sizes} setIsOpen={setIsOpenSizes} sizes={sizesForProduct} id={productIDSelected} />

                    <ModalEdit isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} category={category} product={product} id={productIDSelected} fetch={fetchProducts} />
                    <SelectsContext.Provider value={{ colors, types, gender, fetchExtraInfo, category, productIDSelected }}>
                        <ModalViewMore isOpen={isOpenViewMore} setIsOpen={setIsOpenViewMore} products={extraInfo} category={category} />
                    </SelectsContext.Provider>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}