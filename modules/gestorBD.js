module.exports = {
	mongo : null,
	app : null,
	init : function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
	},
    obtenerUsuariosPg : function(criterio,pg,funcionCallback){
	    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
	        if (err) {
	            funcionCallback(null);
	        } else {
	            var collection = db.collection('usuarios');
	            collection.count(function(err, count){

                    collection.find(criterio).skip( (pg-1)*4 ).limit( 4 )
                        .toArray(function(err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(usuarios, count);
                            }
                            db.close();
                        });
	            });
	        }
	    });
	    },
	insertarUsuario : function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.insert(usuario, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	

	obtenerUsuarios : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.find(criterio).toArray(function(err, usuarios) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(usuarios);
					}
					db.close();
				});
			}
		});
	},
	
	actualizarUsuario : function(criterio, usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.update(criterio, {
					$set : cancion
				}, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	
    insertarRelacion : function(relacion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('relaciones');
                collection.insert(relacion, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    
    obtenerRelaciones : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('relaciones');
				collection.find(criterio).toArray(function(err, relaciones) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(relaciones);
					}
					db.close();
				});
			}
		});
	},
	
	actualizarRelacion : function(criterio, relacion, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('relaciones');
				collection.update(criterio, {
					$set : relacion
				}, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	
	insertarMensaje : function(mensaje, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('mensajes');
				collection.insert(mensaje, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	
	obtenerMensajes : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('mensajes');
				collection.find(criterio).toArray(function(err, mensajes) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(mensajes);
					}
					db.close();
				});
			}
		});
	},
	
	actualizarMensaje : function(criterio, mensaje, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('mensajes');
				collection.update(criterio, {
					$set : mensaje
				}, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	
};