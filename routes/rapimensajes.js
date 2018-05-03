module.exports = function(app, swig, gestorBD) {

	app.post("/api/mensaje/:destinatario", function(req, res) {//Se puede haccer esto en un post?
		 
		 var destinatario = req.params.destinatario;
		 var texto = req.body.texto;
		 
		 var criterioAmigos ={ $or: [ {"destino": res.usuario , "origen":destinatario ,"estado" : "ACEPTADA"}, {"origen": res.usuario , "destino": destinatario, "estado" : "ACEPTADA"} ]};

	     gestorBD.obtenerRelaciones(criterioAmigos, function(relaciones) {
	         if(relaciones==null || relaciones.length==0){
	        	 res.status(500);
	        	 res.json({error : "No eres amigo del usuario destinatario"})
	         }
	         else{
	        	 var mensaje = {
	    				 emisor : res.usuario,
	    				 destino : destinatario,
	    				 texto : texto,
	    				 leido : false
	    		 }
	    		 
	    		 gestorBD.insertarMensaje(mensaje, function(id){
	    			 if (id == null) {
	    				 res.status(500);
	    				 res.json({
	    					 error : "se ha producido un error al mandar el mensaje"})
	    			 } else {
	    				 res.status(201);
	    				 res.json({
	    					 mensaje : "Mensaje enviado",
	    					 _id : id
	    				 })
	    			 }
	    		 });
	         }
	     });
		 
		
	});
	
	app.get("/api/conversacion/:destinatario", function(req, res) {//Se puede haccer esto en un post?
		 
		 var destinatario = req.params.destinatario;
		 var texto = req.body.texto;
		 
		 var criterioMensaje ={ $or: [ {"emisor": res.usuario , "destino":destinatario}, {"destino": res.usuario , "emisor": destinatario} ]};

	     gestorBD.obtenerMensajes(criterioMensaje, function(mensajes) {
	         if(mensajes==null){
	        	 res.status(500);
	        	 res.json({error : "Error al ver los mensajes"})
	         }
	         else if(mensajes.length==0){
	        	 res.status(200);
	        	 res.json({error : "No hay mensajes todavía"})
	         }
	         else{
	        	 res.status(200);
	        	 res.send( JSON.stringify(mensajes) );
	    	}
	     });
		 
		
	});
	
	app.put("/api/conversacion/leer/mensaje/:id", function(req, res) {
		 
		 var criterioMensaje ={ 
				 "_id" :  gestorBD.mongo.ObjectID(req.params.id),
				 "destino" : res.usuario
		 };
		 
		 gestorBD.obtenerMensajes(criterioMensaje, function(mensajes) {
	         var mensaje = mensajes[0];
	         if(mensaje!=null){
	        	 mensaje.leido=true;
	        	 gestorBD.actualizarMensaje(criterioMensaje, mensaje, function(result) {
	    			 if (result == null) {
	    				res.status(500);
	    				res.json({
	    					error : "Se ha producido un error al leer el mensaje"
	    				})
	    			} else {
	    				res.status(200);
	    				res.json({
	    					mensaje : "Mensaje modificado",
	    					_id : req.params.id
	    				})
	    			}
	    		});
	         }
	         else{
	        	 res.status(500);
 				 res.json({
 					error : "No se ha podido leer el mensaje correctamente"
 				})
	         }
	     });
		
	});
	
	
	
	//Ejemplo para el futuro
	 /*app.post("/api/cancion", function(req, res) {
		 var cancion = {
				 nombre : req.body.nombre,
				 genero : req.body.genero,
				 precio : req.body.precio,
		 }
		 // ¿Validar nombre, genero, precio?

		 gestorBD.insertarCancion(cancion, function(id){
			 if (id == null) {
				 res.status(500);
				 res.json({
					 error : "se ha producido un error"})
			 } else {
				 res.status(201);
				 res.json({
					 mensaje : "canción insertarda",
					 _id : id
				 })
			 }
		 });

	});*/
}