import TokenContext from "@/context/tokenContext"
import { useContext } from "react"


export const useToken = () => {
    const context = useContext(TokenContext);

    if (!context) throw new Error('useToken must be used within a TokenProvider');

    return context;
}