import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonBlank from "../Buttons/ButtonBlank";

export function AccordionItem({ icon, children, toggle, isOpen }) {
    return (
        <div onClick={toggle} className="flex cursor-pointer items-center justify-between bg-white p-5 mb-12">
            <span> <FontAwesomeIcon icon={icon} size="lg" /> {" "} {children} </span>
            <FontAwesomeIcon icon={faChevronDown} size="2x" className={`transition-all duration-500 ${isOpen ? "rotate-180" : ""}`} />
        </div>
    )
}


export function AccordionnBody({ head, text, isOpen, onClick }) {
    return (
        <div className={`p-5 border border-gray-300 transition-all duration-500 ease-initial rounded-sm bg-white shadow-2xs mb-12 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
            <p className="font-bold text-xl mb-2">{head}</p>
            <p className="text-gray-400 text-lg mb-3">{text}</p>
            <ButtonBlank onClick={onClick} type={"button"} color={"#007bff"} letterColor={"black"} disabled={false} >Modificar</ButtonBlank>
        </div>

    )
}


