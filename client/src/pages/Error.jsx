import { Link, useNavigate } from "react-router-dom";
import "../style/404.css";
import { useEffect } from "react";

export default function Error({ status, error }) {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Error"
    })
    return (
        <div className="errorBody h-dvh w-dvh">
            <svg className="absolute top-2/4 left-2/4 mt-[-250px] ml-[-400px] " width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="" s:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                    <path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#007FB2" stroke-width="6" sketch:type="MSShapeGroup"></path>
                    <path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#EF4A5B" stroke-width="6" sketch:type="MSShapeGroup"></path>
                    <path d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" id="Polygon-3" stroke="#795D9C" stroke-width="6" sketch:type="MSShapeGroup"></path>
                    <path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#F2773F" stroke-width="6" sketch:type="MSShapeGroup"></path>
                    <path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#36B455" stroke-width="6" sketch:type="MSShapeGroup"></path>
                </g>
            </svg>
            <div className="h-[200px] w-[380px] absolute top-2/4 left-2/4 mt-[-100px] ml-[50px] text-black font-[Roboto] font-light">
                <h1 className="text-[60px] font-bold leading-[46px] mb-10">{status}</h1>
                <p>{error}</p>
                <div className="">
                    <div className="mt-10">
                        <a onClick={() => navigate(-1)} className="bg-[#004aad] pb-2 pt-2 px-[25px]  rounded-[4px] text-white font-bold text-[14px] transition-all duration-300 ease-linear cursor-pointer no-underline mr-2.5 hover:bg-[#ffd200] hover:text-black  link-button link-back-button">Volver</a>
                        <Link to="/" className="bg-[#004aad] pb-2 px-[25px] pt-2 rounded-[4px] text-white font-bold text-[14px] transition-all duration-300 ease-linear cursor-pointer no-underline mr-2.5 hover:bg-[#ffd200] hover:text-black">Ir a inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}