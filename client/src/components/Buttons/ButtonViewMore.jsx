import { Link, useNavigate } from "react-router-dom";

export default function ButtonViewMore() {
    const navigate = useNavigate();

    const toProducts = () => {
        navigate("/products")
    }
    return (

        <button onClick={toProducts} class="relative group cursor-pointer text-sky-50  overflow-hidden h-16 w-64 rounded-md bg-[#004aad] p-2  justify-center items-center font-extrabold inline-flex">
            <div class="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-40 h-40 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-[#002960]"></div>
            <div class="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-32 h-32 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-[#003986]"></div>
            <div class="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-24 h-24 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-[#0059d2]"></div>
            <div class="absolute top-3 right-20 group-hover:top-12 group-hover:-right-12 z-10 w-14 h-14 rounded-full group-hover:scale-150 group-hover:opacity-50 duration-500 bg-[#006af9]"></div>
            <p class="z-10">Ver más</p>
        </button>
    )
}