import formatCurrency from "@/utils/formatCurrency";

export default function TotalCart({ total }) {

    return (
        <p><strong>Total: {formatCurrency(total)}</strong></p>
    )

}