import Footer from "@/components/Footer";
import InputField from "@/components/Inputs/Input";
import Loader from "@/components/Loader";
import NavbarEmpty from "@/components/NavBars/NavBarEmpty";
import { Button } from "@/components/ui/button";
import { usePageLoader } from "@/hooks/useLoader";
import { Toast } from "@/hooks/useToastAlert";
import { sendEmailPassword } from "@/services/users/usersServices";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const { loading, startLoading, stopLoading } = usePageLoader();
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        startLoading();
        document.title = "Recuperar contraseña";
        setTimeout(() => stopLoading(), 1000);
    }, []);
    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            const res = await sendEmailPassword(data);
            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    text: res.data.message,
                    timer: 3000,
                }).then(() => navigate("/"));
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                text: error.response?.data?.message || "Error inesperado",
                timer: 3000
            });
            setTimeout(() => setDisabled(false), 1000);
        }
    }
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Loader isVisible={loading} />
                <NavbarEmpty />
                <div className="container mx-auto px-10 pt-24 flex-grow">
                    <h1 className="text-center text-5xl font-bold">Recuperar contraseña</h1>
                    <p className="text-gray-400 mt-5">Por favor ingresa el correo electrónico asociado a tu cuenta.</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputField type={"email"} label={"Correo electrónico"} icon={faEnvelope} error={errors.email?.message} {...register("email", {
                            required: "El correo es requerido",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "El correo es invalido"
                            },
                            maxLength: {
                                value: 50,
                                message: "El correo no puede superar los 50 caracteres"
                            },
                            minLength: {
                                value: 4,
                                message: "El correo debe tener al menos 4 caracteres"
                            }
                        })} />
                        <div className="flex gap-4">
                            <Button disabled={disabled || Object.keys(errors).length > 0} type="submit" className={`bg-blue-600 hover:bg-blue-900 cursor-pointer`}>Enviar Correo de recuperación</Button>
                            <Button type="button" onClick={() => navigate(-1)} className={`bg-gray-600 hover:bg-gray-900 cursor-pointer`}>Volver</Button>
                        </div>
                    </form>
                </div>
                <Footer />
            </div>
        </>
    )
}