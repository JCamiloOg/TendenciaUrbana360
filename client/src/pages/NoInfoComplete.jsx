import InputField from "../components/Inputs/Input";
import NavbarEmpty from "../components/NavBars/NavBarEmpty";
import { useForm } from "react-hook-form";
import "../style/button.css";
import { Toast } from "../hooks/useToastAlert";
import { faPhone, faHouse, faUser } from "@fortawesome/free-solid-svg-icons"
import { completeInfo } from "../services/users/usersServices";
import { useState } from "react";


export default function NoInfoComplete() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [disabled, setDisabled] = useState(null);


    const onSubmit = async (data) => {
        try {
            setDisabled(true);
            const response = await completeInfo(data);
            if (response.status === 200) {
                Toast.fire({
                    icon: "success",
                    text: response.data.message,
                    timer: 3000,
                }).then(() => window.location.reload());
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                text: error.response?.data?.message || "Error inesperado",
                timer: 3000
            })
        } finally {
            setTimeout(() => setDisabled(false), 3000);
        }
    }

    return (
        <>

            <NavbarEmpty />
            <div className="container mx-auto px-10  pt-28">
                <div className="p-8 rounded border border-black mt-20 bg-white shadow-2xl shadow-gray-600 ">
                    <h1 className="font-medium text-3xl ">Completa la información restante</h1>
                    <p className="text-gray-600 mt-6">Completa la información restante para continuar...</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-8 space-y-6">
                            <div className="mb-10">
                                <InputField icon={faUser} isError={errors.nombre ? true : false} label={"Nombre"} type={"text"} {...register("nombre", {
                                    required: true,
                                    maxLength: 50,
                                    minLength: 4
                                })} />
                            </div>
                            <div className="mb-10">
                                <InputField isError={errors.apellido ? true : false} icon={faUser} label={"Apellido"} type={"text"} {...register("apellido", {
                                    required: true,
                                    maxLength: 50,
                                    minLength: 4
                                })} />
                            </div>
                            <div className="mb-10">
                                <InputField isError={errors.direccion ? true : false} icon={faHouse} label={"Dirección"} type={"text"} {...register("direccion", {
                                    maxLength: 100,
                                    required: true,
                                    minLength: 5
                                })} />
                            </div>
                            <div className="mb-10">
                                <InputField isError={errors.telefono ? true : false} icon={faPhone} label={"Teléfono móvil"} type={"number"} {...register("telefono", {
                                    required: true,
                                    maxLength: 10,
                                    minLength: 10
                                })} />
                            </div>
                        </div>
                        <div className="space-x-4 mt-8">
                            <button disabled={disabled || Object.keys(errors).length > 0 ? true : false} type="submit" className="btn-blank" style={{ "--color": "#006af9", "--letterColor": "black" }} > Guardar información</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}