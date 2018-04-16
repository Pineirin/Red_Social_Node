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
		};
		
		var criterio = {
				email : req.body.email,
		};
		
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

	});
	
	app.get("/identificarse", function(req, res) {
		var respuesta = swig.renderFile('views/bidentificacion.html', {});
		res.send(respuesta);
	});

	app.post("/identificarse", function(req, res){
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        var criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" + "?mensaje=Email o password incorrecto" + "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.redirect("/usuarios");
            }
        });
	});
	
	
	app.get("/registrarse", function(req, res) {
		var respuesta = swig.renderFile('views/bregistro.html', {});
		res.send(respuesta);
	});
	
	app.get('/desconectarse', function (req, res) {
		 req.session.usuario = null;
		 res.redirect("/identificarse");
	});

	app.get('/usuarios', function(req, res){
        var criterio = {};

        if( req.query.busqueda != null ){
            criterio = { "name" :  {$regex : ".*"+req.query.busqueda+".*"},
                "email" :  {$regex : ".*"+req.query.busqueda+".*"}};
        }
        
        
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
        	
        	var criterioRelaciones ={
        		origen : gestorBD.mongo.ObjectID(req.session._id)	
        	}
        	
        	gestorBD.obtenerRelaciones(criterioRelaciones, function(relaciones) {
        		
        		var idsRelaciones=[];
        		
        		for(var i=0;i<relaciones.length;i++){
        			idsRelaciones[i] = relaciones[i]._id;
        		}
        		
        		var criterioUsuariosEnRelaciones ={
        			"_id" : { $in : idsRelaciones }
        		}
        		
        		gestorBD.obtenerUsuarios(criterioUsuariosEnRelaciones, function(usuariosEnRelaciones) {
        			
        			var respuesta = swig.renderFile('views/busuarios.html',
                            {
                        		//Le paso 2 variables, una todos los usuarios 
                        		//y otra solo los que esten en peticiones
                                usuarios : usuarios
                            });
                        res.send(respuesta);
        		});
        	
        	});
        });
	});
};