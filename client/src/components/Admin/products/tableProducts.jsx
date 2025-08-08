import DataTable from "react-data-table-component";
import "@/style/table.css"
import { customStyles, traslate } from "@/utils/tableAdmin";

export default function TableProducts({ data, columns, title, setSearch, search, length }) {

    // estilos de la tabla
    return (
        <DataTable
            title={<h1 className="text-4xl my-4 text-center font-bold">{title}</h1>}
            columns={columns}
            data={data}
            pagination
            responsive
            customStyles={customStyles}
            subHeader
            subHeaderComponent={
                length > 0 && (
                    <div className="relative">
                        <input
                            placeholder="Buscar producto..."
                            className="input shadow-lg border-2 border-transparent focus:border-2 focus:border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
                            value={search}
                            name="search"
                            type="text"
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                        />
                        <svg
                            className="size-6 absolute top-3 right-3 text-gray-500"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            ></path>
                        </svg>
                    </div>
                )
            }
            paginationComponentOptions={traslate}
            noDataComponent={search.length > 0 ? "No hay resultados con tu búsqueda" : "No hay datos para mostrar"}
        />
    )

}