export function logOut(req, res) {
    req.session.destroy((err) => {
        if (err) console.log(err);
    });

    res.clearCookie('token');
    res.status(200).redirect("/");
}

