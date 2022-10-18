const conexion = require("../database/bd");

exports.auth = (req, res) => {
    const correo = req.body.correo;
    const contraseña = req.body.contraseña;
    if (correo && contraseña) {
        conexion.query("SELECT * FROM usuarios WHERE correo = ?",
            [correo], (error, usuario) => {
                if (usuario.length == 0 || (contraseña != usuario[0].contraseña)) {
                    req.session.loggedin = false;
                    res.json({
                        login: false,
                        alertaUsuario:true,
                        index: '/myapp',
                    });
                }
                else {
                    req.session.loggedin = true;
                    req.session.tipo_usuario = usuario[0].tipo_usuario_id;
                    req.session.nombre = usuario[0].nombre;
                    res.json({
                        login: true,
                        enlaceHome: '/myapp/home',

                    });
                }
            });
    } else {
        req.session.loggedin = false;
        res.json({
            login: false,
            loginIncorrecto:true,
            index: '/myapp'
        });
    }
};

exports.guardar = (req, res) => {
    const nombre = req.body.nombre;
    const libro = req.body.libro;
    const descripcion = req.body.descripcion;
    const autor_id = req.body.autor_id;
    const categoria_id = req.body.categoria_id;

    conexion.query(
        "INSERT INTO libros (autor_id, categoria_id, nombre, libro, descripcion) VALUES(?,?,?,?,?)",
        [autor_id,categoria_id,nombre,libro, descripcion],
        (error) => {
            if (error) {
                console.error(error);
            } else {
                res.redirect("./");
            }
        });
}


exports.actualizar = (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const libro = req.body.libro;
    const descripcion = req.body.descripcion;
    const autor_id = req.body.autor_id;
    const categoria_id = req.body.categoria_id;

    conexion.query(
        "UPDATE libros SET ? WHERE id = ?",
        [{autor_id:autor_id,categoria_id:categoria_id, nombre: nombre, libro: libro, descripcion: descripcion }, id],
        (error) => {
            if (error) {
                console.error(error);
            } else {
                res.redirect("./");
            }
        });
}