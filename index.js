const express = require("express");

const app = express();

const puerto = 8000;

const RouterApi = require("./rutas/index");

const session = require('express-session');

const path = require('path');

const passport=require("passport");

//6 -Invocamos a bcrypt

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'vistas')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.set("views", "vistas");
app.set('view engine', 'ejs');

//7- variables de session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


RouterApi(app);

app.listen(puerto, () => {
	console.log("Conectado a http://localhost:8000/myapp");
})