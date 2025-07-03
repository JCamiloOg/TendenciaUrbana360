import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { checkUser } from "../services/users/usersServices";
import Loader from "../components/Loader";
import { usePageLoader } from "../hooks/useLoader";
import Error from "./Error";


export default function AuthUser() {
    const navigate = useNavigate();
    const { loading, startLoading, stopLoading } = usePageLoader();
    const [error, setError] = useState(null);

    const checkUserGoogle = async () => {
        try {
            startLoading();
            const response = await checkUser();

            if (response.status === 200) navigate("/");

        } catch (error) {
            setError({ status: error.status, message: error.response?.data?.message || "Error desconocido" })

        } finally {
            stopLoading();
        }
    };
    useEffect(() => {
        checkUserGoogle();
    }, []);

    if (error) return <Error status={error.status} error={error.message} />
    return (
        <Loader isVisible={loading} />
    )
}