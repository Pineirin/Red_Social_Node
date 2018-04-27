module.exports = function(app, swig, gestorBD) {

	app.post("/api/mensaje/:destinatario", function(req, res) {//Se puede haccer esto en un post?
		 
		 var destinatario = req.params.destinatario;
		 var texto = req.body.texto;

		 var criterio = {
				 origen : req.session.usuario,//¿?¿Sacar email de usuario en sesión?
				 destino : destinatario
		 }
		 
		 gestorBD.obtenerRelaciones(criterio, function(relaciones) {
	            if (relaciones == null || relaciones.length == 0) {
	                res.status(401);
	                res.json({error : "No son amigos"});
	            } else {
	            	res.json({mensaje : "Son amigos"});
	            	//Insertar mensaje
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