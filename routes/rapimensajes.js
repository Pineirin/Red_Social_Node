module.exports = function(app, swig, gestorBD) {

	app.post("/api/mensaje/:destinatario", function(req, res) {//Se puede haccer esto en un post?
		 
		 var destinatario = req.params.destinatario;
		 var texto = req.body.texto;
		 
		 var mensaje = {
				 emisor : req.session.usuario,//¿?¿Sacar email de usuario en sesión?
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