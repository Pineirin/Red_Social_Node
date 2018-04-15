//rusuarios es un módulo al que se le llama
//con module.exports se declara el módulo
//se le pasa como parámetro en el constructor la referencia a app
module.exports = function(app, swig, gestorBD) {
	
	app.post('/usuario', function(req, res) {
		//encriptamos la password
		var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
				.update(req.body.password).digest('hex');
		
		
		var usuario = {
			email : req.body.email,
			name : req.body.name,
			password : seguro 
		}
		
		var criterio = {
				email : req.body.email,
		}
		
		gestorBD.obtenerUsuarios(criterio, function(usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				
				var password = req.body.password;
				var rePassword = req.body.rePassword;
				if(password == rePassword){
					
					gestorBD.insertarUsuario(usuario, function(id) {
						if (id == null) {
							res.redirect("/registrarse?mensaje=Error al registrarse");
						} else {
							res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
						}
					});
				}
				else{
					res.redirect("/registrarse?mensaje=Las contraseñas no coinciden");
				}
				
			}
			else {
				req.session.usuario = usuarios[0].email;
				res.redirect("/registrarse?mensaje=El email ya existe");
			}
		});

	})
	
	app.get("/identificarse", function(req, res) {
		var respuesta = swig.renderFile('views/bidentificacion.html', {});
		res.send(respuesta);
	});
	
	
	app.get("/registrarse", function(req, res) {
		var respuesta = swig.renderFile('views/bregistro.html', {});
		res.send(respuesta);
	});
	
	app.get('/desconectarse', function (req, res) {
		 req.session.usuario = null;
		 res.send("Usuario desconectado");
	})
};