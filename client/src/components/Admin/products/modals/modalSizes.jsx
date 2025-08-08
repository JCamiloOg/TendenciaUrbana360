import Select from "@/components/Inputs/Select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toast } from "@/hooks/useToastAlert";
import { createSizeForProduct, deleteSizeForProduct } from "@/services/admin/products";
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

export default function ModalSizes({ category, isOpen, setIsOpen, sizes, sizesInput, fetchSizes, id }) {
    const [disabled, setDisabled] = useState(false)
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            tallas: []
        }
    });
    const { append, remove, fields } = useFieldArray({
        control,
        name: "tallas"
    });

    useEffect(() => {
        remove()
    }, [isOpen]);

    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            data.id = id;
            console.log(data)

            const res = await createSizeForProduct(data, category)
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 3000,
                    background: "#353535",
                    color: "white"
                })
                fetchSizes(id);
                remove();
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al añadir las tallas del producto.",
                timer: 3000
            })
        } finally {
            setTimeout(() => setDisabled(false), 500)
        }
    }

    const deleteSize = async (id) => {
        try {
            const res = await deleteSizeForProduct(id, category)
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 3000,
                    background: "#353535",
                    color: "white"
                })
                fetchSizes(res.data.id);
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error.response?.data?.message || "Error desconocido al eliminar la talla del producto.",
                timer: 3000,
            })
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader >
                        <DialogTitle className={`text-2xl font-bold`}>Tallas disponibles del producto</DialogTitle>
                    </DialogHeader>
                    <div className="mt-5">
                        <ul className="list-disc list-inside">
                            {
                                sizes.map(({ Talla, ID }, idx) => (
                                    <li className="mb-4" key={idx}>
                                        {Talla}
                                        {
                                            sizes.length > 1 && (
                                                <Button onClick={() => deleteSize(ID)} type="button" className="ml-4 bg-red-500 hover:bg-red-900 cursor-pointer">Eliminar</Button>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                        <h3 className="text-2xl font-semibold mt-4">
                            Añadir Tallas
                        </h3>
                        {
                            fields.map((field, idx) => (
                                <Controller
                                    key={field.id}
                                    name={`tallas.${idx}`}
                                    control={control}
                                    rules={{ required: "Seleccione una talla" }}
                                    render={({ field }) => (
                                        <div className="grid grid-cols-12 mt-4 gap-5" >
                                            <div className="col-span-7">
                                                <Select data={sizesInput} error={errors.tallas?.[idx]?.message} labelKey="Talla" valueKey="ID" onChange={(value) => field.onChange(value)} />
                                            </div>
                                            <div className="col-span-5">
                                                <Button type="button" onClick={() => remove(idx)} className="bg-red-500 hover:bg-red-900 cursor-pointer w-40" >Eliminar</Button>
                                            </div>
                                        </div>
                                    )}
                                />
                            ))
                        }
                        <Button type="button" onClick={() => append()} className="bg-blue-700 hover:bg-blue-900 cursor-pointer mt-4">Agregar Talla</Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="bg-gray-500 hover:bg-gray-600 cursor-pointer">Salir</Button>
                        </DialogClose>
                        <Button disabled={Object.keys(errors).length > 0 || fields.length == 0 || disabled} type="submit" className="bg-blue-700 hover:bg-blue-900 cursor-pointer">Guardar Tallas</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}