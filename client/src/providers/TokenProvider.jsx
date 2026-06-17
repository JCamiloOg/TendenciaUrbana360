import TokenContext from "@/context/tokenContext";
import { useState } from "react";



export default function TokenProvider({ children }) {
    const [user, setUser] = useState({});
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("token") || "");

    return (
        <TokenContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
            {children}
        </TokenContext.Provider>
    )
}