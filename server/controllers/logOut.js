export function logOut(req, res) {
    req.session.destroy((err) => {
        if (err) console.log(err);
    });

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 60 * 60 * 1000 * 72,
        partitioned: true
    });

    res.status(200).json({ message: 'Sesión cerrada' });
}

