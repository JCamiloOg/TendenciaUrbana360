import { Link, useNavigate } from "react-router-dom";
import "../style/404.css";
import { useEffect } from "react";

export default function Error({ status = 500, error = "Error inesperado" }) {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Error"
    })
    return (
        <div className="min-h-screen w-full overflow-x-auto flex items-center justify-center relative bg-[#000547]">
            <div className="relative flex flex-col items-center md:items-start md:flex-row ">
                <svg
                    className="w-[300px] h-auto md:w-[380px] md:h-[500px]"
                    viewBox="0 0 837 1045"
                    xmlns="http://www.w3.org/2000/svg"
                    s:xlink="http://www.w3.org/1999/xlink"
                    xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                >
                    <g stroke="none" fill="none" fillRule="evenodd" sketch:type="MSPage">
                        <path
                            d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
                            stroke="#007FB2"
                            strokeWidth="6"
                            sketch:type="MSShapeGroup"
                            id="Polygon-1"
                        />
                        <path
                            d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
                            stroke="#EF4A5B"
                            strokeWidth="6"
                            sketch:type="MSShapeGroup"
                            id="Polygon-2"
                        />
                        <path
                            d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
                            stroke="#795D9C"
                            strokeWidth="6"
                            sketch:type="MSShapeGroup"
                            id="Polygon-3"
                        />
                        <path
                            d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
                            stroke="#F2773F"
                            strokeWidth="6"
                            sketch:type="MSShapeGroup"
                            id="Polygon-4"
                        />
                        <path
                            d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
                            stroke="#36B455"
                            strokeWidth="6"
                            sketch:type="MSShapeGroup"
                            id="Polygon-5"
                        />
                    </g>
                </svg>

                <div className="mt-7 md:mt-35 md:ml-6 text-white font-light font-[Roboto] max-w-[90%] md:max-w-[380px] text-center md:text-left">
                    <h1 className="text-4xl md:text-[60px] font-bold leading-tight mb-4">
                        {status}
                    </h1>
                    <p className="text-base md:text-lg">{error}</p>
                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                        <a
                            onClick={() => navigate(-1)}
                            className="bg-[#004aad] py-2 px-6 rounded-[4px] text-white font-bold text-sm transition-all duration-300 ease-linear cursor-pointer hover:bg-[#ffd200] hover:text-black"
                        >
                            Volver
                        </a>
                        <a
                            onClick={() => window.location.reload()}
                            className="bg-[#004aad] py-2 px-6 rounded-[4px] text-white font-bold text-sm transition-all duration-300 ease-linear cursor-pointer hover:bg-[#ffd200] hover:text-black"
                        >
                            Recargar
                        </a>
                        <Link
                            to="/"
                            className="bg-[#004aad] py-2 px-6 rounded-[4px] text-white font-bold text-sm transition-all duration-300 ease-linear cursor-pointer hover:bg-[#ffd200] hover:text-black"
                        >
                            Ir a inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}