export default function formatCurrency(val) {
    const formatValue = new Intl.NumberFormat('es-CO', {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    }).format(val);

    return formatValue
}