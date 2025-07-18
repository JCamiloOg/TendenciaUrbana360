import Loader from "@/components/Loader";
import NavbarEmpty from "@/components/NavBars/NavBarEmpty";
import { usePageLoader } from "@/hooks/useLoader";
import { modify, updateInfo } from "@/services/users/updateInfoServices";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Error from "./Error";
import NoInfoComplete from "./NoInfoComplete";
import InputField from "@/components/Inputs/Input";
import { useForm } from "react-hook-form";
import { faChevronLeft, faEnvelope, faHouse, faLock, faLockOpen, faPhone, faUnlock } from "@fortawesome/free-solid-svg-icons";
import ButtonBlank from "@/components/Buttons/ButtonBlank";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "@/components/Footer";
import { Toast } from "@/hooks/useToastAlert";

export default function Modify() {
    const [searchParams] = useSearchParams();
    const { register, handleSubmit, setError, watch, formState: { errors } } = useForm();
    const [info, setInfo] = useState(null);
    const [type, setType] = useState(null);
    const [isLogin, setIsLogin] = useState(null);
    const [error, setErrorPage] = useState(null);
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [disabled, setDisabled] = useState(false);

    const onLoad = async (token, type) => {
        startLoading();
        try {
            const res = await modify(token, type);
            if (res.status === 200) {
                setType(res.data.type);
                setIsLogin(res.data.user);
            }
        } catch (error) {
            if (error.status === 400) {
                if (typeof error.response.data.redirect === "undefined" || error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");

                setInfo(true);
                return;
            }
            setErrorPage({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            setTimeout(() => stopLoading(), 500);
        }
    }

    const onSubmit = async (data) => {
        setDisabled(true);
        try {
            const res = await updateInfo(data);
            if (res.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: res.data.message,
                    timer: 2000
                }).then(() => navigate("/clients/profile"));
            }
        } catch (error) {
            if (error.status === 400) {
                const message = error.response.data.message;
                if (error.response.data.type === "email") {
                    setError("email", { message: message });
                } else if (error.response.data.type === "phone") {
                    setError("phone", { message: message });
                } else if (error.response.data.type === "lastPassword") {
                    setError("lastPassword", { message: message });
                } else if (error.response.data.type === "confirmPassword") {
                    setError("password2", { message: message });
                } else if (error.response.data.type === "password") {
                    setError("password", { message: message });
                }
            } else {
                Toast.fire({
                    icon: "error",
                    title: error.response.data.message || "Error inesperado",
                    timer: 2000
                })
            }
        } finally {
            setTimeout(() => setDisabled(false), 2500);
        }
    }

    useEffect(() => {
        onLoad(searchParams.get("code"), searchParams.get("type"));
    }, [])

    if (error) return <Error error={error.message} status={error.status} />
    if (info) return <NoInfoComplete />
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Loader isVisible={loading} />
                <NavbarEmpty />
                <div className="flex justify-center mt-30 flex-grow">
                    <div className={`p-5 bg-white rounded-md shadow-md h-full w-100`}>
                        <a onClick={() => navigate(-1)} className="text-gray-600 mb-5 hover:text-black cursor-pointer transition-all duration-300"><FontAwesomeIcon icon={faChevronLeft} size="lg" /> Volver</a>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            {
                                type === "email" ?
                                    <>
                                        <h3 className="text-3xl font-bold mb-3">Ingresa tu nuevo Correo</h3>
                                        <p className="text-left text-gray-500 mb-7">Recuerda verificar que el correo exista.</p>
                                        <InputField className={"mb-7"}
                                            icon={faEnvelope} error={errors.email?.message} isError={errors.email} label={"Correo electrónico"} type={"text"} {...register("email", {
                                                required: {
                                                    value: true,
                                                    message: "El correo es requerido"
                                                },
                                                minLength: {
                                                    value: 5,
                                                    message: "El correo debe tener al menos 5 caracteres"
                                                },
                                                maxLength: {
                                                    value: 50,
                                                    message: "El correo debe tener como máximo 50 caracteres"
                                                },
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "El correo es invalido"
                                                }
                                            })} />
                                        <ButtonBlank className={`w-full rounded-md`}
                                            color={`#007bff`}
                                            disabled={disabled || Object.keys(errors).length > 0}
                                            type="submit" >Actualizar</ButtonBlank>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                type === "phone" ?
                                    <>
                                        <h3 className="text-3xl font-bold mb-3">Ingresa tu nuevo Teléfono</h3>
                                        <p className="text-left text-gray-500 mb-7">Recuerda verificar que el número sea correcto.</p>
                                        <InputField label={"Teléfono"} error={errors.phone?.message} type={"number"} icon={faPhone} {...register("phone", {
                                            required: {
                                                value: true,
                                                message: "El teléfono es requerido"
                                            },
                                            minLength: {
                                                value: 10,
                                                message: "El teléfono debe tener 10 digitos"
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: "El teléfono debe tener 10 digitos"
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: "El teléfono debe tener solo números"
                                            }
                                        })} />
                                        <ButtonBlank className={`w-full rounded-md`}
                                            color={`#007bff`}
                                            disabled={disabled || Object.keys(errors).length > 0}
                                            type="submit" >Actualizar</ButtonBlank>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                type === "address" ?
                                    <>
                                        <h3 className="text-3xl font-bold mb-3">Ingresa la nueva dirección</h3>
                                        <p className="text-left text-gray-500 mb-7">Recuerda verificar que la dirección sea correcta.</p>
                                        <InputField label={"Dirección"} type={"text"} icon={faHouse} error={errors.address?.message} {...register("address", {
                                            required: {
                                                value: true,
                                                message: "La dirección es requerida"
                                            },
                                            minLength: {
                                                value: 5,
                                                message: "La dirección debe tener al menos 5 caracteres"
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: "La dirección debe tener como máximo 50 caracteres"
                                            }
                                        })} />
                                        <ButtonBlank className={`w-full rounded-md`}
                                            color={`#007bff`}
                                            disabled={disabled || Object.keys(errors).length > 0}
                                            type="submit" >Actualizar</ButtonBlank>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                type === "password" ?
                                    <>
                                        <h3 className="text-3xl font-bold mb-3">Cambiar contraseña</h3>
                                        <InputField label={"Contraseña Actual"} type={"password"} icon={faLockOpen} error={errors.lastPassword?.message} {...register("lastPassword", {
                                            required: {
                                                value: true,
                                                message: "La contraseña actual es requerida"
                                            }
                                        })} />
                                        <InputField label={"Contraseña Nueva"} type={"password"} icon={faUnlock} error={errors.password?.message} {...register("password", {
                                            required: {
                                                value: true,
                                                message: "La contraseña nueva es requerida"
                                            },
                                            minLength: {
                                                value: 8,
                                                message: "La contraseña nueva debe tener al menos 8 caracteres",
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: "La contraseña nueva debe tener como máximo 20 caracteres"
                                            },
                                            pattern: {
                                                value: /^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/,
                                                message: "La contraseña debe incluir minimo 8 caracteres una letra mayuscula y 3 números."
                                            }
                                        })} />
                                        <InputField label={"Confirmar nueva contraseña"} type={"password"} icon={faLock} error={errors.password2?.message} {...register("password2", {
                                            required: {
                                                value: true,
                                                message: "Confirma la contraseña"
                                            },
                                            validate: (value) => {
                                                return value === watch("password") || "Las contraseñas no coinciden"
                                            }
                                        })} />
                                        <ButtonBlank className={`w-full rounded-md`}
                                            color={`#007bff`}
                                            disabled={disabled || Object.keys(errors).length > 0}
                                            type="submit" >Actualizar</ButtonBlank>
                                    </>
                                    :
                                    <></>
                            }
                        </form>

                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}