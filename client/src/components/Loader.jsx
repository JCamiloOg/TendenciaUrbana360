import { useEffect, useState } from "react";

export default function Loader({ isVisible, bg = "bg-white" }) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            // Espera la animación antes de ocultar completamente
            const timeout = setTimeout(() => setHidden(true), 500); // duración del fade
            return () => clearTimeout(timeout);
        } else {
            setHidden(false);
        }
    }, [isVisible]);

    if (hidden) return null;
    return (
        <div className={`flex-col gap-4 w-full h-dvh fixed inset-0 ${bg} z-50 flex items-center justify-center transition-opacity duration-500  ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className="w-20 h-20 border-4 border-transparent text-[#004aad] text-4xl animate-spin flex items-center justify-center border-t-[#004aad] rounded-full"
            >
                <div
                    className="w-16 h-16 border-4 border-transparent text-[#ffd200] text-2xl animate-spin flex items-center justify-center border-t-[#ffd200] rounded-full"
                ></div>
            </div>
        </div>
    )
}