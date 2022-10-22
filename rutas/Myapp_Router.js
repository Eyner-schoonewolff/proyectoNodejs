const express = require("express");

const multer = require('multer');

const router = express.Router();

const conexion = require("../database/bd");

const miApp = require("../controladores/verificacion");

const storage = require('../database/multer');

const upload = multer({ storage })

router.get("/", (req, res) => {
    if (!req.session.loggedin) {
        return res.render("login", {
            login: false
        });
    } else {
        return res.redirect("/myapp/home")
    }
})

router.get("/cerrar", (req, res) => {
    req.session.destroy(() => {
        res.redirect('./')
    })
});

router.get("/home", (req, res) => {
    if (req.session.loggedin) {
        conexion.query("SELECT * FROM libros WHERE estado = 1", (error, libros) => {
            if (error) {
                throw error;
            } else {
                res.render("home",
                    {
                        libros,
                        login: true,
                        usuario: req.session.tipo_usuario,
                        nombre: req.session.nombre,
                    }
                );
            }
        });
    } else {
        return res.redirect("/myapp");
    }
});

router.get("/leer/:id", (req, res) => {
    if (req.session.loggedin) {
        const id = req.params.id;
        conexion.query(
            "SELECT L.id,A.autor,C.categoria,L.nombre,L.libro,L.descripcion FROM libros L INNER JOIN categorias C ON L.categoria_id = C.id INNER JOIN autores A ON L.autor_id = A.id WHERE L.id = ?",
            [id], (error, libros) => {
                if (error) {
                    throw error;
                } else {
                    res.render("leer",
                        {
                            login: true,
                            curso: libros[0],
                            usuario: req.session.tipo_usuario,
                            nombre: req.session.nombre,
                        });
                }
            });
    } else {
        return res.redirect("/myapp/home");
    }
})

router.get("/eliminar/:id", (req, res) => {
    if (req.session.loggedin && req.session.tipo_usuario == 1) {
        const id = req.params.id;
        conexion.query("UPDATE libros SET estado = 0 WHERE id = ?", [id], (error, libros) => {
            if (error) {
                throw error;
            } else {
                res.redirect("../");
            }
        })

    } else {
        return res.redirect("/myapp/home");
    }
})

router.get("/agregar", (req, res) => {
    if (req.session.loggedin && req.session.tipo_usuario == 1) {
        const consultas = [
            "SELECT * FROM autores",
            "SELECT * FROM categorias"
        ];
        conexion.query(
            consultas.join(";"),
            (error, resultados) => {
                if (error) {
                    throw error;
                } else {
                    const autores = resultados[0];
                    const categorias = resultados[1];
                    res.render("agregar", {
                        login: true,
                        autores,
                        categorias,
                        usuario: req.session.tipo_usuario,
                        nombre: req.session.nombre,
                    });
                }
            }
        );

    } else {
        return res.redirect("/myapp/home");
    }
});

router.get("/editar/:id", (req, res) => {
    if (req.session.loggedin && req.session.tipo_usuario == 1) {
        const id = req.params.id;
        const consultas=[
            "SELECT L.id,L.autor_id,A.autor,L.categoria_id,C.categoria,L.nombre,L.libro,L.descripcion FROM libros L INNER JOIN categorias C ON L.categoria_id = C.id INNER JOIN autores A ON L.autor_id = A.id WHERE L.id = ?",
            "SELECT * FROM autores",
            "SELECT * FROM categorias"
        ]
        conexion.query(consultas.join(";"),[id], 
         (error, resultados) => {
            if (error) {
                throw error;
            } else { 
                const curso= resultados[0][0];
                const autores = resultados[1];
                const categorias = resultados[2];

                res.render("editar", {
                    login: true,
                    curso,
                    autores,
                    categorias,
                    usuario: req.session.tipo_usuario,
                    nombre: req.session.nombre
                });     
            }
        })
    } else {
        res.redirect("/myapp/home");
    }
})

router.post("/auth", miApp.auth);
router.post("/guardar",upload.single('file'),miApp.guardar);
router.post("/actualizar",upload.single('file'), miApp.actualizar);

module.exports = router;