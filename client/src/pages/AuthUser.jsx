import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import Loader from "../components/Loader";
import { usePageLoader } from "../hooks/useLoader";
import Error from "./Error";
import { useToken } from "@/hooks/useToken";


export default function AuthUser() {
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const { setAccessToken } = useToken();

    const checkUserGoogle = async () => {
        startLoading();
        const message = searchParams.get("message");
        const status = searchParams.get("status");
        const token = searchParams.get("token");

        if (status == 200) {
            setAccessToken(token);
            localStorage.setItem("token", token);
            navigate("/");
        } else setError({ status, message });

        setTimeout(() => stopLoading(), 300);
    };
    useEffect(() => {
        checkUserGoogle();
    }, []);

    if (error) return <Error status={error.status} error={error.message} />
    return (
        <Loader isVisible={loading} />
    )
}