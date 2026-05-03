import Select from "@/components/Inputs/Select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelects } from "@/context/selectsContext";
import { Toast } from "@/hooks/useToastAlert";
import { updateImage, updateModel } from "@/services/admin/products";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputFile from "./input/inputFile";
import InputFieldModal from "./input/inputForModals";

export default function ModalEditExtra({ isOpen, setIsOpen, info, id }) {
    const [disabledEdit, setDisabledEdit] = useState(false);
    const [disabledImage, setDisabledImage] = useState(false);
    const formEdit = useForm();
    const formImage = useForm();
    const { colors, types, gender, category, fetchExtraInfo, productIDSelected } = useSelects();

    const onSubmitEdit = async (data) => {
        setDisabledEdit(true);
        try {
            data.id = id
            const res = await updateModel(id, category, data);
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 2000,
                    color: "white",
                    background: "#353535"
                })
                setIsOpen(false);
                fetchExtraInfo(productIDSelected);
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al editar la información.",
                color: "white",
                background: "#353535"
            })
        } finally {
            setTimeout(() => setDisabledEdit(false), 500);
        }
    }

    const onSubmitImage = async (data) => {
        setDisabledImage(true);
        try {
            const formData = new FormData();
            formData.append("imagen", data.imagen[0]);
            formData.append("id", id);
            const res = await updateImage(formData, category);
            if (res.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message,
                    timer: 2000,
                    color: "white",
                    background: "#353535"
                })
                setIsOpen(false);
                fetchExtraInfo(productIDSelected);
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error desconocido al editar la imagen.",
                color: "white",
                background: "#353535"
            })
        } finally {
            setTimeout(() => setDisabledImage(false), 500);
        }
    }

    useEffect(() => {
        if (!isOpen) {
            formEdit.reset();
            formImage.reset();
        }
    }, [isOpen])
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200`}>
                <DialogHeader>
                    <DialogTitle>Editar información adicional del producto</DialogTitle>
                    <DialogDescription>Verifica que todos los datos sean correctos y la imágen sea correcta</DialogDescription>
                </DialogHeader>
                <div className="">
                    <form onSubmit={formEdit.handleSubmit(onSubmitEdit)}>
                        {
                            category !== "perfumes" && (
                                <Controller
                                    name="color"
                                    control={formEdit.control}
                                    rules={{ required: "Elige un Color" }}
                                    render={({ field }) => (
                                        <>
                                            <h3 className="font-semibold my-4">Color</h3>
                                            <Select
                                                data={colors}
                                                error={formEdit.formState.errors.color?.message}
                                                labelKey="Color"
                                                valueKey="ID"
                                                onChange={(value) => field.onChange(value)}
                                                defaultValue={info.Color.toString()}
                                            />
                                        </>
                                    )}
                                />
                            )
                        }
                        <Controller
                            name="tipo"
                            control={formEdit.control}
                            rules={{ required: "Elige un Tipo" }}
                            render={({ field }) => (
                                <>
                                    <h3 className="font-semibold my-4">Tipo</h3>
                                    <Select
                                        data={types}
                                        error={formEdit.formState.errors.tipo?.message}
                                        labelKey="Tipo"
                                        valueKey="ID"
                                        onChange={(value) => field.onChange(value)}
                                        defaultValue={info.Tipo.toString()}
                                    />
                                </>
                            )}
                        />
                        <Controller
                            name="sexo"
                            control={formEdit.control}
                            rules={{ required: "Elige un Género" }}
                            render={({ field }) => (
                                <>
                                    <h3 className="font-semibold my-4">Género</h3>
                                    <Select
                                        data={gender}
                                        error={formEdit.formState.errors.sexo?.message}
                                        labelKey="Sexo"
                                        valueKey="ID"
                                        onChange={(value) => field.onChange(value)}
                                        defaultValue={info.Sexo.toString()}
                                    />
                                </>
                            )}
                        />
                        {
                            info.Precio && (
                                <div className="mt-7">
                                    <InputFieldModal error={formEdit.formState.errors.precio?.message} label={"Precio"} type="number" defaultValue={info.Precio} {...formEdit.register("precio", {
                                        required: "Ingresa un precio",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "El precio debe ser un número"
                                        }
                                    })} />
                                </div>
                            )
                        }
                        <hr className="my-4" />
                        <Button type="submit" disabled={disabledEdit || Object.keys(formEdit.formState.errors).length > 0} className="bg-blue-700 hover:bg-blue-900 cursor-pointer">Editar</Button>
                    </form>
                    <form onSubmit={formImage.handleSubmit(onSubmitImage)}>
                        <hr className="my-4" />
                        <h3 className="font-semibold my-4">Imagen actual</h3>
                        <img src={info.Imagen} width={200} alt="" />
                        <InputFile error={formImage.formState.errors.imagen?.message} {...formImage.register("imagen", { required: "Selecciona una imagen" })} />
                        <hr className="my-4" />
                        <Button disabled={disabledImage || Object.keys(formImage.formState.errors).length > 0} type="submit" className="bg-blue-700 hover:bg-blue-900 cursor-pointer mt-4">Cambiar imagen</Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}