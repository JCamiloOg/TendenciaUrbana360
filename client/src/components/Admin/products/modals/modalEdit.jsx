import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import InputFieldModal from "./input/inputForModals";
import { useForm } from "react-hook-form";
import TextArea from "./input/textArea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Toast } from "@/hooks/useToastAlert";
import { updateProduct } from "@/services/admin/products";

export default function ModalEdit({ isOpen, setIsOpen, category, id, fetch, product }) {
    const [disabled, setDisabled] = useState(false)
    const categoriesWithDescriptions = ["vapeadores", "gafas", "relojes", "gorras", "perfumes"];

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            data.id = id;
            const res = await updateProduct(id, data, category);
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 3000,
                    color: "white",
                    background: "#353535"
                })
                setIsOpen(false);
                fetch();
                reset();
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al editar el producto.",
                timer: 3000,
                color: "white",
                background: "#353535"
            })
        } finally {
            setTimeout(() => setDisabled(false), 1000);
        }
    }
    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Editar Producto</DialogTitle>
                        <DialogDescription>Verifica bien todos los todos los campos.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-6">

                        <InputFieldModal label={"Nombre"} error={errors.nombre?.message} type="text" defaultValue={product?.Nombre || ""} {...register("nombre", {
                            required: "El nombre es requerido",
                            maxLength: {
                                value: 30,
                                message: "El nombre debe tener como máximo 50 caracteres"
                            },
                            minLength: {
                                value: 3,
                                message: "El nombre debe tener al menos 5 caracteres"
                            }
                        })}
                        />

                        <InputFieldModal label={"Precio"} error={errors.precio?.message} defaultValue={product?.Precio || ""} type="number" {...register("precio", {
                            required: "El precio es requerido",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "El precio debe ser un número"
                            },
                            maxLength: {
                                value: 10,
                                message: "El precio debe tener como máximo 10 caracteres"
                            },
                            minLength: {
                                value: 1,
                                message: "El precio debe tener al menos 1 caracter"
                            }
                        })}
                        />
                        {
                            categoriesWithDescriptions.includes(category) && (
                                <TextArea error={errors.descripcion?.message} defaultValue={product?.Descripcion || ""} label={"Descripción"} placeHolder={"Escribe la descripción"} {...register("descripcion", {
                                    required: "La descripción es requerida",
                                    maxLength: {
                                        value: 500,
                                        message: "La descripción debe tener como máximo 500 caracteres"
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "La descripción debe tener al menos 10 caracteres"
                                    }
                                })} />
                            )
                        }
                    </div>
                    <DialogFooter className={"mt-4"}>
                        <DialogClose asChild>
                            <Button type="button" className="bg-gray-500 hover:bg-gray-600 cursor-pointer">Cancelar</Button>
                        </DialogClose>
                        <Button disabled={disabled || Object.keys(errors).length > 0} type="submit" className="bg-blue-700 hover:bg-blue-900 cursor-pointer">Editar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    )
}