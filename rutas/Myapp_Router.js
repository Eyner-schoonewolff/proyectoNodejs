const express = require("express");

const router = express.Router();

const conexion = require("../database/bd");

const miApp = require("../controladores/verificacion");

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
        conexion.query("SELECT * FROM libros WHERE id = ?", [id], (error, libros) => {
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
        res.render("agregar",{
            login: true,
            usuario: req.session.tipo_usuario,
            nombre: req.session.nombre,
        })
    }else{
        return res.redirect("/myapp/home");
    }
});

router.get("/editar/:id",(req,res)=>{
    if(req.session.loggedin && req.session.tipo_usuario == 1){
        const id=req.params.id;
        conexion.query("SELECT * FROM libros WHERE id = ?",[id],(error,libros)=>{
            if(error){
                throw error;
            }else{
                res.render("editar",{
                    login:true,
                    curso:libros[0],
                    usuario:req.session.tipo_usuario,
                    nombre:req.session.nombre
                });
            }
        })
    }else{
        res.redirect("/myapp/home");
    }
})

router.post("/auth", miApp.auth);
router.post("/guardar",miApp.guardar);
router.post("/actualizar",miApp.actualizar);

module.exports = router;