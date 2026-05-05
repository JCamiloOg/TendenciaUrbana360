export function logOut(req, res) {
    req.session.destroy((err) => {
        if (err) console.log(err);
    });

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
    });

    res.status(200).json({ message: 'Sesión cerrada' });
}

