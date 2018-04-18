module.exports = function(app, swig, gestorBD) {
    app.get('/peticion/enviar/:id', function (req, res) {
    	
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

    app.get('/peticiones', function(req, res){

        var criterio ={ destino: req.session.usuario };

        gestorBD.obtenerRelaciones(criterio, function(relaciones) {

        	var peticiones=[];

        	for(var i=0;i<relaciones.length;i++){
                var criterioUsuarios = {email: relaciones[i].origen};

                gestorBD.obtenerUsuarios(criterioUsuarios, function (usuarios) {
                    var usuario ={
                        _id : usuarios[i]._id,
                        email : usuarios[i].email,
                        name : usuarios[i].name,
                    };
                    peticiones[i] = usuario;
                });
        	}


        	var respuesta = swig.renderFile('views/bpeticiones.html',
				{
					peticiones : peticiones
				});
        	res.send(respuesta);
        });

    });
    
    //var criterio = {
	//$or: [ {"_id": gestorBD.mongo.ObjectID(req.session._id) },
	//	{"_id": gestorBD.mongo.ObjectID(id) } ]
		
	//};
};