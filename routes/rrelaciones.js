module.exports = function(app, swig, gestorBD) {
    app.get('/relaciones/solicitar/:id', function (req, res) {
    	
    	var criterioDestino = {
				"_id" : gestorBD.mongo.ObjectID(req.params.id)
		};
		
		gestorBD.obtenerUsuarios(criterioDestino, function(usuarios) {
			
				var relacion = {
		            origen : req.session.usuario,
		            destino : usuarios[0].email,
		            estado : "ENVIADA"
		        };

		        gestorBD.insertarRelacion(relacion, function(id) {
		            if (id == null) {
		                res.redirect("/usuarios?mensaje=Error al enviar peticion");
		            } else {
		            	res.redirect("/usuarios?mensaje=Peticion de amistad enviada");
		        	}
		        });
		});

    });

    app.get('/relaciones/solicitadas', function(req, res){

        var criterio ={ "destino": req.session.usuario , "estado" : "ENVIADA"};

        gestorBD.obtenerRelaciones(criterio, function(relaciones) {
            var peticiones=[];


			var usuariosSolicitantes = [];
        	for(var i=0;i<relaciones.length;i++){
                usuariosSolicitantes.push(relaciones[i].origen);
			}

            var pg = parseInt(req.query.pg); // Es String !!!
			if ( req.query.pg == null){ // Puede no venir el param
				pg = 1;
			}

			var criterio = {"email" : { $in : usuariosSolicitantes} };
        	gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
                if (usuarios == null) {
                    res.send("Error al listar ");
                }else {
                    var pgUltima = total/4;
                    if (total % 4 > 0 ){ // Sobran decimales
                    	pgUltima = pgUltima+1;
                    }
                    var respuesta = swig.renderFile('views/bpeticiones.html',
                        {
                            enSesion : req.session.usuario,
                            peticiones: usuarios,
                            pgActual : pg,
							 pgUltima : pgUltima
                        });
                    res.send(respuesta);
                }
        	});
        });
    });

    app.get('/relaciones/aceptadas', function(req, res){

        var criterio ={ "destino": req.session.usuario , "estado" : "ACEPTADA"};

        gestorBD.obtenerRelaciones(criterio, function(relaciones) {
            var peticiones=[];


            var usuariosSolicitantes = [];
            for(var i=0;i<relaciones.length;i++){
                usuariosSolicitantes.push(relaciones[i].origen);
            }

            var pg = parseInt(req.query.pg); // Es String !!!
            if ( req.query.pg == null){ // Puede no venir el param
                pg = 1;
            }

            var criterio = {"email" : { $in : usuariosSolicitantes} };
            gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
                if (usuarios == null) {
                    res.send("Error al listar ");
                }else {
                    var pgUltima = total/4;
                    if (total % 4 > 0 ){ // Sobran decimales
                        pgUltima = pgUltima+1;
                    }
                    var respuesta = swig.renderFile('views/bamigos.html',
                        {
                            enSesion : req.session.usuario,
                            peticiones: usuarios,
                            pgActual : pg,
                            pgUltima : pgUltima
                        });
                    res.send(respuesta);
                }
            });
        });
    });
    
    app.get('/relacion/aceptar/:id', function (req, res) {
				
    	var criterioOrigen = {
				"_id" : gestorBD.mongo.ObjectID(req.params.id)
		};
		
		gestorBD.obtenerUsuarios(criterioOrigen, function(usuarios) {
			
				var criterio = {
					"origen" : usuarios[0].email,
					"destino" : req.session.usuario
				};
				
				gestorBD.obtenerRelaciones(criterio, function(relaciones) {
						
						var relacion=relaciones[0];
						
						relacion.estado="ACEPTADA";

						gestorBD.actualizarRelacion(criterio, relacion, function(result) {
							if (result == null) {
								res.redirect("/relaciones/solicitadas?mensaje=Error al aceptar peticion");
							} else {
								res.redirect("/relaciones/solicitadas?mensaje=Se ha aceptado la petición correctamente");
							}
							
					});
				});
		});
			

    });
};