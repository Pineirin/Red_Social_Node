module.exports = function(app,gestorBD) {

	// /api/mensaje?destino=Juan@hotmail.com&texto=Hola que tal
	app.get("/api/mensaje", function(req, res) {
		var destino = req.query.destino;
		var texto = req.query.texto;
		
		res.send(texto);
	});
	
}