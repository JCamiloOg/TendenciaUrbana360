import { useClickOutSide } from "@/hooks/useClickOutSide";
import { faClockRotateLeft, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react"
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom"

export default function InputSearch({ handleSearch, searches, setSearches }) {
    const menuRef = useRef(null);
    const menuRefInput = useRef(null);

    const { register, watch, handleSubmit, setValue } = useForm();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    }

    const close = () => {
        setIsOpen(false);
    }

    const handleXmark = (idx) => {
        const newHistory = [...searches]
        newHistory.splice(idx, 1);
        localStorage.setItem("lastSearches", JSON.stringify(newHistory));
        setSearches(newHistory);
    }

    useClickOutSide([menuRef, menuRefInput], close)

    return (
        <form onSubmit={handleSubmit(() => {
            handleSearch(watch("query"))
            setValue("query", "")
        })} className="flex gap-5 relative">
            <input ref={menuRefInput}
                className={`peer mb-10 bg-white z-[21] px-6 py-4 rounded-xl outline-none duration-200 ring-2 ring-[transparent] focus:ring-[#004aad] 2xl:w-xl xl:w-xl lg:w-xl md:w-xl sm:w-sm w-full`}
                color="white"
                size="xl"
                placeholder="Buscar producto"
                type="search"
                {...register("query", {
                    required: true
                })}
                autoComplete="off"
                onFocus={open}
            />
            <button type="submit" className="bg-[#006af9] cursor-pointer text-center h-15 p-5 rounded-md hover:bg-[#0049ac] transition-all duration-300 " ><FontAwesomeIcon color="white" icon={faMagnifyingGlass} /></button>
            {
                searches.length > 0 ?
                    <div ref={menuRef}
                        className={`${isOpen ? "-translate-y-0 opacity-100 pointer-events-auto" : "translate-y-2 opacity-0 pointer-events-none"} duration-200 absolute top-16 2xl:w-xl xl:w-xl lg:w-xl md:w-xl sm:w-sm w-full z-10 left-0 rounded-xl border border-white-222 p-4 bg-white shadow-lg`}>
                        <p className="font-semibold text-xs text-[#5D5D5F]">Búsquedas Recientes</p>
                        <ul className="flex gap-2 flex-col mt-2">
                            {
                                searches.slice(0, 5).map((search, idx) => (
                                    <li className="px-2 flex justify-between cursor-pointer text-sm hover:bg-[#004aad]/50 py-2 rounded-lg" key={idx}>
                                        <div className="w-full" onClick={() => {
                                            setSearchParams({ query: search })
                                            close();
                                        }}>
                                            <FontAwesomeIcon icon={faClockRotateLeft} size="lg" /> &nbsp; {search}
                                        </div>
                                        <FontAwesomeIcon onClick={() => handleXmark(idx)} icon={faXmark} />
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    :
                    <></>
            }
        </form>

    )
}