import { useEffect, useState } from "react";

export default function useIsMobile(breakPoint = 767) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakPoint);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= breakPoint);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakPoint])

    return isMobile
}