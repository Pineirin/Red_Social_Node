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

    /*app.get("/api/amigos", function(req, res) {
    	
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
    });*/
    
    app.get("/api/amigos", function(req, res) {
    	
    	var criterioMensaje ={ $or: [ {"emisor": res.usuario}, {"destino": res.usuario} ]};
		 
		 gestorBD.obtenerMensajes(criterioMensaje, function(mensajes) {
	         if(mensajes==null){
	        	 res.status(500);
	        	 res.json({error : "Error al devolver los mensajes"})
	         }
	         else{
	        	 
	        	 var mensajesOrdenados = [];
	        	 for (var i = mensajes.length-1; i >= 0; i--) {
	        		 mensajesOrdenados.push(mensajes[i]);
				}
	        	 
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
	                     	var usuariosOrdenadosFinales=[];
	                     	var emailOrdenados=[];
	                     	var usuariosOrdenados=[];
	                     	var usuarioAInsertar;
	                     	for (var i = 0; i < mensajesOrdenados.length; i++) {

	     							if (mensajesOrdenados[i].emisor == res.usuario) {
	     								usuarioAInsertar = mensajesOrdenados[i].destino;
	     							} else {
	     								usuarioAInsertar = mensajesOrdenados[i].emisor;
	     							}

	     							if (emailOrdenados.includes(usuarioAInsertar)) {

	     							} else {
	     								emailOrdenados.push(usuarioAInsertar);
	     							}
	     							
	                     	}
							
	                     	 var criterioUsuario = {"email" : { $in : emailOrdenados} };
	                     	 
	     					 gestorBD.obtenerUsuarios(criterioUsuario, function (usuariosOrdenadosConMensajes) {
	     						 
	     						 var criterioUsuarioSinMensajes = {"email" : { $nin : emailOrdenados, $ne : res.usuario, $in : usuarios}};
	     						 
	     						 gestorBD.obtenerUsuarios(criterioUsuarioSinMensajes, function (usuariosSinMensajes) {
	     							 
	     							 for (var i = 0; i < emailOrdenados.length; i++) {
	     								 for (var j = 0; j < usuariosOrdenadosConMensajes.length; j++) {
	     									 
	     									if(usuariosOrdenadosConMensajes[j].email==emailOrdenados[i]){
												usuariosOrdenadosFinales.push(usuariosOrdenadosConMensajes[j]);
											}
										}
									 }
	     							 for (var i = 0; i < usuariosSinMensajes.length; i++) {
	     								usuariosOrdenadosFinales.push(usuariosSinMensajes[i]);
	     							 }
	     							
	     							 res.status(200);
	     			                 res.send( JSON.stringify(usuariosOrdenadosFinales) );
	     						 });
	     					 });
	     					 
	                     }
	                 });
	             });
	         }
	         
	     });
    	
    });
    
    

};