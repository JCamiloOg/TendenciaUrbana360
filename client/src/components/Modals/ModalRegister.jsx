import { useRef, useState } from 'react';
import logo from "../../assets/TendenciaUrbanaLogoTransparente.svg"
import { useClickOutSide } from '../../hooks/useClickOutSide';
import { useForm } from 'react-hook-form';
import { register as registerSubmit } from '../../services/usersServices';
import { Toast } from '../../hooks/useToastAlert';
import InputModal from '../Inputs/InputModal';

export default function ModalRegister({ isOpenModal, isVisible, close, openLogin }) {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const [disabled, setDisabled] = useState(null);

    const menuRef = useRef(null);

    const password = watch("password");


    const onSubmit = async (data) => {
        try {
            setDisabled(true);

            const response = await registerSubmit(data);

            if (response.status === 200) {
                Toast.fire({
                    icon: 'success',
                    title: response.data.message
                })
            }
            reset();
            close();
            setDisabled(null);
        } catch (error) {
            setDisabled(false);
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error inesperado al registrarse"
            })
        }
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
                                        Registro
                                    </p>
                                    <center >
                                        <img src={logo} className="" width={200} alt="" />
                                    </center>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Procura que tus datos sean reales ya que se pedirá verificación por correo.
                                    </p>
                                </div>
                                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputModal
                                            isError={errors.nombre ? true : false}
                                            type={"text"}
                                            placeholder={"Nombre"}
                                            {...register("nombre", {
                                                required: true,
                                                minLength: 3,
                                                maxLength: 50,
                                                pattern: {
                                                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                    message: "El nombre es invalido"
                                                }
                                            })}
                                            className={`mt-2 ${errors.nombre ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 transition-all duration-300 focus:ring-blue-900 focus:ring-offset-1`}
                                        />
                                        <InputModal
                                            isError={errors.apellido ? true : false}
                                            type={"text"}
                                            placeholder={"Apellido"}
                                            {...register("apellido", {
                                                required: true,
                                                minLength: 3,
                                                maxLength: 50,
                                                pattern: {
                                                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                    message: "El apellido es invalido"
                                                }
                                            })}
                                            className={`${errors.apellido ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-900 transition-all duration-300 focus:ring-offset-1`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <InputModal
                                            isError={errors.correo ? true : false}
                                            type={"email"}
                                            placeholder={"Correo Electrónico"}
                                            {...register("correo", {
                                                required: true,
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "El correo es invalido"
                                                }
                                            })}
                                            className={`${errors.correo ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 transition-all duration-300 focus:ring-blue-900 focus:ring-offset-1`}
                                        />
                                        <InputModal
                                            isError={errors.telefono ? true : false}
                                            type={"number"}
                                            placeholder={"Teléfono"}
                                            {...register("telefono", {
                                                required: true,
                                                maxLength: 10,
                                                minLength: 10,
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "El telefono es invalido"
                                                }
                                            })}
                                            className={`${errors.telefono ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-900 transition-all duration-300 focus:ring-offset-1`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 mt-2">
                                        <InputModal
                                            isError={errors.direccion ? true : false}
                                            type={"text"}
                                            placeholder={"Dirección"}
                                            {...register("direccion", {
                                                required: true,
                                                maxLength: 100,
                                                minLength: 10
                                            })}
                                            className={`${errors.direccion ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 transition-all duration-300 focus:ring-blue-900 focus:ring-offset-1`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 mt-2">
                                        <InputModal
                                            isError={errors.password ? true : false}
                                            type={"password"}
                                            placeholder={"Contraseña"}
                                            {...register("password", {
                                                required: true,
                                                minLength: 8,
                                                pattern: {
                                                    value: /^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/,
                                                    message: "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un caracter especial"
                                                }
                                            })}
                                            className={`${errors.password ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 transition-all duration-300 focus:ring-blue-900 focus:ring-offset-1`}
                                        />
                                        {errors.password ?
                                            <span className='text-red-500 text-clip'>
                                                La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un caracter especial
                                            </span> :
                                            <>

                                            </>}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 mt-2">
                                        <InputModal
                                            isError={errors.confirmPassword ? true : false}
                                            type={"password"}
                                            placeholder={"Confirmar contraseña"}
                                            {...register("confirmPassword", {
                                                required: true,
                                                validate: (value) => {
                                                    return value === password || "Las contraseñas no coinciden"
                                                }
                                            })}
                                            className={`${errors.confirmPassword ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 transition-all duration-300 focus:ring-blue-900 focus:ring-offset-1`}
                                        />
                                        {
                                            errors.confirmPassword ? <span className='text-clip text-red-500'>{errors.confirmPassword.message}</span> : <></>
                                        }
                                    </div>
                                    <button
                                        disabled={disabled || Object.keys(errors).length > 0 ? true : false}
                                        type="submit"
                                        className={`inline-flex  mt-5 w-full items-center justify-center rounded-lg bg-blue-600 p-2 py-3 text-sm font-medium text-white focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all duration-300 ${disabled || Object.keys(errors).length > 0 ? "bg-blue-900 text-gray-500" : "hover:bg-blue-800 hover:shadow-lg shadow-blue-800 cursor-pointer"} `}
                                    >
                                        Registrarse
                                    </button>
                                </form>
                                <div className="mt-6 text-center text-sm text-slate-600">
                                    Ya tienes una cuenta?{" "}
                                    <button
                                        onClick={() => { close(); openLogin() }}
                                        className="font-medium cursor-pointer text-[#4285f4] hover:text-blue-800 transition-all duration-300">
                                        Iniciar sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}
