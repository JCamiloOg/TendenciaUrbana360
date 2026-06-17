import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import Loader from "../components/Loader";
import { usePageLoader } from "../hooks/useLoader";
import Error from "./Error";


export default function AuthUser() {
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);

    const checkUserGoogle = async () => {
        startLoading();
        const message = searchParams.get("message");
        const status = searchParams.get("status");
        const token = searchParams.get("token");

        if (status == 200) {
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 1000 * 72}; SameSite=None; Secure; partitioned=true`;
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