import googleLogo from "../../assets/google-color.svg";
import { useEffect, useRef, useState } from 'react';
import { useClickOutSide } from '../../hooks/useClickOutSide';
import { useForm } from "react-hook-form";
import { login } from "../../services/usersServices";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);
import { Toast } from "../../hooks/useToastAlert";
import { API_URL } from "../../config";
import InputModal from "../Inputs/InputModal";


export default function ModalLogin({ isOpenModal, isVisible, close, openRegister }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [disabled, setDisabled] = useState(null);
    const menuRef = useRef(null);


    const Onsubmit = async (data) => {
        try {
            const response = await login(data);
            if (response.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: response.data.message
                })
                close();
                setTimeout(() => window.location.reload(), 2999);

            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: error.response?.data?.message || "Error Inesperado"
            });

        }
    }

    const loginWithGoogle = () => {
        window.location.href = `${API_URL}/clientes/auth/google`
    }

    useClickOutSide(menuRef, close);
    return (
        <>
            {isOpenModal && (
                <div
                    tabIndex={-1}
                    id="login-popup"
                    className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                        } bg-black/40 backdrop-blur-sm`}
                >
                    <div ref={menuRef}
                        className={`relative p-4 w-full max-w-md transition-all duration-300 transform ${isVisible ? "scale-100" : "scale-90"
                            }`}
                    >
                        <div className="relative bg-white rounded-lg shadow">

                            <button
                                onClick={close}
                                type="button"
                                className="absolute cursor-pointer top-3 right-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-all duration-300"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="#c6c7c7"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="sr-only">Close popup</span>
                            </button>

                            <div className="p-5">
                                <div className="text-center mb-4">
                                    <p className="text-2xl font-semibold text-slate-900">
                                        Inicie sesión en su cuenta
                                    </p>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Debes iniciar sesión para realizar pedidos.
                                    </p>
                                </div>

                                <div className="mt-7 flex flex-col gap-2">
                                    {[

                                        {
                                            text: "Continuar con Google",
                                            icon: googleLogo
                                        },

                                    ].map(({ text, icon }) => (
                                        <button
                                            onClick={loginWithGoogle}
                                            key={text}
                                            className="inline-flex cursor-pointer h-10 w-full items-center justify-center gap-2 rounded border-slate-300 bg-blue-600 p-2 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 hover:bg-blue-800 hover:shadow-lg shadow-blue-800 transition-all duration-500"
                                        >
                                            <img src={icon} alt="" className="h-[18px] w-[18px]" />
                                            {text}
                                        </button>
                                    ))}
                                </div>

                                {/* Separador */}
                                <div className="flex items-center gap-2 py-6 text-sm text-slate-600">
                                    <div className="h-px w-full bg-slate-200"></div>
                                    O
                                    <div className="h-px w-full bg-slate-200"></div>
                                </div>

                                {/* Formulario */}
                                <form onSubmit={handleSubmit(Onsubmit)} className="w-full grid-cols-2">
                                    <InputModal
                                        isError={errors.email ? true : false}
                                        type={"text"}
                                        placeholder={"Correo Eléctronico"}
                                        {...register("email", {
                                            required: "Ingresa un correo",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "El correo es invalido"
                                            }
                                        })}

                                    />
                                    <InputModal
                                        isError={errors.password ? true : false}
                                        type={"password"}
                                        placeholder={"Contraseña"}
                                        {...register("password", {
                                            required: "Ingresa una contraseña",
                                        })}
                                        className={`mt-2 ${errors.password ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 transition-all duration-300 `}
                                    />
                                    <p className="mb-3 mt-2 text-sm text-gray-500">
                                        <a
                                            href="/forgot-password"
                                            className="text-blue-800 hover:text-blue-600"
                                        >
                                            Olvidaste tu contraseña?
                                        </a>
                                    </p>
                                    <button
                                        disabled={disabled || Object.keys(errors).length > 0 ? true : false}
                                        type="submit"
                                        className={`inline-flex w-full items-center justify-center rounded-lg bg-blue-600 p-2 py-3 text-sm font-medium text-white focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all duration-300 ${disabled || Object.keys(errors).length > 0 ? "bg-blue-900 text-gray-600" : "hover:bg-blue-800 hover:shadow-lg shadow-blue-800 cursor-pointer"} `}
                                    >
                                        Continuar
                                    </button>
                                </form>

                                <div className="mt-6 text-center text-sm text-slate-600">
                                    No tienes una cuenta?{" "}
                                    <button onClick={() => { close(); openRegister() }} className="font-medium cursor-pointer text-[#4285f4] hover:text-blue-800 transition-all duration-300">
                                        Registrarse
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
