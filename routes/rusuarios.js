//rusuarios es un módulo al que se le llama
//con module.exports se declara el módulo
//se le pasa como parámetro en el constructor la referencia a app
module.exports = function(app, swig, gestorBD, logger) {
	
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
							logger.info("Usuario " + usuario.email + " registrado");
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
		var respuesta = swig.renderFile('views/bidentificacion.html',
			{
                enSesion : req.session.usuario
			});
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
                logger.info("Usuario " + req.session.usuario + " identificado");
                res.redirect("/usuarios");
            }
        });
	});
	
	
	app.get("/registrarse", function(req, res) {
		var respuesta = swig.renderFile('views/bregistro.html',
			{
                enSesion : req.session.usuario
			});
		res.send(respuesta);
	});
	
	app.get('/desconectarse', function (req, res) {
         logger.info("Usuario " + req.session.usuario + " desconectado");
		 req.session.usuario = null;
		 res.redirect("/identificarse");
	});

    function contains(lista, email){
        for(var i=0;i<lista.length;i++){
            if(lista[i]==email){
                return true;
            }
        }
        return false;
    }

	app.get('/usuarios', function(req, res){
        var criterio = {};

        if( req.query.busqueda != null ){
            criterio = { $or: [ {"name" :  {$regex : ".*"+req.query.busqueda+".*"}},
            	{"email" :  {$regex : ".*"+req.query.busqueda+".*"}} ] }
        }
        
        var pg = parseInt(req.query.pg); // Es String !!!
		if ( req.query.pg == null){ // Puede no venir el param
			pg = 1;
		}
		
        gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
            if (usuarios == null) {
                res.send("Error al listar ");
            }else {
            	
            	var criterioRelaciones ={
            			$or: [ {"origen": req.session.usuario },
            				{"destino": req.session.usuario } ]
            	}
            	
            	gestorBD.obtenerRelaciones(criterioRelaciones, function(relaciones) {
            		
            		var emailsEnRelaciones=[];
            		
            		for(var i=0;i<relaciones.length;i++){
            			var origen=relaciones[i].origen;
            			var destino=relaciones[i].destino;
            			if(!(contains(emailsEnRelaciones,origen))){
            				emailsEnRelaciones[emailsEnRelaciones.length] = origen;
            			}
            			if(!(contains(emailsEnRelaciones,destino))){
            				emailsEnRelaciones[emailsEnRelaciones.length] = destino;
            			}
            		}
            		
            		var nuevosUsuarios = [];
            		
            		for(var i=0;i<usuarios.length;i++){
            			var usuario ={
            				_id : usuarios[i]._id,
            				email : usuarios[i].email,
            				name : usuarios[i].name,
            				tieneRelacion : false
            			}
            			
            			if(contains(emailsEnRelaciones, usuario.email)){
            				usuario.tieneRelacion=true;
            			}
            			
            			nuevosUsuarios[i]=usuario;
            			
            		}
            		
            		var pgUltima = total/4;
                    if (total % 4 > 0 ){ // Sobran decimales
                    	pgUltima = pgUltima+1;
                    }
                    
            		var respuesta = swig.renderFile('views/busuarios.html',
                                {
            						nuevosUsuarios : nuevosUsuarios,
    								enSesion : req.session.usuario,
    								pgActual : pg,
    								pgUltima : pgUltima
                                });
                    res.send(respuesta);
            		
            	
            	});
            }
    	});
        
	});


};