const express = require("express");

const myAppRouter = require("../rutas/Myapp_Router");


function RouterApi(app) {
    router = express.Router();
    app.use(router);
    router.use("/myApp",myAppRouter);
}

module.exports = RouterApi;