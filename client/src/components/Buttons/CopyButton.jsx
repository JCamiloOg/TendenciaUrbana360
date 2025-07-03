// Modules
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons"

// Hooks
import { Toast } from "@/hooks/useToastAlert";

export default function CopyButton({ textCopy }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            console.log(textCopy)
            await navigator.clipboard.writeText(textCopy);
            setIsCopied(true);
            Toast.fire({
                icon: "success",
                text: "# de pedido copiado con éxito",
                timer: 2000,
            })
            setTimeout(() => setIsCopied(false), 2000);
        } catch (e) {
            console.log(e);
            Toast.fire({
                icon: "error",
                text: "Error al copiar el texto",
                timer: 2000,
            })
        }
    }

    return (
        <button disabled={isCopied ? true : false} onClick={handleCopy} className={isCopied ? "text-blue-950" : "cursor-pointer text-blue-600"}><FontAwesomeIcon icon={faCopy} size="xl" /></button>
    )
}