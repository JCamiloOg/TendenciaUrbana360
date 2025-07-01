import { useState } from "react";

export function usePageLoader() {
    const [loading, setLoading] = useState(true);

    const startLoading = () => {
        setLoading(true)
        document.documentElement.style = "overflow: hidden;";
    }

    const stopLoading = () => {
        setLoading(false)
        document.documentElement.style = "overflow: visible;";
    }


    return { loading, startLoading, stopLoading };
}