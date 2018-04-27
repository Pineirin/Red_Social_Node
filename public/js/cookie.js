success: function(respuesta) {
 console.log(respuesta.token); // <- Prueba
 token = respuesta.token;
 Cookies.set('token', respuesta.token);
 $( "#contenedor-principal" ).load( "widget-canciones.html");
},
error : function (error){
 Cookies.remove('token');
 $("#widget-login" )
 .prepend("<div class='alert alert-danger'>Usuario no encontrado</div>");
}
