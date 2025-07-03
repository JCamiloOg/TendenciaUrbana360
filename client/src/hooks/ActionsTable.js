export default function withActions(columns, onEdit, onDelete, viewMore) {
    if (!onEdit && !onDelete && !viewMore) return [...columns];

    return [
        ...columns,
        {
            name: "Acciones",
            cell: () => {

            }
        }
    ]

}
