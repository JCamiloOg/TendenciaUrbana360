import conn from "../config/db.js";

export async function getClientWithEmailOrPhone(email, phone) {
    try {
        const [rows] = await conn.query('SELECT * FROM cliente WHERE Correo = ? OR Telefono = ?', [email, phone]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }
}

export async function registerClient(ID, nombre, apellido, direccion, telefono, correo, password) {
    try {
        const [result] = await conn.query('INSERT INTO cliente SET ID = ?, Nombre =?, Apellido =?, Direccion =?, Telefono =?, Correo =?, Password =?, Estado = ?', [ID, nombre, apellido, direccion, telefono, correo, password, 'Pendiente']);

        return result;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getClient(ID) {
    try {
        const [rows] = await conn.query('SELECT * FROM cliente WHERE ID =?', [ID]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }
}

export async function registerClientWithGoogle(ID, email) {
    try {
        await conn.query("INSERT INTO cliente (ID, Correo, Estado) VALUES (?,?,?)", [ID, email, 'Aceptado']);

    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }

}

export async function completeAllInfo(adress, phone, name, lastName, ID) {
    try {
        await conn.query('UPDATE cliente SET Nombre = ?, Apellido = ?, Direccion = ?, Telefono = ? WHERE ID = ?', [name, lastName, adress, phone, ID]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getStatusClient(email) {
    try {
        const [rows] = await conn.query("SELECT ID, Correo, Estado FROM cliente WHERE Correo = ?", [email]);

    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function updateStatus(ID) {
    try {
        await conn.query("UPDATE cliente SET Estado = 'Aceptado' WHERE ID = ?", [ID]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function updatePassword(password, ID) {
    try {
        await conn.query('UPDATE cliente SET Password = ? WHERE ID = ?', [password, ID]);

    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}


