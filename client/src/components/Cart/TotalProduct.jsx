import formatCurrency from "@/utils/formatCurrency";

export default function TotalProduct({ total }) {

    return (
        <p className="ml-4">{formatCurrency(total)}</p>
    )
}