import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import InputFieldModal from "./input/inputForModals";
import Select from "@/components/Inputs/Select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import InputFile from "./input/inputFile";
import { Toast } from "@/hooks/useToastAlert";
import { addProducto } from "@/services/admin/products";
import TextArea from "./input/textArea";

export default function ModalAdd({ category, isOpen, setIsOpen, colors, sizes, types, genres, fetch }) {
    const [disabled, setDisabled] = useState(false)
    const { handleSubmit, register, formState: { errors }, control, reset } = useForm({
        defaultValues: {
            tallas: []
        }
    });

    const categoriesWithSizes = ["calzado", "camisas", "pantalones"];
    const categoriesWithColors = ["calzado", "camisas", "pantalones", "vapeadores", "gafas", "relojes", "gorras"];
    const categoriesWithDescriptions = ["vapeadores", "gafas", "relojes", "gorras", "perfumes"];


    const { fields, append, remove } = useFieldArray({
        control,
        name: "tallas"
    });

    const onSubmit = async (data) => {
        try {
            setDisabled(false);
            const formData = new FormData();

            for (const key in data) {
                if (key == "image") {
                    formData.append("image", data[key][0]);
                } else {
                    if (Array.isArray(data[key])) {
                        data[key].forEach(size => {
                            formData.append(`${key}[]`, size);
                        })
                        continue;
                    } else {
                        formData.append(key, data[key])
                    }
                }
            }
            const res = await addProducto(formData, category);
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 3000
                })
                setIsOpen(false);
                reset();
                fetch();
                append();
            }
        } catch (error) {
            setDisabled(true);
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al añadir el producto.",
                timer: 3000
            })
        } finally {
            setTimeout(() => setDisabled(false), 500)
        }
    }

    useEffect(() => {
        reset();
        append();
    }, [category])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Añadir producto</DialogTitle>
                        <DialogDescription>Verifica bien todos los todos los campos.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-12 mt-4 gap-5">
                        <div className="col-span-6">
                            <InputFieldModal label={"Nombre"} error={errors.nombre?.message} {...register("nombre", {
                                required: "El nombre es requerido",
                                maxLength: {
                                    value: 50,
                                    message: "El nombre debe tener como máximo 50 caracteres"
                                },
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe tener al menos 5 caracteres"
                                }
                            })} />
                        </div>
                        <div className="col-span-6">
                            <InputFieldModal label={"Precio"} type="number" error={errors.precio?.message} {...register("precio", {
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
                            })} />
                        </div>
                    </div>
                    {
                        categoriesWithDescriptions.includes(category) && (
                            <TextArea error={errors.descripcion?.message} label={"Descripción"} placeHolder={"Escribe la descripción"} {...register("descripcion", {
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
                    {
                        categoriesWithSizes.includes(category) && (
                            <>
                                <p className="font-semibold my-4">Tallas</p>
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
                                                        <Select data={sizes} error={errors.tallas?.[idx]?.message} labelKey="Talla" valueKey="ID" onChange={(value) => field.onChange(value)} />
                                                    </div>
                                                    {
                                                        idx !== 0 && (
                                                            <div className="col-span-5">
                                                                <Button type="button" onClick={() => remove(idx)} className="bg-red-500 hover:bg-red-900 cursor-pointer w-40" >Eliminar</Button>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )}
                                        />

                                    ))
                                }
                                <Button type="button" onClick={() => append()} className="bg-blue-700 hover:bg-blue-900 cursor-pointer w-40 mt-4">Agregar Talla</Button>
                            </>
                        )
                    }
                    {
                        categoriesWithColors.includes(category) && (
                            <>
                                <p className="font-semibold my-4">Color</p>
                                <Controller
                                    name="color"
                                    control={control}
                                    rules={{ required: "Seleccione un color" }}
                                    render={({ field }) => (
                                        <Select data={colors} error={errors.color?.message} onChange={(value) => field.onChange(value)} labelKey="Color" valueKey="ID" />
                                    )}
                                />
                            </>
                        )
                    }
                    <p className="font-semibold my-4">Tipo</p>
                    <Controller
                        name="tipo"
                        control={control}
                        rules={{ required: "Seleccione un tipo" }}
                        render={({ field }) => (
                            <Select data={types} error={errors.tipo?.message} onChange={(value) => field.onChange(value)} labelKey="Tipo" valueKey="ID" />
                        )}
                    />
                    <p className="font-semibold my-4">Género</p>
                    <Controller
                        name="sexo"
                        control={control}
                        rules={{ required: "Seleccione un género" }}
                        render={({ field }) => (
                            <Select data={genres} error={errors.sexo?.message} onChange={(value) => field.onChange(value)} labelKey="Sexo" valueKey="ID" />
                        )}
                    />

                    <InputFile error={errors.image?.message} {...register("image", {
                        required: "La imagen es requerida",
                        validate: {
                            validateFormat: (files) => files && files[0]?.type.startsWith("image/") || "Solo se permiten imágenes"
                        }
                    })} />
                    <DialogFooter className={"mt-4"}>
                        <DialogClose asChild>
                            <Button className="bg-gray-500 hover:bg-gray-600 cursor-pointer">Cancelar</Button>
                        </DialogClose>
                        <Button disabled={disabled || Object.keys(errors).length > 0} type="submit" className="bg-blue-700 hover:bg-blue-900 cursor-pointer">Añadir</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}