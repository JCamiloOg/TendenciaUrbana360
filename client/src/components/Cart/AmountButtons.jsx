import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function AmountButtons({ initialQty, updateQty, id, cart }) {
    const [qty, setQty] = useState(initialQty);

    return (
        <>
            <button disabled={qty == 1} onClick={() => updateQty(id, "less", setQty, cart)} className={`text-white border-r-2 border-l border-y rounded-l-md rounded-bl-md border-black px-2 ${qty == 1 ? "bg-[#002960]" : "cursor-pointer bg-[#004aad] hover:bg-[#002960]"} transition-all duration-300`}><FontAwesomeIcon icon={faMinus} /></button>
            <p className="px-2 select-none border-y border-black">{qty}</p>
            <button onClick={() => updateQty(id, "plus", setQty, cart)} className="text-white border-l-2 border-r border-y rounded-r-md border-black px-2 cursor-pointer bg-[#004aad] hover:bg-[#002960] transition-all duration-300"><FontAwesomeIcon icon={faPlus} /></button>
        </>
    )
}