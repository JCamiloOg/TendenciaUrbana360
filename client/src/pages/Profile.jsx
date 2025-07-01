// Modules
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalRegister from "../components/Modals/ModalRegister";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import NavBar from "../components/NavBars/Navbar";
import ModalLogin from "../components/Modals/ModalLogin";
import { faUser, faLocationDot, faLock, faBoxesPacking } from "@fortawesome/free-solid-svg-icons";
import Error from "../pages/Error"

// Hooks
import { usePageLoader } from "../hooks/useLoader";
import { useModalLogin, useModalRegister } from "../hooks/useModal";
import { AccordionItem, AccordionnBody } from "../components/Accordion/Accordion";
import { profileInfo } from "../services/usersServices";
import NoInfoComplete from "./NoInfoComplete";
import useAccordion from "../hooks/useAccordion";
import { useClickOutSide } from "../hooks/useClickOutSide";

export default function Profile() {
    const { isOpenModal, isVisible, close, open } = useModalLogin();
    const { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister } = useModalRegister();
    const { openAccordion, toggle, closeAccordion } = useAccordion();

    const [letters, setLetters] = useState(null);
    const [info, setInfo] = useState(null);
    const [infoUser, setInfoUser] = useState("");
    const [orders, setOrders] = useState(null);
    const [isLogin, setIsLogin] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const refFirst = useRef(null);
    const refSecond = useRef(null);

    const { loading, startLoading, stopLoading } = usePageLoader();

    const getInfo = async () => {
        startLoading();
        try {
            const res = await profileInfo();
            if (res.status === 200) {
                setInfoUser(res.data.info);
                setOrders(res.data.orders);
                setLetters(res.data.initialLetters);
                setIsLogin(res.data.user);
            }
        } catch (error) {
            if (error.status === 400) {
                if (typeof error.response.data.redirect === "undefined" || error.response.data.redirect) return navigate(error.response?.data?.redirect || "/");

                setInfo(true);
                return;
            }
            setError({ status: error?.status || 500, message: error?.response?.data?.message || "Error inesperado" });
        } finally {
            stopLoading();

        }
    }

    useEffect(() => {
        document.title = "Perfil"

        getInfo();
    }, []);

    useClickOutSide([refFirst], closeAccordion);


    if (error) return <Error status={error.status} error={error.message} />
    if (info) return <NoInfoComplete />


    return (
        <>
            <Loader isVisible={loading} />
            <NavBar openLogin={open} openRegister={openRegister} isLogin={isLogin} active={false} />

            <div className={`container mx-auto px-10 pt-28`}>
                <div className="p-3 border border-gray-300 rounded-sm bg-white  shadow-2xs mb-12">
                    <div className="flex flex-wrap gap-4" >
                        <div className=" ml-2.5 text-[28px] border-1 border-solid rounded-full flex items-center justify-center max-h-[80px] max-w-[80px] min-h-[80px] min-w-[80px]">{letters}</div>
                        <div className="flex flex-col">
                            <h2 className="mt-2 text-3xl font-semibold">{`${infoUser.Nombre} ${infoUser.Apellido}`}</h2>
                            <p>{infoUser.Correo}</p>
                        </div>
                    </div>
                </div>
                <div ref={refFirst}>
                    <AccordionItem toggle={toggle} isOpen={openAccordion} icon={faUser}>Datos personales</AccordionItem>
                    <AccordionnBody head={"Correo Electrónico"} isOpen={openAccordion} text={infoUser.Correo} onClick={() => navigate("/")} />
                    <AccordionnBody head={"Teléfono"} isOpen={openAccordion} text={infoUser.Telefono} onClick={() => navigate("/")} />
                </div>
                <div ref={refSecond}>
                    <AccordionItem toggle={toggle} isOpen={openAccordion} icon={faUser}>Datos personales</AccordionItem>
                </div>
            </div>
            {/* <Footer /> */}
            {
                isLogin ?
                    <></>
                    :
                    <>
                        <ModalLogin isOpenModal={isOpenModal} openRegister={openRegister} close={close} isVisible={isVisible} />
                        <ModalRegister close={closeRegister} isOpenModal={isOpenModalRegister} isVisible={isVisibleReigster} openLogin={open} />
                    </>
            }

        </>
    )
}