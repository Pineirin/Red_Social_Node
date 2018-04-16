module.exports = function(app, swig, gestorBD) {
    app.get('/peticion/enviar/:id', function (req, res) {

        var relacion = {
            origen : gestorBD.mongo.ObjectID(req.session._id),
            destino : gestorBD.mongo.ObjectID(id),
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
};