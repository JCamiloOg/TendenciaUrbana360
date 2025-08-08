import ModalImage from "@/components/Modals/ModalImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IMG_URL } from "@/config";
import { useState } from "react";
import ModalEditExtra from "./modalEditExtra";
import { Toast } from "@/hooks/useToastAlert";
import { getExtraInfoForModel } from "@/services/admin/products";
import formatCurrency from "@/utils/formatCurrency";
import { DialogDescription } from "@radix-ui/react-dialog";
import ModalAddExtra from "./modalAddExtra";

export default function ModalViewMore({ isOpen, setIsOpen, products = [], category }) {
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [image, setImage] = useState("");
    const [info, setInfo] = useState([]);
    const [IDSelected, setIDSelected] = useState(null);


    const openImage = (img) => {
        setImage(img);
        setIsOpenImage(true);
    }

    const fetchInfo = async (id) => {
        try {
            const res = await getExtraInfoForModel(id, category);
            if (res.status === 200) {
                setInfo(res.data[0]);
                setIDSelected(id);
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
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200 max-w-5/6 sm:max-w-[530px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1150px] 2xl:max-w-[1400px]`}>
                    <DialogHeader>
                        <DialogTitle>Información extra del producto</DialogTitle>
                        <DialogDescription>
                            <Button onClick={() => setIsOpenAdd(true)} className="bg-blue-600 hover:bg-blue-900 cursor-pointer mt-4">Agregar</Button>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6">
                        <Table className="min-w-[600px]">
                            <TableCaption className="text-white/70">Listado de los atributos del producto</TableCaption>
                            <TableHeader>
                                <TableRow className="hover:bg-[#4a4a4a]">
                                    <TableHead className="text-white">#</TableHead>
                                    <TableHead className="text-white">Nombre</TableHead>
                                    <TableHead className="text-white">Genéro</TableHead>
                                    <TableHead className="text-white">Tipo</TableHead>
                                    {
                                        category === "perfumes" ?
                                            <TableHead className="text-white">Precio</TableHead>
                                            :
                                            <TableHead className="text-white">Color</TableHead>
                                    }
                                    <TableHead className="text-white">Imagen</TableHead>
                                    <TableHead className="text-white">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    products.map((product, idx) => (
                                        <TableRow key={idx} className={`hover:bg-[#4a4a4a]`}>
                                            <TableCell>{product.ID}</TableCell>
                                            <TableCell>{product.Nombre}</TableCell>
                                            <TableCell>{product.Sexo}</TableCell>
                                            <TableCell>{product.Tipo}</TableCell>
                                            {
                                                category === "perfumes" ?
                                                    <TableCell>{product.Precio ? formatCurrency(product.Precio) : "No Aplica"}</TableCell>
                                                    :
                                                    <TableCell>{product.Color}</TableCell>
                                            }
                                            <TableCell><img onClick={() => openImage(IMG_URL + product.Imagen)} src={IMG_URL + product.Imagen} width={100} alt={product.Nombre} className="cursor-pointer" /></TableCell>
                                            <TableCell><Button onClick={() => fetchInfo(product.ID)} className="bg-blue-600 hover:bg-blue-900 cursor-pointer">Editar</Button></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
            <ModalImage isOpen={isOpenImage} updateVal={setIsOpenImage} image={image} />
            <ModalEditExtra isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} info={info} id={IDSelected} category={category} />
            <ModalAddExtra isOpen={isOpenAdd} setIsOpen={setIsOpenAdd} />
        </>
    )
}