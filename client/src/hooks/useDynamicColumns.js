import formatCurrency from "@/utils/formatCurrency";

export default function useDynamicColumns(data) {
    if (!Array.isArray(data) || data.length === 0) return [];


    const dynamicColumns = Object.keys(data[0]).map((key) => {
        const isNumber = typeof data[0][key] === "number" && /(Precio|Total|Valor)/i.test(key);

        return {
            name: key == "PedidoID" ? "# de pedido" : key,
            selector: (row) => row[key],
            cell: (row) => {
                const value = row[key];

                if (isNumber) return formatCurrency(value);
                return value;
            },
            sortable: true
        }
    });

    return dynamicColumns
}