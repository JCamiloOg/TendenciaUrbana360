import { Link } from "react-router-dom";
import pexels from "../assets/pexels-jddaniel-2385477.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTiktok, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function HomeSection({ openLogin, isLogin }) {
    return (
        <div
            className={`w-full h-screen bg-no-repeat bg-cover bg-center `} style={{ backgroundImage: `url(${pexels})` }}>
            <div className="w-[90%] mx-auto h-full flex items-center justify-between py-10">
                <div className="">
                    <div className="text-5xl sm:text-6xl xs:text-5xl text-left text-white font-serif font-extrabold uppercase">
                        <h1>Tendencia</h1>
                        <h1 className="bg-black/30 text-white rounded-sm px-1 shadow-sm shadow-white/50">Urbana</h1>
                        <h1>360</h1>
                    </div>
                    {
                        isLogin ?
                            <>
                                <Link to={"/products"} className="w-full flex items-center justify-between mt-6 py-1 px-4 transition-all duration-300 uppercase hover:bg-[#00347a] bg-[#004aad] cursor-pointer rounded-sm">
                                    <h3 className="text-white text-lg font-semibold">Ver productos</h3>
                                </Link>

                            </>
                            :
                            <div onClick={openLogin} className="w-full flex items-center justify-between mt-6 py-1 px-4 transition-all duration-300 uppercase hover:bg-[#00347a] bg-[#004aad] cursor-pointer rounded-sm">
                                <h3 className="text-white text-lg font-semibold">Ingresar</h3>
                            </div>

                    }
                    <p className="text-md text-white bg-black/30 font-semibold mt-1 capitalize rounded-lg p-2">La mejor calidad de productos!</p>
                </div>

                <div className="flex flex-col gap-2 items-center text-2xl text-white mt-6">
                    <a href="https://wa.link/2ppfsc" target="_blank" className="w-12 h-12 transition-all duration-300 rounded-full bg-black/40 hover:bg-green-500/80 flex justify-center items-center">
                        <FontAwesomeIcon icon={faWhatsapp} size="1x" />
                    </a>
                    <a href="https://www.instagram.com/tendencia.urbana.shop/" target="_blank" className="w-12 h-12  transition-all duration-300 rounded-full bg-black/40 hover:bg-pink-800/80  flex justify-center items-center">
                        <FontAwesomeIcon icon={faInstagram} size="1x" />
                    </a>
                    {/* <a href="javascript:;" className="w-12 h-12 rounded-full bg-black/40 hover:bg-sky-600/80  flex justify-center items-center">
                        <FontAwesomeIcon icon={faFacebook} size="1x" />
                    </a> */}
                    <a href="https://www.tiktok.com/@tendenciaurbana.360" className="w-12 h-12  transition-all duration-300 rounded-full bg-black/40 hover:bg-black/80  flex justify-center items-center">
                        <FontAwesomeIcon icon={faTiktok} size="1x" />
                    </a>
                </div>
            </div>
        </div>)
}