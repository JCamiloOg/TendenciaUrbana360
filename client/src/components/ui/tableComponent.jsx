import DataTable from "react-data-table-component";
import Badge from "./badge";
import InputField from "../Inputs/Input";
import { faEye, faPenToSquare, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import useSearchTable from "@/hooks/useSearchTable";
import withActions from "../../hooks/ActionsTable";
import CopyButton from "../Buttons/CopyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default function Table({ columns, data, title, onDelete, onEdit, viewMore }) {
    const [search, setSearch] = useState("");

    const filteredData = useSearchTable(data, search);

    const columnsWithActions = withActions(columns, onEdit, onDelete, viewMore)

    return (
        <DataTable
            title={<h1 className="text-lg sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl  font-bold text-center break-words whitespace-normal">{title}</h1>}
            columns={columnsWithActions.map(col => ({
                ...col,
                cell: row => {
                    if (col.name.toLowerCase().includes("estado")) {
                        let type;
                        switch (col.cell(row).toLowerCase()) {
                            case "pendiente":
                                type = "warning"
                                break;
                            case "en proceso":
                                type = "info"
                                break;
                            case "cancelado":
                                type = "danger"
                                break;
                            case "completado":
                                type = "success"
                                break;
                        }
                        return <Badge type={type} >{col.cell(row)}</Badge>
                    }

                    if (col.name.toLowerCase().includes("pedido")) {
                        return <div className="flex gap-2">
                            <CopyButton textCopy={col.cell(row)} />
                            <p className="truncate w-20 2xl:w-50 xl:w-40 lg:w-30 md:w-20 sm:w-20">{col.cell(row)}</p>
                        </div>
                    }

                    if (col.name.toLowerCase().includes("acciones")) {
                        // Tomamos con el object values el ID del datos si es necesario
                        return <div className="flex gap-2">
                            {
                                onEdit ? <button className="" onClick={() => onEdit(Object.values(row)[0])}><FontAwesomeIcon icon={faPenToSquare} size="xl" /></button> : <></>
                            }
                            {
                                onDelete ? <button onClick={() => onDelete(Object.values(row)[0])}><FontAwesomeIcon icon={faTrash} size="xl" /></button> : <></>
                            }
                            {
                                viewMore ? <button className="text-blue-600 cursor-pointer p-2" title="Ver más" onClick={() => viewMore(Object.values(row)[0])}><FontAwesomeIcon icon={faEye} size="xl" /></button> : <></>
                            }
                        </div>
                    }
                    return col.cell ? col.cell(row) : ""
                }
            }))}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            noDataComponent={<h1>No hay datos para mostrar</h1>}
            paginationComponentOptions={{
                rowsPerPageText: "Filas por página",
                rangeSeparatorText: "de",
                selectAllRowsItem: true,
                selectAllRowsItemText: "Todos"
            }}
            subHeader
            subHeaderComponent={
                <InputField icon={faSearch} isError={false} label={"Buscar..."} type={"search"} onChange={(e) => setSearch(e.target.value)} />
            }
        />
    )
}