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
    
    //var criterio = {
	//$or: [ {"_id": gestorBD.mongo.ObjectID(req.session._id) },
	//	{"_id": gestorBD.mongo.ObjectID(id) } ]
		
	//};
};