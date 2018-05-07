module.exports = function(app, swig, gestorBD) {
	
	app.post("/api/identificarse", function(req, res) {
		 
		 var email = req.body.email;
		 var password = req.body.password;
		 
		 var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
         .update(password).digest('hex');

		 var criterio = {
				 email : email,
				 password : seguro
		 };
		 
		 gestorBD.obtenerUsuarios(criterio, function(usuarios) {
	            if (usuarios == null || usuarios.length == 0) {
	                res.status(401);
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

    app.get("/api/amigos", function(req, res) {
    	
        var criterio ={ $or: [ {"destino": res.usuario , "estado" : "ACEPTADA"}, {"origen": res.usuario , "estado" : "ACEPTADA"} ]};

        gestorBD.obtenerRelaciones(criterio, function(relaciones) {
            var peticiones=[];


            var usuariosSolicitantes = [];
            for(var i=0;i<relaciones.length;i++){
                if (relaciones[i].destino == res.usuario) {
                    usuariosSolicitantes.push(relaciones[i].origen);
                }
                if (relaciones[i].origen == res.usuario){
                    usuariosSolicitantes.push(relaciones[i].destino);
                }
            }


            var criterio = {"email" : { $in : usuariosSolicitantes} };
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null) {
                    res.status(500);
                    res.json({
						error : "se ha producido un error"
                    });
                }else {
                    res.status(200);
                    res.send( JSON.stringify(usuarios) );
                }
            });
        });
    });
    
    app.post("/api/amigos", function(req, res) {
    	
    	var mensajesOrdenados=req.body.mensajes;
    	
        var criterio ={ $or: [ {"destino": res.usuario , "estado" : "ACEPTADA"}, {"origen": res.usuario , "estado" : "ACEPTADA"} ]};

        gestorBD.obtenerRelaciones(criterio, function(relaciones) {
            var peticiones=[];


            var usuariosSolicitantes = [];
            for(var i=0;i<relaciones.length;i++){
                if (relaciones[i].destino == res.usuario) {
                    usuariosSolicitantes.push(relaciones[i].origen);
                }
                if (relaciones[i].origen == res.usuario){
                    usuariosSolicitantes.push(relaciones[i].destino);
                }
            }


            var criterio = {"email" : { $in : usuariosSolicitantes} };
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null) {
                    res.status(500);
                    res.json({
						error : "se ha producido un error"
                    });
                }else {
                	var usuariosOrdenados=[];
                	for (var i = 0; i < mensajesOrdenados.length; i++) {
                		 var criterioMensaje ={ 
                				 $or: [ {"destino": res.usuario},
                					 {"emisor": res.usuario} ]
                				 
                		 };
                		 
                		 gestorBD.obtenerMensajes(criterioMensaje, function(mensajes) {
                			var usuarioAInsertar;
                			 //console.log(mensajes[0]);
							if (mensajes[0].emisor == res.usuario) {
								usuarioAInsertar = mensajes[0].destino;
							} else {
								usuarioAInsertar = mensajes[0].emisor;
							}

							if (usuariosOrdenados.includes(usuarioAInsertar)) {

							} else {
								usuariosOrdenados.push(usuarioAInsertar);
								console.log(usuarioAInsertar);
							}
							
                			
                		 });
                		 
					}
                    res.status(201);
                    res.send( JSON.stringify(usuarios) );
                }
            });
        });
    });
    
    

};