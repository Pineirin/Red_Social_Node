// Módulos
var express = require('express');//te traes el módulo (una función o un objeto) express (función)
var app = express();//creamos una nueva aplicacion express y la guardamos

var log4js = require('log4js');

log4js.configure({
    appenders: { red_social: { type: 'file', filename: 'red_social.log' } },
    categories: { default: { appenders: ['red_social'], level: 'info' } }
});

var logger = log4js.getLogger('red_social');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
	// Debemos especificar todas las headers que se aceptan. Content-Type , token
	next();
});


var jwt = require('jsonwebtoken');
app.set('jwt',jwt);

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

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {    // obtener el token, puede ser un parámetro GET , POST o  HEADER
	var token = req.body.token || req.query.token || req.headers['token'];
	if (token != null) {        // verificar el token
		jwt.verify(token, 'secreto', function(err, infoToken) {
			if (err || (Date.now()/1000 - infoToken.tiempo) > 500 ){
				res.status(403); // Forbidden
				res.json({
					acceso : false,
					error: 'Token invalido o caducado'
				});            // También podríamos comprobar que intoToken.usuario existe
				return;
			} else {           // dejamos correr la petición
				res.usuario = infoToken.usuario;
				next();
			}
		});
	} else {
		res.status(403); // Forbidden
		res.json({
			acceso : false,
			mensaje: 'No hay Token'
		});
	}
});

// Aplicar routerUsuarioToken
app.use('/api/amigos', routerUsuarioToken);
app.use('/api/mensaje/*', routerUsuarioToken);
app.use('/api/conversacion/*', routerUsuarioToken);
app.use('/api/mensajes', routerUsuarioToken);

//routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
	if ( req.session.usuario ) {
		// dejamos correr la petición
		next();
	} else {
		res.redirect("/identificarse");
	}
});
// Aplicar routerUsuarioSession -> para proihibir o dejar entrar en una determinada página
//en cada una de estas páginas se aplica el routerUsuarioSession
app.use("/usuarios",routerUsuarioSession);
app.use("/relaciones/*",routerUsuarioSession);

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
require("./routes/rusuarios.js")(app, swig, gestorBD, logger);
require("./routes/rrelaciones.js")(app, swig, gestorBD, logger);
require("./routes/rapiusuarios.js")(app, swig, gestorBD);
require("./routes/rapimensajes.js")(app, swig, gestorBD);

//lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
});