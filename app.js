// Módulos
var express = require('express');//te traes el módulo (una función o un objeto) express (función)
var app = express();//creamos una nueva aplicacion express y la guardamos

//Uso del módulo de la sesion
var expressSession = require('express-session');
app.use(expressSession({
	secret: 'abcdefg', //codificación de los identificadores de sesion
	resave: true, //¿se puede modificar la informacion de la sesion? Si
	saveUninitialized: true //¿se puede inicializar la info de la sesión? Si
}));

//Usamos el móludo de encriptación
var crypto = require('crypto');

//Usamos swig (motor de plantillas)
var swig = require('swig');

//Para poder subir imagenes y audios
//No se usa, se integra en la aplicación
var fileUpload = require('express-fileupload');
app.use(fileUpload());

//Usamos mongodb
var mongo = require('mongodb');

//Declaramos el uso de POST (ya podemos acceder al body)
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Uso del objeto gestorBD
var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

//routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
	console.log("routerUsuarioSession");
	if ( req.session.usuario ) {
		// dejamos correr la petición
		next();
	} else {
		console.log("va a : "+req.session.destino)
		res.redirect("/identificarse");
	}
});
// Aplicar routerUsuarioSession -> para proihibir o dejar entrar en una determinada página
//en cada una de estas páginas se aplica el routerUsuarioSession
//app.use("/comentarios/agregar",routerUsuarioSession);

//se declara que estamos permitiendo el acceso a ficheros estaticos
//en la carpeta "public
//Ej: http://localhost:8081/img/user.png" y accedemos al archivo
app.use(express.static('public'));

//Variable de configuración
app.set('port', 8081);

//Establecemos la conexión
app.set('db','mongodb://admin:sdi@ds029655.mlab.com:29655/redsocial');

//Agregamos dos variables nuevas
app.set('clave','abcdefg');//clave de cifrado
app.set('crypto',crypto);//referencia al módulo crypto

require("./routes/rhome.js")(app, swig);
require("./routes/rusuarios.js")(app, swig, gestorBD);

//lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
});