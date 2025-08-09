import Loader from "@/components/Loader";
import NavbarEmpty from "@/components/NavBars/NavBarEmpty";
import { usePageLoader } from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Error from "./Error";
import { resetPassword, verifyTokenPassword } from "@/services/users/usersServices";
import InputField from "@/components/Inputs/Input";
import { useForm } from "react-hook-form";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Toast } from "@/hooks/useToastAlert";

export default function ResetPassword() {
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("code");
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const verifyToken = async () => {
        startLoading();
        try {
            await verifyTokenPassword(token);
        } catch (error) {
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }

    useEffect(() => {
        verifyToken();
    }, []);

    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            data.code = token;
            const res = await resetPassword(data);
            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    text: res.data.message,
                    timer: 3000,
                })
                    .then(() => navigate("/"));
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                text: error.response?.data?.message || "Error inesperado",
                timer: 3000
            })
            setTimeout(() => setDisabled(false), 1000);
        }
    }
    if (error) return <Error error={error.message} status={error.status} />
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Loader isVisible={loading} />
                <NavbarEmpty />
                <div className="container mx-auto px-10 pt-24 flex-grow">
                    <h1 className="text-center text-5xl mb-5 font-bold">Cambiar contraseña</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputField error={errors.password?.message} type={"password"} label={"Nueva contraseña"} icon={faLock} {...register("password", {
                            required: "La contraseña es requerida",
                            pattern: {
                                value: /^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/,
                                message: "La contraseña debe incluir minimo 8 caracteres una letra mayuscula y 3 números."
                            },
                            maxLength: {
                                value: 20,
                                message: "La contraseña no puede superar los 20 caracteres"
                            },
                            minLength: {
                                value: 8,
                                message: "La contraseña debe tener al menos 8 caracteres"
                            }
                        })} />
                        <InputField error={errors.confirmPassword?.message} type={"password"} label={"Confirmar la nueva contraseña"} icon={faLock} {...register("confirmPassword", {
                            required: "La contraseña es requerida",
                            validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
                        })} />
                        <Button
                            className={`bg-blue-600 hover:bg-blue-900 cursor-pointer`}
                            type="submit"
                            disabled={disabled || Object.keys(errors).length > 0}>
                            Cambiar contraseña
                        </Button>
                    </form>
                </div>
                <Footer />
            </div>
        </>
    )
}