export const customStyles = {
    table: {
        style: {
        },
    },
    head: {
        style: {
            backgroundColor: "#212121",
        },
    },
    headCells: {
        style: {
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "bold",
            backgroundColor: "#212121",
        },
    },
    rows: {
        style: {
            backgroundColor: "#212121",
            color: "#fffff",
            '&:not(:last-of-type)': {
                borderBottom: '1px solid #303030',
            },
        },
        highlightOnHoverStyle: {
            backgroundColor: '#364153',
            color: '#ffffff',
            border: "none"
        },
    },
    cells: {
        style: {
            color: "#ffff",
        },
    },
    pagination: {
        style: {
            backgroundColor: "#212121",
            color: "#e0e0e0",
        },
    },
    header: {
        style: {
            backgroundColor: "#212121",
            color: "#e0e0e0",
        }
    },
    noData: {
        style: {
            color: "#e0e0e0",
            backgroundColor: "#212121"
        }
    },
    subHeader: {
        style: {
            backgroundColor: "#212121",
            color: "#e0e0e0",
        }
    }
}

export const traslate = {
    rowsPerPageText: "Filas por páginas",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Seleccionar todo",
}
