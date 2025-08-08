import Select from "@/components/Inputs/Select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelects } from "@/context/selectsContext";
import { useForm, Controller } from "react-hook-form";
import InputFile from "./input/inputFile";
import { Button } from "@/components/ui/button";
import { Toast } from "@/hooks/useToastAlert";
import { useState } from "react";
import { addModel } from "@/services/admin/products";

export default function ModalAddExtra({ isOpen, setIsOpen }) {
    const { register, handleSubmit, formState: { errors }, control } = useForm();
    const [disabled, setDisabled] = useState(false);
    const { colors, types, gender, category, fetchExtraInfo, productIDSelected } = useSelects();

    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            const formData = new FormData();

            for (const key in data) {
                if (key == "imagen") {
                    formData.append("imagen", data[key][0]);
                } else {
                    formData.append(key, data[key]);
                }
            }
            formData.append("id", productIDSelected);

            const res = await addModel(formData, category);
            if (res.status) {
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
                title: error.response?.data?.message || "Error desconocido al agregar el modelo.",
                color: "white",
                background: "#353535"
            })
        } finally {
            setTimeout(() => setDisabled(false), 500);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={`bg-[#353535] text-white border-none overflow-y-auto max-h-200`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Agregar modelo nuevo</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <Controller
                            name="color"
                            control={control}
                            rules={{ required: "Elige un Color" }}
                            render={({ field }) => (
                                <>
                                    <h3 className="font-semibold my-4">Color</h3>
                                    <Select
                                        data={colors}
                                        error={errors.color?.message}
                                        labelKey="Color"
                                        valueKey="ID"
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </>
                            )}
                        />
                        <Controller
                            name="tipo"
                            control={control}
                            rules={{ required: "Elige un Tipo" }}
                            render={({ field }) => (
                                <>
                                    <h3 className="font-semibold my-4">Tipo</h3>
                                    <Select
                                        data={types}
                                        error={errors.tipo?.message}
                                        labelKey="Tipo"
                                        valueKey="ID"
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </>
                            )}
                        />
                        <Controller
                            name="sexo"
                            control={control}
                            rules={{ required: "Elige un Género" }}
                            render={({ field }) => (
                                <>
                                    <h3 className="font-semibold my-4">Género</h3>
                                    <Select
                                        data={gender}
                                        error={errors.sexo?.message}
                                        labelKey="Sexo"
                                        valueKey="ID"
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </>
                            )}
                        />
                        <InputFile error={errors.imagen?.message} {...register("imagen", { required: "Selecciona una imagen" })} />
                    </div>
                    <DialogFooter className="mt-5">
                        <DialogClose>
                            <Button type="button" className="bg-gray-500 hover:bg-gray-700 cursor-pointer">Cancelar</Button>
                        </DialogClose>
                        <Button disabled={disabled || Object.keys(errors).length > 0} type="submit" className="bg-blue-600 hover:bg-blue-900 cursor-pointer">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )

}