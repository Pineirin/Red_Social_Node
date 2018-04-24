module.exports = function(app,gestorBD) {
	
	//Ej: /api/identificarse?email=adripc@live.com&password=123456
	app.get("/api/identificarse", function(req, res) {
		 
		 var email = req.query.email;
		 var password = req.query.password;
		 
		 var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
         .update(password).digest('hex');

		 var criterio = {
				 email : email,
				 password : seguro
		 }
		 
		 gestorBD.obtenerUsuarios(criterio, function(usuarios) {
	            if (usuarios == null || usuarios.length == 0) {
	                res.status(500);
	                res.json({error : "Inicio de sesión incorrecto"});
	            } else {
	            	var token = app.get('jwt').sign(
	       				 {usuario: criterio.email , tiempo: Date.now()/1000},
	       				 "secreto");
	                res.status(200);
	                res.json({token : token});
	            }
	     });
	});
	
};