module.exports = function(app,swig) {
	
	app.get("/home", function(req, res) {
		var respuesta = swig.renderFile('views/bindex.html',
			{
                enSesion : req.session.usuario
			});
		res.send(respuesta);
	});
	
	app.get("/", function(req, res) {
		res.redirect("/home");
	});
};